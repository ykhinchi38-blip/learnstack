import { normalizeHttpUrl } from "@/lib/urlValidation";

const SUCCESS_MESSAGE = "Thank you for contacting LearnStack. Your request has been received and will be reviewed for collaboration fit.";
const CREATOR_TYPES = new Set(["Review copy", "Creator collaboration", "Affiliate partnership", "Sponsored collaboration"]);
const EDUCATOR_TYPES = new Set(["School partnership", "Classroom or group access", "Educator Evaluation", "Workshop"]);
const INSTITUTION_TYPES = new Set(["College partnership", "School partnership", "Bulk purchase", "Workshop", "Library program"]);

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

export async function POST(request) {
  let payload;

  try {
    payload = await request.json();
  } catch {
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
  if (Object.keys(errors).length) return Response.json({ error: "Please correct the highlighted fields.", errors }, { status: 400 });

  const recipient = process.env.PARTNERSHIP_RECIPIENT_EMAIL;
  const apiKey = process.env.EMAIL_SERVICE_API_KEY;
  const from = process.env.EMAIL_FROM_ADDRESS;
  if (!recipient || !apiKey || !from) {
    return Response.json({ error: "Partnership inquiries are temporarily unavailable. Please contact LearnStack directly." }, { status: 503 });
  }

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
      console.error("[Partnership inquiry] email provider rejected the request", emailResponse.status);
      return Response.json({ error: "Your request could not be sent right now. Please try again later." }, { status: 502 });
    }

    return Response.json({ success: true, message: SUCCESS_MESSAGE });
  } catch (error) {
    console.error("[Partnership inquiry] email request failed", error);
    return Response.json({ error: "Your request could not be sent right now. Please try again later." }, { status: 502 });
  }
}
