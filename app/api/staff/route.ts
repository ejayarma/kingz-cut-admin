// app/api/staff/update-auth/route.ts
import { NextResponse } from "next/server";
import { firebaseAdmin } from "@/utils/firebase.admin";
import { UpdateRequest } from "firebase-admin/auth";
import { formatGhanaPhoneToE164 } from "@/utils/phone-utils";

export async function POST(request: Request) {
  try {
    const { userId, updateData } = await request.json();

    // Validate input
    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        { message: "Missing or invalid userId" },
        { status: 400 }
      );
    }

    // Construct the update request object
    const updateRequest: any = {};
    if (updateData.displayName)
      updateRequest.displayName = updateData.displayName;
    if (updateData.email) updateRequest.email = updateData.email;
    if (updateData.photoURL) updateRequest.photoURL = updateData.photoURL;
    if (updateData.phoneNumber)
      updateRequest.phoneNumber = formatGhanaPhoneToE164(
        updateData.phoneNumber
      );

    // Update the user using Firebase Admin SDK
    await firebaseAdmin.auth().updateUser(userId, updateRequest);

    return NextResponse.json(
      { message: "User updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error },
      { status: 500 }
    );
  }
}
