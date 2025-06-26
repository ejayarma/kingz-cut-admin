import { NextRequest, NextResponse } from "next/server";
import { firebaseAdmin } from "@/utils/firebase.admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phoneNumber } = body;

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // List all users and check for a match
    const users: any[] = [];
    let nextPageToken: string | undefined;

    do {
      const result = await firebaseAdmin.auth().listUsers(1000, nextPageToken);
      users.push(...result.users);
      nextPageToken = result.pageToken;
    } while (nextPageToken);

    const matchedUser = users.find((user) => user.phoneNumber === phoneNumber);

    return NextResponse.json({
      found: !!matchedUser,
      uid: matchedUser?.uid || null,
      email: matchedUser?.email || null,
    });
  } catch (error) {
    console.error("Error checking phone number:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
