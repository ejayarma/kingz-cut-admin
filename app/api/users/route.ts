import { NextRequest, NextResponse } from "next/server";
import { firebaseAdmin } from "@/utils/firebase.admin";

// GET: List all users
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
      { message: "Failed to fetch users", error },
      { status: 500 }
    );
  }
}

// POST: Create new user
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, displayName, phoneNumber, photoURL } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const userRecord = await firebaseAdmin.auth().createUser({
      email,
      password,
      displayName,
      phoneNumber,
      photoURL,
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          uid: userRecord.uid,
          email: userRecord.email,
          displayName: userRecord.displayName,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "Failed to create user", error: error.message || error },
      { status: 500 }
    );
  }
}

// PUT or PATCH: Update user by UID
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { uid, email, displayName, phoneNumber, photoURL } = body;

    if (!uid) {
      return NextResponse.json(
        { message: "User UID is required for update" },
        { status: 400 }
      );
    }

    const updatedUser = await firebaseAdmin.auth().updateUser(uid, {
      email,
      displayName,
      phoneNumber,
      photoURL,
    });

    return NextResponse.json(
      {
        message: "User updated successfully",
        user: {
          uid: updatedUser.uid,
          email: updatedUser.email,
          displayName: updatedUser.displayName,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error Updating user:", error);

    return NextResponse.json(
      { message: "Failed to update user", error: error.message || error },
      { status: 500 }
    );
  }
}
