import { NextRequest, NextResponse } from "next/server";
import { firebaseAdmin } from "@/utils/firebase.admin";
import { formatGhanaPhoneToE164, isValidGhanaMobileNumber } from "@/utils/phone-utils";

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
export async function PUT(request: Request) {
  try {
    const { userId, updateData } = await request.json();

    console.log("DATA FROM REQUEST", userId, updateData);

    // Validate input
    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        { message: "Missing or invalid userId" },
        { status: 400 }
      );
    }

    // Construct the update request object
    const updateRequest: any = {};
    
    if (updateData.displayName) {
      updateRequest.displayName = updateData.displayName;
    }
    
    if (updateData.email) {
      updateRequest.email = updateData.email;
    }
    
    if (updateData.photoURL) {
      updateRequest.photoURL = updateData.photoURL;
    }
    
    if (updateData.phoneNumber) {
      try {
        // Validate and format the Ghana phone number to E.164
        if (!isValidGhanaMobileNumber(updateData.phoneNumber)) {
          return NextResponse.json(
            { message: "Invalid Ghana phone number format" },
            { status: 400 }
          );
        }
        
        // Convert to E.164 format for Firebase
        updateRequest.phoneNumber = formatGhanaPhoneToE164(updateData.phoneNumber);
        console.log(`Formatted phone: ${updateData.phoneNumber} -> ${updateRequest.phoneNumber}`);
        
      } catch (phoneError: any) {
        console.error("Phone number formatting error:", phoneError);
        return NextResponse.json(
          { message: "Invalid phone number format", error: phoneError.message },
          { status: 400 }
        );
      }
    }

    // Update the user using Firebase Admin SDK
    await firebaseAdmin.auth().updateUser(userId, updateRequest);

    return NextResponse.json(
      { message: "User updated successfully" },
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