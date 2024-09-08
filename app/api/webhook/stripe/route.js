import Stripe from "stripe";
import { headers } from "next/headers";
import { buffer } from "node:stream/consumers";
import { supabaseAdmin } from "@/lib/supabase/admin";

const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

const stripe = new Stripe(process.env.STRIPE_SK);


const PRODUCT_CREDITS = {
  'prod_QoI8lK9ZhLr5Lp': 20,  // Replace 'prod_x' with your actual product ID
  'prod_QoI9zxt1iPCYNt': 100, // Replace 'prod_y' with your actual product ID
  
};

export async function POST(req) {
  const rawBody = await buffer(req.body);
  try {
    const sig = headers().get("stripe-signature");
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        sig,
        endpointSecret
      );
    } catch (err) {
      return Response.json({ error: `Webhook Error ${err?.message} ` });
    }
    switch (event.type) {
      case "invoice.payment_succeeded":
        const result = event.data.object;
        const end_at = new Date(
          result.lines.data[0].period.end * 1000
        ).toISOString();
        const customer_id = result.customer;
        const subscription_id = result.subscription;
        const email = result.customer_email;
        const product_id = result.lines.data[0].price.product;
        const credits = PRODUCT_CREDITS[product_id] || 0;
        
        const error = await onPaymentSucceeded(
          end_at,
          customer_id,
          subscription_id,
          email,
          credits
        );
        if (error) {
          console.log(error);
          return Response.json({ error: error.message });
        }
        break;
      case "customer.subscription.deleted":
        const deleteSubscription = event.data.object;
        const cancelError = await onSubCancel(deleteSubscription.id);
        if (cancelError) {
          console.log(cancelError);
          return Response.json({ error: cancelError.message });
        }
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    return Response.json({});
  } catch (e) {
    return Response.json({ error: `Webhook Error: ${e.message}` });
  }
}

async function onPaymentSucceeded(
  end_at,
  customer_id,
  subscription_id,
  email,
  credits
) {
  const supabase = await supabaseAdmin();
  const { error } = await supabase
    .from("subscription")
    .update({
      end_at,
      customer_id,
      subscription_id,
      creds: credits
    })
    .eq("email", email);
  return error;
}

async function onSubCancel(subscription_id) {
  const supabase = await supabaseAdmin();
  const { error } = await supabase
    .from("subscription")
    .update({
      customer_id: null,
      subscription_id: null,
      
    })
    .eq("subscription_id", subscription_id);
  return error;
}