import Razorpay from "razorpay";

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

// Only instantiate Razorpay if the API keys are present in environment variables.
// If missing, we fall back to simulated mock checkout/webhooks.
export const razorpay = keyId && keySecret
  ? new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })
  : null;
