import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { firebaseAdmin, serviceAccount } from "@/utils/firebase.admin";

// firebaseAdmin
export async function GET() {
  try {
    const auth = firebaseAdmin.auth();
    const listUsersResult = await auth.listUsers(1000);

    const users = listUsersResult.users.map((user) => ({
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || user.email || "Unknown User",
      photoURL: user.photoURL,
      phoneNumber: user.phoneNumber,
    }));

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch users",
        data: serviceAccount,
        error: error,
        // admin: (await firebaseAdmin.auth().getUserByEmail('sesadin178@lewou.com')).uid,
      },
      { status: 500 }
    );
  }
}
