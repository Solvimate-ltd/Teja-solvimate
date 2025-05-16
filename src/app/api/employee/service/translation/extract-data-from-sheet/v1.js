import { NextResponse } from "next/server";
import multer from "multer";
import path from "path";
import fs from "fs";
import * as XLSX from "xlsx";
import getUserFromToken from "@/app/database/lib/auth";
import { ADMIN } from "@/app/database/constants/role.js";

// Set up multer for file upload handling
const upload = multer({
  dest: "./public/uploads", // Temporary upload directory
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request) {
  const { user, error } = await getUserFromToken(request);

  if (error) {
    const status = error === "No token found" ? 401 : 403;
    return NextResponse.json({ message: error }, { status });
  }

  if (user.role !== ADMIN) {
    return NextResponse.json(
      {
        message: `Access denied. Only '${ADMIN}' can extract the data from Sheets.`,
      },
      { status: 403 },
    );
  }

  return new Promise((resolve) => {
    upload.single("file")(request, {}, async (err) => {
      if (err) {
        return resolve(
          NextResponse.json(
            { message: "File upload failed", error: err.message },
            { status: 500 },
          ),
        );
      }

      try {
        const formData = await request.formData();
        const sheetName = formData.get("sheetName");
        const columnName = formData.get("columnName");
        const file = formData.get("file");

        if (!sheetName || !columnName || !file) {
          return resolve(
            NextResponse.json(
              { message: "Sheet name, column name, and file are required" },
              { status: 400 },
            ),
          );
        }

        // Ensure the upload directory exists if not then I will create
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Saving file
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${Date.now()}-${file.name}`;
        const filePath = path.join(uploadDir, filename);

        await fs.promises.writeFile(filePath, buffer);
        // console.log("File written to:", filePath);

        // Retry reading workbook, its important sometime OS interupt for eg: file is freshly created yet and
        // the process who creates file still accessing that file then we have to wait
        // I can implement setTimeout but there is no specfic time that after file will
        // be available to access.
        let retries = 5;
        const delay = 1000;
        let workbook;

        while (retries > 0) {
          try {
            const fileBuffer = await fs.promises.readFile(filePath);
            workbook = XLSX.read(fileBuffer);
            break;
          } catch {
            retries -= 1;
            await new Promise((res) => setTimeout(res, delay));
          }
        }

        if (!workbook) {
          await fs.promises.unlink(filePath); // deleting file
          return resolve(
            NextResponse.json(
              { message: "Unable to read the file after retries" }, // may be user send corrupt file
              { status: 500 },
            ),
          );
        }

        if (!workbook.SheetNames.includes(sheetName)) {
          await fs.promises.unlink(filePath);
          return resolve(
            NextResponse.json({ message: "Sheet not found" }, { status: 404 }),
          );
        }

        const sheet = workbook.Sheets[sheetName];

        // Convert column letter to index
        function getColumnIndex(letter) {
          let col = 0;
          for (let i = 0; i < letter.length; i++) {
            col = col * 26 + (letter.charCodeAt(i) - 64);
          }
          return col - 1;
        }

        const columnIndex = getColumnIndex(columnName.toUpperCase());
        const range = XLSX.utils.decode_range(sheet["!ref"]);

        // Get header cell (first row)
        const headerCellRef = XLSX.utils.encode_cell({
          c: columnIndex,
          r: range.s.r,
        });
        const headerCell = sheet[headerCellRef];
        const header = headerCell ? headerCell.v : null;

        // Extract column data (excluding header row)
        const data = [];
        for (let row = range.s.r + 1; row <= range.e.r; row++) {
          const cellRef = XLSX.utils.encode_cell({ c: columnIndex, r: row });
          const cell = sheet[cellRef];
          data.push(cell?.v ?? null);
        }

        await fs.promises.unlink(filePath); // Clean up

        return resolve(
          NextResponse.json({
            sheetName,
            header,
            data,
          }),
        );
      } catch (error) {
        console.error("Processing error:", error);
        return resolve(
          NextResponse.json(
            { message: "Error processing file", error: error.message },
            { status: 500 },
          ),
        );
      }
    });
  });
}

export async function GET() {
  return NextResponse.json(
    { message: "Only POST type request is allowed" },
    { status: 405 },
  );
}
