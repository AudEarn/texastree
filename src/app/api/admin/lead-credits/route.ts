import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET lead credits
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("business_lead_credits")
      .select(`
        *,
        tree_service_companies (
          id,
          business_name,
          city
        )
      `)
      .order("created_at", { ascending: false });

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

// POST new lead credits
export async function POST(request: Request) {
  try {
    const { businessId, credits, notes } = await request.json();

    const { data, error } = await supabaseAdmin
      .from("business_lead_credits")
      .insert({
        business_id: businessId,
        credits_remaining: parseInt(credits),
        notes,
      })
      .select()
      .single();

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

// PUT (update) lead credits
export async function PUT(request: Request) {
  try {
    const { id, credits, notes } = await request.json();

    const { data, error } = await supabaseAdmin
      .from("business_lead_credits")
      .update({
        credits_remaining: parseInt(credits),
        notes,
      })
      .eq("id", id)
      .select()
      .single();

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