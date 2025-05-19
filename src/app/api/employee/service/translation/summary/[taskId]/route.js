import { NextResponse } from "next/server";
import DBConnect from "@/app/database/lib/db.js";
import Task from "@/app/database/models/Task";
import getUserFromToken from "@/app/database/lib/auth";
import {
  ADMIN,
} from "@/app/database/constants/role.js";
import { ABUSIVE_OR_SENSELESS_SENTENCE, LANGUAGE_CODE_MAP } from "@/app/database/constants/constants";
import ExcelJS from "exceljs";

export async function GET(request, context) {
  try {
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

    await DBConnect();

    const { taskId } = await context.params;

    const task = await Task.findById(taskId)
      .populate(["qualityAssurance", "candidate" ,"sentences", "fromLanguage", "toLanguage"]);

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    worksheet.columns = [
      { header: "Index", key: "index", width: 30 },
      { header: "Original Sentence", key: "original", width: 50 },
      { header: "Translated Sentence", key: "translated", width: 50 },
      { header: "Reason", key: "reason", width: 50 },
    ];

    worksheet.views = [
      { state: 'frozen', ySplit: 1 },
    ];

    worksheet.columns.forEach((col) => {
      col.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    task.sentences.forEach((sentence, index) => {
      const idStr = sentence._id.toString();
      const lastFive = idStr.slice(-5);

      const fromLang = task.fromLanguage.language.toUpperCase();
      const toLang = task.toLanguage.language.toUpperCase();

      const fromLangCode = LANGUAGE_CODE_MAP[fromLang] || fromLang.slice(0, 2); // fallback to first 2 letters
      const toLangCode = LANGUAGE_CODE_MAP[toLang] || toLang.slice(0, 2);

      const uniqueIndex = String(index + 1).padStart(5, "0"); // e.g., 00001

      const customId = `Teja-${fromLangCode}-TO-${toLangCode}-${lastFive}-${uniqueIndex}`;

      const row = worksheet.addRow({
        index: customId,
        original: sentence.sentence || "-",
        translated: sentence.translatedSentence || "-",
        reason: sentence.isAbusive ? ABUSIVE_OR_SENSELESS_SENTENCE : "-",
      });

      if (sentence.isAbusive) {
        row.eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFF0000" },
          };
          cell.font = {
            color: { argb: "FFFFFFFF" },
            bold: true,
          };
        });
      }
    });

    const infoSheet = workbook.addWorksheet("Sheet2");

    const assignedDate = new Date(task.createdAt).toLocaleDateString();
    const endDate = new Date(task.deadLine).toLocaleDateString();

    infoSheet.addRows([
      ["Task Name", task.taskName || "-"],
      ["Task Assigned Date", assignedDate],
      ["Task END Date", endDate],
      ["QA", task.qualityAssurance?.fullName || "-"],
      ["Candidate", task.candidate?.fullName || "-"],
    ]);

    infoSheet.columns = [
      { width: 25 },
      { width: 50 },
    ];

    infoSheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.font = { bold: true };
      });
    });




    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${task.taskName.replace(" ","-")}.xlsx"`,
      },
    });

  } catch (error) {
    console.error("Error in /api/employee/service/translation/summary/:taskId GET:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 },
    );
  }
}

