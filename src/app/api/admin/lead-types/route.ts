import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET all lead types with sorting
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sortKey = searchParams.get('sort') || 'name';
    const sortOrder = searchParams.get('order') || 'asc';
    
    // Validate sort parameters to prevent SQL injection
    const validSortKeys = ['name', 'description', 'is_global', 'created_at'];
    const validSortOrders = ['asc', 'desc'];
    
    const key = validSortKeys.includes(sortKey) ? sortKey : 'name';
    const order = validSortOrders.includes(sortOrder) ? sortOrder : 'asc';
    
    const { data, error } = await supabaseAdmin
      .from('lead_types')
      .select('*')
      .order(key, { ascending: order === 'asc' });
      
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

// POST new lead type
export async function POST(request: Request) {
  try {
    const newType = await request.json();
    
    // Insert the lead type using the admin client
    const { data: leadTypeData, error: leadTypeError } = await supabaseAdmin
      .from('lead_types')
      .insert([newType])
      .select()
      .single();
      
    if (leadTypeError) {
      console.error('Error inserting lead type:', leadTypeError);
      return NextResponse.json(
        { message: leadTypeError.message },
        { status: 400 }
      );
    }
    
    // Insert default pricing
    const { error: priceError } = await supabaseAdmin
      .from('lead_pricing_defaults')
      .insert({
        lead_type_id: leadTypeData.id,
        lead_type: leadTypeData.name,
        price: 50, // Default price
      });
      
    if (priceError) {
      console.error('Error inserting default pricing:', priceError);
      return NextResponse.json(
        { message: priceError.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(leadTypeData);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { message: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// PUT (update) lead type
export async function PUT(request: Request) {
  try {
    const { id, ...updates } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { message: 'Lead type ID is required' },
        { status: 400 }
      );
    }
    
    const { data, error } = await supabaseAdmin
      .from('lead_types')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating lead type:', error);
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { message: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// DELETE lead type
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { message: 'Lead type ID is required' },
        { status: 400 }
      );
    }
    
    // First delete related pricing defaults
    const { error: pricingError } = await supabaseAdmin
      .from('lead_pricing_defaults')
      .delete()
      .eq('lead_type_id', id);
      
    if (pricingError) {
      console.error('Error deleting pricing defaults:', pricingError);
      return NextResponse.json(
        { message: pricingError.message },
        { status: 400 }
      );
    }
    
    // Then delete the lead type
    const { error } = await supabaseAdmin
      .from('lead_types')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting lead type:', error);
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { message: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}