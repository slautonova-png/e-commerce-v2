import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateOrderNumber } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const {
      items,
      shipping_address,
      payment_method,
      guest_email,
      guest_phone,
      subtotal,
      shipping_fee,
      total,
    } = body;

    // Get current user if logged in
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: user?.id || null,
        guest_email: user ? null : guest_email,
        guest_phone: user ? null : guest_phone,
        status: "pending",
        payment_method,
        payment_status: payment_method === "cod" ? "pending" : "pending",
        subtotal,
        shipping_fee,
        total,
        shipping_address,
      })
      .select()
      .single();

    if (orderError) {
      console.error("Order creation error:", orderError);
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }

    // Create order items
    const orderItems = items.map(
      (item: {
        product_id: string;
        variant_id: string;
        product_name: string;
        variant_info: string;
        quantity: number;
        unit_price: number;
      }) => ({
        order_id: order.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        product_name: item.product_name,
        variant_info: item.variant_info,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.unit_price * item.quantity,
      })
    );

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Order items error:", itemsError);
      // Still return success since order was created
    }

    return NextResponse.json({
      success: true,
      order_id: order.id,
      order_number: orderNumber,
    });
  } catch (error) {
    console.error("Order API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
