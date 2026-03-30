import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Generate a simple reference ID
    const referenceId = `CF-${Date.now().toString(36).toUpperCase()}`;

    // TODO: Send email via Resend / Nodemailer
    // TODO: Save to Supabase or Sanity
    console.log("Inquiry received:", { referenceId, ...data });

    return NextResponse.json({ success: true, referenceId });
  } catch (error) {
    console.error("Inquiry submit error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit enquiry." },
      { status: 500 }
    );
  }
}
