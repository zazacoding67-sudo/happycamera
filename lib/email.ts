import { Resend } from "resend";
import { formatPrice } from "./format";

// TODO: Switch back to "Happy Camera <orders@happycamera.com>" once the
// happycamera.com domain is bought and verified in Resend. Until then we use
// Resend's default onboarding sender, which only delivers to the Resend
// account owner's email address.

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendOrderConfirmationEmail({
  to,
  customerName,
  orderNumber,
  totalAmount,
}: {
  to: string;
  customerName: string;
  orderNumber: string;
  totalAmount: number;
}) {
  if (!resend) return;

  try {
    const { error } = await resend.emails.send({
      from: "Happy Camera <onboarding@resend.dev>",
      to,
      subject: orderNumber ? `Order Confirmed — #${orderNumber}` : "Order Confirmed",
      html: `<p>Hi ${customerName},</p>
<p>Your payment was successful. Order number: <strong>${orderNumber}</strong></p>
<p>Total: ${formatPrice(totalAmount)}</p>
<p>We'll notify you once the order ships.</p>`,
    });

    if (error) console.error("Resend error:", error);
  } catch (err) {
    console.error("Resend send threw:", err);
  }
}

export async function sendOrderShippedEmail({
  to,
  customerName,
  courierName,
  trackingNumber,
  subjectOverride,
}: {
  to: string;
  customerName: string;
  courierName: string | null;
  trackingNumber: string | null;
  subjectOverride?: string;
}) {
  if (!resend) return;

  let trackingHtml = "";
  if (courierName && trackingNumber) {
    trackingHtml = `<p>Courier: ${courierName}<br>Tracking: ${trackingNumber}</p>`;
  }

  try {
    const { error } = await resend.emails.send({
      from: "Happy Camera <onboarding@resend.dev>",
      to,
      subject: subjectOverride || "Your Order Has Shipped!",
      html: `<p>Hi ${customerName},</p>
<p>Your order is on the way!</p>
${trackingHtml}
<p>Happy shooting!</p>`,
    });

    if (error) console.error("Resend error:", error);
  } catch (err) {
    console.error("Resend send threw:", err);
  }
}
