const AUDIENCES = new Set(["Developers and Students", "Parents and Educators"]);
const SOURCES = new Set(["homepage", "free-samples", "product-page", "educators-page"]);
const RATE_LIMIT_MS = 60_000;
const recentSubmissions = new Map();

function text(value, maxLength = 500) {
  return String(value || "").trim().slice(0, maxLength);
}

function normalizeEmail(value) {
  return text(value, 254).toLowerCase();
}

function isEmail(value) {
  return /^\S+@\S+\.\S+$/.test(value);
}

function subscriptionMessage(subscription) {
  return [
    "New LearnStack lead-capture submission",
    "",
    `Email: ${subscription.email}`,
    `Audience preference: ${subscription.audiencePreference}`,
    `Source: ${subscription.source}`,
    `Subscribed at: ${subscription.subscribedAt}`,
    `Consent: ${subscription.consent ? "Yes" : "No"}`
  ].join("\n");
}

export async function POST(request) {
  let payload;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Please submit the form again." }, { status: 400 });
  }

  const email = normalizeEmail(payload.email);
  const audiencePreference = text(payload.audiencePreference, 80);
  const source = text(payload.source, 80);

  if (!isEmail(email)) {
    return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (!AUDIENCES.has(audiencePreference) || !SOURCES.has(source)) {
    return Response.json({ error: "This signup form is unavailable. Please refresh and try again." }, { status: 400 });
  }
  if (payload.consent !== true) {
    return Response.json({ error: "Consent is required before subscribing." }, { status: 400 });
  }

  const now = Date.now();
  for (const [submittedEmail, submittedAt] of recentSubmissions) {
    if (now - submittedAt >= RATE_LIMIT_MS) recentSubmissions.delete(submittedEmail);
  }
  const lastSubmission = recentSubmissions.get(email);
  if (lastSubmission && now - lastSubmission < RATE_LIMIT_MS) {
    return Response.json({ error: "Please wait a minute before submitting this email again." }, { status: 429 });
  }

  const recipient = process.env.SUBSCRIBER_RECIPIENT_EMAIL;
  const apiKey = process.env.EMAIL_SERVICE_API_KEY;
  const from = process.env.EMAIL_FROM_ADDRESS;
  if (!recipient || !apiKey || !from) {
    return Response.json({ error: "Email signups are temporarily unavailable. Please try again later." }, { status: 503 });
  }

  const subscription = {
    email,
    audiencePreference,
    source,
    subscribedAt: new Date().toISOString(),
    consent: true
  };

  recentSubmissions.set(email, now);

  try {
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [recipient],
        reply_to: subscription.email,
        subject: `LearnStack signup: ${subscription.audiencePreference}`,
        text: subscriptionMessage(subscription)
      })
    });

    if (!emailResponse.ok) {
      recentSubmissions.delete(email);
      console.error("[Subscription] email provider rejected the request", emailResponse.status);
      return Response.json({ error: "Your signup could not be sent right now. Please try again later." }, { status: 502 });
    }

    return Response.json({ success: true, message: "Thanks. Your request has been received." });
  } catch (error) {
    recentSubmissions.delete(email);
    console.error("[Subscription] email request failed", error);
    return Response.json({ error: "Your signup could not be sent right now. Please try again later." }, { status: 502 });
  }
}
