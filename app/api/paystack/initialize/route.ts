import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, amount, callback_url, reference } = body;

    if (!email || !amount) {
      return NextResponse.json(
        { error: "Email and amount are required" },
        { status: 400 }
      );
    }

    const authorization = `Bearer ${process.env.PAYSTACK_SECRET_KEY}`;
    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: authorization,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount, // amount in kobo (i.e. GHS 10.00 => 1000)
        callback_url, // optional
        reference, // optional: unique transaction reference
      }),
    });

    const data = await res.json();

    console.log("INIT PAYSTACK RESPONSE:", data);

    if (data.status === true) {
      return NextResponse.json(data);
    }

    throw new Error(data);
  } catch (error) {
    console.error("Paystack init error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
