// app/api/register/route.ts
import { connectToDB } from "@/lib/mongoose";
import User from "@/lib/models/user.model";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { sendOtpEmail } from "@/lib/email"; 
import crypto from "crypto";

function generateOtp(): string {
  return crypto.randomInt(100000, 999999).toString();
}

export async function POST(req: NextRequest) {

  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json(
      { message: "Name, email, and password are required" },
      { status: 400 },
    );
  }

  await connectToDB();

  try {
    if (name.trim().length < 4) {
      return NextResponse.json({ message: "Name should be at least 4 characters" }, { status: 400 });
    }
    if (!email.includes("@")) {
      return NextResponse.json({ message: "Invalid Email" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ message: "Password should be at least 8 characters" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.isVerified) {
        return NextResponse.json({ message: "User with this email already exists and is verified." }, { status: 409 });
      } else {
        const newOtp = generateOtp();
        const otpExpires = new Date(new Date().getTime() + 10 * 60 * 1000); 

        existingUser.otp = newOtp;
        existingUser.otpExpires = otpExpires;
        existingUser.name = name; 
        await existingUser.save();

        try {
          await sendOtpEmail(email, existingUser.name, newOtp); 
          return NextResponse.json(
            { message: "OTP re-sent to your email. Please verify.", email: existingUser.email },
            { status: 200 },
          );
        } catch (emailError) {
          console.error("Failed to resend OTP email:", emailError);
          return NextResponse.json({ message: "User exists but failed to resend OTP. Please try again." }, { status: 500 });
        }
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const otpExpires = new Date(new Date().getTime() + 10 * 60 * 1000);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpires,
      isVerified: false,
    });

    await newUser.save();

    try {
      await sendOtpEmail(email, newUser.name, otp); 
      return NextResponse.json(
        { message: "Registration successful. OTP sent to your email for verification.", email: newUser.email },
        { status: 201 },
      );
    } catch (emailError) {
      console.error("Failed to send OTP email after user creation:", emailError);
      return NextResponse.json(
        { message: "User registered, but failed to send OTP email. Please try verifying later or request a new OTP." },
        { status: 207 },
      );
    }

  } catch (error: any) {
    console.error("Registration error:", error);
    if (error.code === 11000) {
        return NextResponse.json({ message: "Email already in use." }, { status: 409 });
    }
    return NextResponse.json({ message: `An error occurred: ${error.message || "Unknown error"}` }, { status: 500 });
  }
}