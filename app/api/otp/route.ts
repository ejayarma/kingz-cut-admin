import { NextRequest, NextResponse } from "next/server";
import { firebaseAdmin } from "@/utils/firebase.admin";
import { sendSMS } from "@/utils/sms"; // assuming your SMS function is here
import { v4 as uuidv4 } from "uuid";

const OTP_EXPIRY_MINUTES = 5;

// function generateOTP(): string {
//   return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
// }

function generateOTP(): string {
  return Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit
}

// POST: Send OTP
export async function POST(req: NextRequest) {
  try {
    const { phoneNumber, purpose = "auth" } = await req.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    const otp = generateOTP();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60000);

    const otpId = uuidv4();
    await firebaseAdmin.firestore().collection("otps").doc(otpId).set({
      phoneNumber,
      otp,
      purpose,
      createdAt: now,
      expiresAt,
      verified: false,
    });

    await sendSMS(
      phoneNumber,
      `You the following code to continue the application: ${otp}`
    );

    return NextResponse.json({ message: "OTP sent successfully", otpId });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
