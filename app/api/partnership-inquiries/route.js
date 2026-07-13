import { normalizeHttpUrl } from "@/lib/urlValidation";

const SUCCESS_MESSAGE = "Thank you for contacting LearnStack. Your request has been received and will be reviewed for collaboration fit.";
const CREATOR_TYPES = new Set(["Review copy", "Creator collaboration", "Affiliate partnership", "Sponsored collaboration"]);
const EDUCATOR_TYPES = new Set(["School partnership", "Classroom or group access", "Educator Evaluation", "Workshop"]);
const INSTITUTION_TYPES = new Set(["College partnership", "School partnership", "Bulk purchase", "Workshop", "Library program"]);

function logDevelopment(event, details = {}) {
  if (process.env.NODE_ENV === "development") {
    console.info(`[Partnership inquiry] ${event}`, details);
  }
}

function text(value, maxLength = 4000) {
  return String(value || "").trim().slice(0, maxLength);
}

function isEmail(value) {
  return /^\S+@\S+\.\S+$/.test(value);
}

function validate(payload) {
  const errors = {};
  const required = ["fullName", "workEmail", "country", "city", "organizationName", "role", "partnershipType", "audienceType", "audienceCount", "productCategory", "proposedCollaboration", "relevance", "preferredContactMethod"];

  required.forEach((field) => {
    if (!text(payload[field])) errors[field] = "This field is required.";
  });
  if (!isEmail(text(payload.workEmail))) errors.workEmail = "Enter a valid work email address.";
  if (payload.consent !== true) errors.consent = "Consent is required.";

  if (CREATOR_TYPES.has(text(payload.partnershipType))) {
    ["mainPlatform", "followers", "engagement", "audienceCountry", "sampleContentLink"].forEach((field) => {
      if (!text(payload[field])) errors[field] = "This field is required for creator requests.";
    });
  }
  if (EDUCATOR_TYPES.has(text(payload.partnershipType))) {
    ["learnerLevel", "classSize", "schoolOrInstitute", "intendedUse"].forEach((field) => {
      if (!text(payload[field])) errors[field] = "This field is required for educator requests.";
    });
  }
  if (INSTITUTION_TYPES.has(text(payload.partnershipType))) {
    ["department", "studentCount", "resourcesRequired", "workshopOrLicensingRequirement"].forEach((field) => {
      if (!text(payload[field])) errors[field] = "This field is required for institutional requests.";
    });
  }

  ["website", "linkedinProfile", "otherProfileLink"].forEach((field) => {
    if (text(payload[field]) && !normalizeHttpUrl(payload[field])) {
      errors[field] = "Enter a valid URL, such as learnstack.co.in or https://learnstack.co.in.";
    }
  });
  if (text(payload.sampleContentLink) && !/^https?:\/\//i.test(text(payload.sampleContentLink))) errors.sampleContentLink = "Use a full http:// or https:// URL.";

  return errors;
}

function formatInquiry(payload) {
  const fields = [
    ["Full name", payload.fullName], ["Work email", payload.workEmail], ["Country", payload.country], ["City", payload.city],
    ["Organization or channel", payload.organizationName], ["Role", payload.role], ["Website", payload.website], ["LinkedIn", payload.linkedinProfile], ["Other profile", payload.otherProfileLink],
    ["Partnership type", payload.partnershipType], ["Audience type", payload.audienceType], ["Audience count", payload.audienceCount], ["Product category", payload.productCategory], ["Preferred contact", payload.preferredContactMethod],
    ["Main platform", payload.mainPlatform], ["Followers or subscribers", payload.followers], ["Average views or engagement", payload.engagement], ["Audience country", payload.audienceCountry], ["Sample content", payload.sampleContentLink],
    ["Learner level", payload.learnerLevel], ["Class size", payload.classSize], ["School or institute", payload.schoolOrInstitute], ["Intended use", payload.intendedUse],
    ["Department", payload.department], ["Student count", payload.studentCount], ["Resources required", payload.resourcesRequired], ["Workshop or licensing requirement", payload.workshopOrLicensingRequirement]
  ].filter(([, value]) => text(value));

  return [
    "New LearnStack partnership request",
    "",
    ...fields.map(([label, value]) => `${label}: ${text(value)}`),
    "",
    "Proposed collaboration:",
    text(payload.proposedCollaboration),
    "",
    "Why this is relevant:",
    text(payload.relevance)
  ].join("\n");
}

function getEmailConfig() {
  const config = {
    recipient: process.env.PARTNERSHIP_RECIPIENT_EMAIL,
    apiKey: process.env.EMAIL_SERVICE_API_KEY,
    from: process.env.EMAIL_FROM_ADDRESS
  };
  const missing = [
    ["PARTNERSHIP_RECIPIENT_EMAIL", config.recipient],
    ["EMAIL_SERVICE_API_KEY", config.apiKey],
    ["EMAIL_FROM_ADDRESS", config.from]
  ].filter(([, value]) => !value).map(([name]) => name);

  return { ...config, missing };
}

function unavailableResponse(missingConfiguration) {
  const fallbackEmail = text(process.env.NEXT_PUBLIC_PARTNERSHIP_EMAIL || process.env.NEXT_PUBLIC_SUPPORT_EMAIL, 254);
  logDevelopment("email_not_configured", { missing_configuration: missingConfiguration });

  return Response.json({
    error: fallbackEmail
      ? "Online submission is temporarily unavailable. Email us at"
      : "Online submission is temporarily unavailable. Please use the contact page.",
    code: "EMAIL_NOT_CONFIGURED",
    fallbackEmail: fallbackEmail || undefined,
    contactPath: fallbackEmail ? undefined : "/contact"
  }, { status: 503 });
}

export async function POST(request) {
  let payload;

  try {
    payload = await request.json();
  } catch {
    logDevelopment("invalid_json", { status: 400 });
    return Response.json({ error: "Please submit the form again." }, { status: 400 });
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    logDevelopment("invalid_payload", { status: 400 });
    return Response.json({ error: "Please submit the form again." }, { status: 400 });
  }

  ["website", "linkedinProfile", "otherProfileLink"].forEach((field) => {
    const normalized = normalizeHttpUrl(payload[field]);
    if (normalized !== null) payload[field] = normalized;
  });

  if (text(payload.companyWebsite)) {
    return Response.json({ success: true, message: SUCCESS_MESSAGE });
  }

  const errors = validate(payload);
  if (Object.keys(errors).length) {
    logDevelopment("validation_failed", { fields: Object.keys(errors), status: 400 });
    return Response.json({ error: "Please correct the highlighted fields.", errors }, { status: 400 });
  }

  const { recipient, apiKey, from, missing } = getEmailConfig();
  if (missing.length) return unavailableResponse(missing);

  try {
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [recipient],
        reply_to: text(payload.workEmail),
        subject: `Partnership request: ${text(payload.partnershipType, 120)} - ${text(payload.organizationName, 120)}`,
        text: formatInquiry(payload)
      })
    });

    if (!emailResponse.ok) {
      logDevelopment("provider_rejected", { provider: "resend", provider_status: emailResponse.status, status: 502 });
      return Response.json({ error: "Your request could not be sent right now. Please try again later." }, { status: 502 });
    }

    logDevelopment("email_sent", { provider: "resend", provider_status: emailResponse.status, status: 200 });
    return Response.json({ success: true, message: SUCCESS_MESSAGE });
  } catch {
    logDevelopment("provider_request_failed", { provider: "resend", status: 502 });
    return Response.json({ error: "Your request could not be sent right now. Please try again later." }, { status: 502 });
  }
}
