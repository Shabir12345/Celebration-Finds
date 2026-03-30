"use server";

import { supabase } from "@/lib/supabase";

export type InquiryData = {
  name: string;
  email: string;
  company?: string;
  eventType: string;
  eventDate?: string;
  quantity?: number;
  message: string;
};

export async function submitInquiry(data: InquiryData) {
  try {
    const { data: result, error } = await supabase
      .from("inquiries")
      .insert([
        {
          ...data,
          status: "pending",
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Optional: Send transactional email via Resend
    // await resend.emails.send({ ... });

    return { success: true, inquiry: result };
  } catch (error: any) {
    console.error("Inquiry Submission Error:", error);
    return { success: false, error: error.message };
  }
}
