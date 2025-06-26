import { NextRequest, NextResponse } from "next/server";
import { firebaseAdmin } from "@/utils/firebase.admin";

export async function POST(req: NextRequest) {
  try {
    const { otpId, otp } = await req.json();

    if (!otpId || !otp) {
      return NextResponse.json(
        { error: "OTP ID and code are required" },
        { status: 400 }
      );
    }

    const docRef = firebaseAdmin.firestore().collection("otps").doc(otpId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 404 }
      );
    }

    const data = doc.data();
    if (!data) {
      return NextResponse.json(
        { error: "OTP data not found" },
        { status: 404 }
      );
    }
    const now = new Date();

    if (data?.verified) {
      return NextResponse.json({ error: "OTP already used" }, { status: 400 });
    }

    if (data?.expiresAt.toDate() < now) {
      return NextResponse.json({ error: "OTP has expired" }, { status: 400 });
    }

    if (data?.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // Mark as verified
    await docRef.update({ verified: true, verifiedAt: now });

    return NextResponse.json({
      message: "OTP verified successfully",
      phoneNumber: data.phoneNumber,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
