// app/api/notifications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { firebaseAdmin } from "@/utils/firebase.admin";
import { sendSMS } from "@/utils/sms";

// Utility functions

async function sendPushNotification(
  fcmToken: string,
  title: string,
  body: string
) {
  try {
    const admin = require("firebase-admin");

    const message = {
      notification: { title, body },
      token: fcmToken,
    };

    await admin.messaging().send(message);
    console.log("Push notification sent successfully");
  } catch (error) {
    console.error("Push notification error:", error);
  }
}

// GET: Fetch user notifications
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid");

  if (!uid) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const notificationsRef = firebaseAdmin
      .firestore()
      .collection("notifications");
    const snapshot = await notificationsRef
      .where("uid", "==", uid)
      .orderBy("createdAt", "desc")
      .get();

    const notifications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
    }));

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("Notifications API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Create notification
export async function POST(req: NextRequest) {
  try {
    const { uid, message, title, type = "general" } = await req.json();

    if (!uid || !message) {
      return NextResponse.json(
        { error: "User ID and message are required" },
        { status: 400 }
      );
    }

    // const userData = await firebaseAdmin.auth().getUser(uid);
    let userData = null;

    // Check in 'customers' collection
    let customerQuerySnapshot = await firebaseAdmin
      .firestore()
      .collection("customers")
      .where("userId", "==", uid)
      .limit(1)
      .get();

    if (!customerQuerySnapshot.empty) {
      userData = customerQuerySnapshot.docs[0].data();
    } else {
      // Check in 'staff' collection
      let staffQuerySnapshot = await firebaseAdmin
        .firestore()
        .collection("staff")
        .where("userId", "==", uid)
        .limit(1)
        .get();

      if (!staffQuerySnapshot.empty) {
        userData = staffQuerySnapshot.docs[0].data();
      }
    }

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const notificationData = {
      uid,
      title: title || "New Notification",
      message,
      type,
      read: false,
      createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await firebaseAdmin
      .firestore()
      .collection("notifications")
      .add(notificationData);

    if (userData.phone) await sendSMS(userData.phone, message);
    if (userData.fcmToken)
      await sendPushNotification(
        userData.fcmToken,
        title || "New Notification",
        message
      );

    return NextResponse.json(
      {
        id: docRef.id,
        message: "Notification created successfully",
        smssent: !!userData.phone,
        pushSent: !!userData.fcmToken,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Notification creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH: Update read status
export async function PATCH(req: NextRequest) {
  try {
    const { id, read } = await req.json();

    if (!id || typeof read !== "boolean") {
      return NextResponse.json(
        { error: "Notification ID and read status required" },
        { status: 400 }
      );
    }

    await firebaseAdmin
      .firestore()
      .collection("notifications")
      .doc(id)
      .update({
        read,
        readAt: read
          ? firebaseAdmin.firestore.FieldValue.serverTimestamp()
          : null,
      });

    return NextResponse.json({ message: "Notification updated successfully" });
  } catch (error) {
    console.error("Update notification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
