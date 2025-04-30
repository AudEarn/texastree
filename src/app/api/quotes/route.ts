import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Insert the quote data into Supabase
    const { data: quoteData, error } = await supabase
      .from("quote_leads")
      .insert([
        {
          service_type: data.serviceType,
          service_urgency: data.serviceUrgency,
          property_type: data.propertyType,
          city: data.city,
          zip_code: data.zipCode,
          customer_name: data.name,
          customer_email: data.email,
          customer_phone: data.phone,
          photo_url: data.photo ? await uploadPhoto(data.photo) : null,
          status: "new",
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error("Error submitting quote:", error);
      return NextResponse.json(
        { error: "Failed to submit quote" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Quote submitted successfully", data: quoteData },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing quote submission:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function uploadPhoto(photo: File) {
  try {
    const fileExt = photo.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `quote-photos/${fileName}`;

    const { data, error } = await supabase.storage
      .from("quotes")
      .upload(filePath, photo);

    if (error) {
      throw error;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("quotes").getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error("Error uploading photo:", error);
    return null;
  }
}
