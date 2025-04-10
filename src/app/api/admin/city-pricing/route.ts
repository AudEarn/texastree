import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET city pricing
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("lead_pricing_by_city")
      .select(`
        *,
        lead_types (
          id,
          name,
          description
        )
      `)
      .order("city", { ascending: true });

    if (error) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// POST new city price
export async function POST(request: Request) {
  try {
    const { city, lead_type, price, lead_type_id } = await request.json();

    // Enhanced validation for required fields
    if (!city?.trim()) {
      return NextResponse.json(
        { message: "City is required" },
        { status: 400 }
      );
    }

    if (!lead_type?.trim()) {
      return NextResponse.json(
        { message: "Lead type is required" },
        { status: 400 }
      );
    }

    if (!lead_type_id?.trim()) {
      return NextResponse.json(
        { message: "Lead type ID is required" },
        { status: 400 }
      );
    }

    if (!price || price <= 0) {
      return NextResponse.json(
        { message: "Price must be greater than 0" },
        { status: 400 }
      );
    }

    // Verify lead_type matches lead_type_id
    const { data: leadTypeData, error: leadTypeError } = await supabaseAdmin
      .from("lead_types")
      .select("name")
      .eq("id", lead_type_id.trim())
      .single();

    if (leadTypeError || leadTypeData?.name !== lead_type.trim()) {
      return NextResponse.json(
        { message: "Lead type does not match the provided lead type ID" },
        { status: 400 }
      );
    }

    // Check for existing price
    const { data: existingPrice } = await supabaseAdmin
      .from("lead_pricing_by_city")
      .select()
      .eq("city", city.trim())
      .eq("lead_type_id", lead_type_id.trim())
      .single();

    if (existingPrice) {
      return NextResponse.json(
        { message: "A price already exists for this city and lead type" },
        { status: 400 }
      );
    }

    // Prepare data with proper formatting
    const newPriceData = {
      city: city.trim(),
      lead_type: lead_type.trim(),
      price: Number(price),
      lead_type_id: lead_type_id.trim(),
    };

    const { data, error } = await supabaseAdmin
      .from("lead_pricing_by_city")
      .insert(newPriceData)
      .select()
      .single();

    if (error) {
      console.error("Insert error:", error);
      return NextResponse.json(
        { message: error.message || "Failed to add city price" },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}