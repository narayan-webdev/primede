import Razorpay from "razorpay";

export async function getRazorpay({ razorpay_key, razorpay_secret }) {
  return new Razorpay({
    key_id: razorpay_key,
    key_secret: razorpay_secret,
  });
}


