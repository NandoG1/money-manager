// app/api/auth/verify-otp/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose"; 
import User from "@/lib/models/user.model";   

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and OTP are required." },
        { status: 400 }
      );
    }

    await connectToDB();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { message: "Email is already verified." },
        { status: 400 } 
      );
    }

    if (!user.otp || !user.otpExpires) {
        return NextResponse.json(
            { message: "No OTP found for this user or OTP might have expired. Please request a new one." },
            { status: 400 }
        );
    }

    if (new Date() > new Date(user.otpExpires)) {
     
      return NextResponse.json(
        { message: "OTP has expired. Please request a new one." },
        { status: 400 }
      );
    }

    if (user.otp !== otp) {
      return NextResponse.json(
        { message: "Invalid OTP." },
        { status: 400 }
      );
    }

    user.isVerified = true;
    user.otp = undefined; 
    user.otpExpires = undefined; 

    await user.save();

    return NextResponse.json(
      { message: "Email verified successfully. You can now log in." },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { message: `An error occurred: ${error.message || "Unknown error"}` },
      { status: 500 }
    );
  }
}