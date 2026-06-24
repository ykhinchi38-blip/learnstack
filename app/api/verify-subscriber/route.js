import subscribers from "@/data/subscribers";
import couponCodes from "@/data/couponCodes";

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export async function POST(request) {
  try {
    const body = await request.json();
    const email = normalizeEmail(body.email);

    if (!email || !email.includes("@")) {
      return Response.json(
        { success: false, message: "Please enter a valid Gumroad email address." },
        { status: 400 }
      );
    }

    const verifiedEmails = subscribers.map(normalizeEmail);
    const isVerified = verifiedEmails.includes(email);

    if (!isVerified) {
      return Response.json(
        {
          success: false,
          message:
            "Email not found. Make sure you're using the email you used on Gumroad. Follow us on Gumroad to unlock future discounts."
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      code: couponCodes.universal.code,
      label: couponCodes.universal.label,
      discountText: couponCodes.universal.discountText,
      gumroadStoreUrl: couponCodes.universal.gumroadStoreUrl,
      message: "Verified subscriber. Your LearnStack discount is unlocked."
    });
  } catch (error) {
    return Response.json(
      { success: false, message: "Could not verify subscriber right now. Please try again." },
      { status: 500 }
    );
  }
}
