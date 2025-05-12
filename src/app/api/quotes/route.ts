import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const photoUrl = await uploadPhoto(data.photo);
    console.log({ photoUrl });

    // Insert the quote data into Supabase
    const { data: quoteData, error } = await supabase
      .from("quote_leads")
      .insert([
        {
          service_type: data.serviceType,
          service_urgency: data.serviceUrgency,
          service_urgency_input: data.serviceUrgencyInput,
          property_type: data.propertyType,
          property_type_input: data.propertyTypeInput,
          city: data.city,
          zip_code: data.zipCode,
          address: data.fullAddress,
          customer_first_name: data.firstName,
          customer_last_name: data.lastName,
          customer_email: data.email,
          customer_phone: data.phone,
          photo_url: photoUrl || null,
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

async function uploadPhoto(photo: string) {
  try {
    // Convert base64 to buffer if the photo is a base64 string
    let photoBuffer;
    if (typeof photo === "string" && photo.startsWith("data:")) {
      const base64Data = photo.split(",")[1];
      photoBuffer = Buffer.from(base64Data, "base64");
    } else {
      photoBuffer = photo;
    }

    const fileName = `lead-image-${Date.now()}.jpg`;
    const filePath = `quote-photos/${fileName}`;

    const { data, error } = await supabase.storage
      .from("quotes")
      .upload(filePath, photoBuffer, {
        contentType: "image/jpeg",
        upsert: true,
      });

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
