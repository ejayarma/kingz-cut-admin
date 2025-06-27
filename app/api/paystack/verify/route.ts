import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { reference } = body;

    if (!reference) {
      return NextResponse.json(
        { error: "Transaction reference is required" },
        { status: 400 }
      );
    }
    const authorization = `Bearer ${process.env.PAYSTACK_SECRET_KEY}`;

    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: authorization,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();
    console.log("VERIFY PAYSTACK RESPONSE:", data);

    if (data.status === true) {
      return NextResponse.json(data);
    }

    throw new Error(data);
  } catch (error) {
    console.error("Paystack verify error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
