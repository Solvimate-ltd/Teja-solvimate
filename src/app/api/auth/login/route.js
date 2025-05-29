import { NextResponse } from "next/server";
import dbConnect from "../../../database/lib/db";
import jwt from "jsonwebtoken";
import * as cookie from "cookie";
import Admin from "@/app/database/models/Admin";
import QA from "@/app/database/models/QA";
import Candidate from "@/app/database/models/Candidate";

export async function POST(request) {
  try {
    const body = await request.json();
    let { email, password } = body;

    if (!email?.trim() || !password?.trim()) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 },
      );
    }

    email = email.trim();
    password = password.trim();

    await dbConnect();

    let user =
      (await Admin.findOne({ email })) ||
      (await QA.findOne({ email })) ||
      (await Candidate.findOne({ email }));

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 },
      );
    }

    // console.log("User Found");

    if (user.password !== password) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 },
      );
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const response = NextResponse.json({
      message: "Login successful",
      user: {
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked,
      },
    });

    response.headers.set(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24,
        path: "/",
      }),
    );

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again later." },
      { status: 500 },
    );
  }
}

export function GET() {
  return NextResponse.json(
    { message: "Only POST requests are allowed" },
    { status: 405 },
  );
}

