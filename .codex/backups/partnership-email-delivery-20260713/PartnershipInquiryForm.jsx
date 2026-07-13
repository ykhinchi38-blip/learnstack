"use client";

import { useEffect, useMemo, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { normalizeHttpUrl } from "@/lib/urlValidation";
import styles from "./PartnershipInquiryForm.module.css";

const partnershipOptions = ["College partnership", "School partnership", "Classroom or group access", "Bulk purchase", "Educator Evaluation", "Review copy", "Creator collaboration", "Affiliate partnership", "Sponsored collaboration", "Workshop", "Library program", "Other"];
const productCategories = ["Technical handbooks", "Children's books", "Life and career playbooks", "Bundles", "Multiple categories"];
const optionalUrlFields = ["website", "linkedinProfile", "otherProfileLink"];

const initialValues = {
  fullName: "", workEmail: "", country: "", city: "", organizationName: "", role: "", website: "", linkedinProfile: "", otherProfileLink: "",
  partnershipType: "", audienceType: "", audienceCount: "", productCategory: "", proposedCollaboration: "", relevance: "", preferredContactMethod: "Email", consent: false,
  mainPlatform: "", followers: "", engagement: "", audienceCountry: "", sampleContentLink: "",
  learnerLevel: "", classSize: "", schoolOrInstitute: "", intendedUse: "",
  department: "", studentCount: "", resourcesRequired: "", workshopOrLicensingRequirement: "", companyWebsite: ""
};

function isCreatorRequest(type) {
  return ["Review copy", "Creator collaboration", "Affiliate partnership", "Sponsored collaboration"].includes(type);
}

function isEducatorRequest(type) {
  return ["School partnership", "Classroom or group access", "Educator Evaluation", "Workshop"].includes(type);
}

function isInstitutionRequest(type) {
  return ["College partnership", "School partnership", "Bulk purchase", "Workshop", "Library program"].includes(type);
}

function validate(values) {
  const errors = {};
  ["fullName", "workEmail", "country", "city", "organizationName", "role", "partnershipType", "audienceType", "audienceCount", "productCategory", "proposedCollaboration", "relevance", "preferredContactMethod"].forEach((field) => {
    if (!String(values[field] || "").trim()) errors[field] = "This field is required.";
  });

  if (!/^\S+@\S+\.\S+$/.test(values.workEmail)) errors.workEmail = "Enter a valid work email address.";
  if (!values.consent) errors.consent = "Consent is required before submitting.";

  if (isCreatorRequest(values.partnershipType)) {
    ["mainPlatform", "followers", "engagement", "audienceCountry", "sampleContentLink"].forEach((field) => {
      if (!String(values[field] || "").trim()) errors[field] = "This field is required for creator requests.";
    });
  }
  if (isEducatorRequest(values.partnershipType)) {
    ["learnerLevel", "classSize", "schoolOrInstitute", "intendedUse"].forEach((field) => {
      if (!String(values[field] || "").trim()) errors[field] = "This field is required for educator requests.";
    });
  }
  if (isInstitutionRequest(values.partnershipType)) {
    ["department", "studentCount", "resourcesRequired", "workshopOrLicensingRequirement"].forEach((field) => {
      if (!String(values[field] || "").trim()) errors[field] = "This field is required for institutional requests.";
    });
  }

  optionalUrlFields.forEach((field) => {
    if (values[field] && !normalizeHttpUrl(values[field])) {
      errors[field] = "Enter a valid URL, such as learnstack.co.in or https://learnstack.co.in.";
    }
  });
  if (values.sampleContentLink && !/^https?:\/\//i.test(values.sampleContentLink)) errors.sampleContentLink = "Use a full URL starting with http:// or https://.";

  return errors;
}

export default function PartnershipInquiryForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [hasStarted, setHasStarted] = useState(false);
  const creatorRequest = useMemo(() => isCreatorRequest(values.partnershipType), [values.partnershipType]);
  const educatorRequest = useMemo(() => isEducatorRequest(values.partnershipType), [values.partnershipType]);
  const institutionRequest = useMemo(() => isInstitutionRequest(values.partnershipType), [values.partnershipType]);

  useEffect(() => {
    const requestedType = new URLSearchParams(window.location.search).get("partnershipType");
    const matchingOption = partnershipOptions.find((option) => option.toLowerCase() === String(requestedType || "").toLowerCase());

    if (matchingOption) {
      setValues((current) => ({ ...current, partnershipType: matchingOption }));
    }
  }, []);

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
    setStatus({ type: "idle", message: "" });
  }

  function trackFormStart() {
    if (hasStarted) return;
    setHasStarted(true);
    trackEvent("partnership_form_started", { partnership_type: values.partnershipType || undefined });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setStatus({ type: "error", message: "Please review the highlighted fields and try again." });
      return;
    }

    setStatus({ type: "loading", message: "Sending your partnership request..." });

    const payload = { ...values };
    optionalUrlFields.forEach((field) => {
      payload[field] = normalizeHttpUrl(values[field]) || "";
    });

    try {
      const response = await fetch("/api/partnership-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) throw new Error(result.error || "Your request could not be sent. Please try again.");

      trackEvent("partnership_form_submitted", { partnership_type: values.partnershipType });
      setValues(initialValues);
      setErrors({});
      setStatus({ type: "success", message: "Thank you for contacting LearnStack. Your request has been received and will be reviewed for collaboration fit." });
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Your request could not be sent. Please try again." });
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} onFocus={trackFormStart} noValidate>
      <div className={styles.formGrid}>
        <label>Full name<input value={values.fullName} onChange={(event) => update("fullName", event.target.value)} aria-invalid={Boolean(errors.fullName)} /></label>
        <label>Work email<input type="email" value={values.workEmail} onChange={(event) => update("workEmail", event.target.value)} aria-invalid={Boolean(errors.workEmail)} /></label>
        <label>Country<input value={values.country} onChange={(event) => update("country", event.target.value)} aria-invalid={Boolean(errors.country)} /></label>
        <label>City<input value={values.city} onChange={(event) => update("city", event.target.value)} aria-invalid={Boolean(errors.city)} /></label>
        <label>Organization or channel name<input value={values.organizationName} onChange={(event) => update("organizationName", event.target.value)} aria-invalid={Boolean(errors.organizationName)} /></label>
        <label>Role<input value={values.role} onChange={(event) => update("role", event.target.value)} aria-invalid={Boolean(errors.role)} /></label>
        <label>Website URL (Optional)<input type="url" value={values.website} onChange={(event) => update("website", event.target.value)} aria-invalid={Boolean(errors.website)} aria-describedby={errors.website ? "website-error" : undefined} placeholder="learnstack.co.in" autoComplete="url" />{errors.website && <span id="website-error" className={styles.fieldError}>{errors.website}</span>}</label>
        <label>LinkedIn Profile URL (Optional)<input type="url" value={values.linkedinProfile} onChange={(event) => update("linkedinProfile", event.target.value)} aria-invalid={Boolean(errors.linkedinProfile)} aria-describedby={errors.linkedinProfile ? "linkedin-profile-error" : undefined} placeholder="linkedin.com/in/your-profile" autoComplete="url" />{errors.linkedinProfile && <span id="linkedin-profile-error" className={styles.fieldError}>{errors.linkedinProfile}</span>}</label>
        <label>Other Profile Link (Optional)<input type="url" value={values.otherProfileLink} onChange={(event) => update("otherProfileLink", event.target.value)} aria-invalid={Boolean(errors.otherProfileLink)} aria-describedby={errors.otherProfileLink ? "other-profile-link-error" : undefined} placeholder="instagram.com/your-profile" autoComplete="url" />{errors.otherProfileLink && <span id="other-profile-link-error" className={styles.fieldError}>{errors.otherProfileLink}</span>}</label>
        <label>Partnership type<select value={values.partnershipType} onChange={(event) => update("partnershipType", event.target.value)} aria-invalid={Boolean(errors.partnershipType)}><option value="">Select an option</option>{partnershipOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
        <label>Audience type<input value={values.audienceType} onChange={(event) => update("audienceType", event.target.value)} aria-invalid={Boolean(errors.audienceType)} placeholder="For example: college students" /></label>
        <label>Approximate learner or audience count<input type="number" min="1" value={values.audienceCount} onChange={(event) => update("audienceCount", event.target.value)} aria-invalid={Boolean(errors.audienceCount)} /></label>
        <label>Product category of interest<select value={values.productCategory} onChange={(event) => update("productCategory", event.target.value)} aria-invalid={Boolean(errors.productCategory)}><option value="">Select a category</option>{productCategories.map((option) => <option key={option}>{option}</option>)}</select></label>
        <label>Preferred contact method<select value={values.preferredContactMethod} onChange={(event) => update("preferredContactMethod", event.target.value)}><option>Email</option><option>Phone</option><option>LinkedIn</option><option>Other profile link</option></select></label>
      </div>

      {creatorRequest && <fieldset className={styles.fieldset}><legend>Creator or reviewer details</legend><div className={styles.formGrid}><label>Main platform<input value={values.mainPlatform} onChange={(event) => update("mainPlatform", event.target.value)} aria-invalid={Boolean(errors.mainPlatform)} /></label><label>Followers or subscribers<input type="number" min="0" value={values.followers} onChange={(event) => update("followers", event.target.value)} aria-invalid={Boolean(errors.followers)} /></label><label>Average views or engagement<input value={values.engagement} onChange={(event) => update("engagement", event.target.value)} aria-invalid={Boolean(errors.engagement)} /></label><label>Audience country<input value={values.audienceCountry} onChange={(event) => update("audienceCountry", event.target.value)} aria-invalid={Boolean(errors.audienceCountry)} /></label><label className={styles.full}>Sample content link<input type="url" value={values.sampleContentLink} onChange={(event) => update("sampleContentLink", event.target.value)} aria-invalid={Boolean(errors.sampleContentLink)} placeholder="https://" /></label></div></fieldset>}

      {educatorRequest && <fieldset className={styles.fieldset}><legend>Educator details</legend><div className={styles.formGrid}><label>Grade or learner level<input value={values.learnerLevel} onChange={(event) => update("learnerLevel", event.target.value)} aria-invalid={Boolean(errors.learnerLevel)} /></label><label>Class size<input type="number" min="1" value={values.classSize} onChange={(event) => update("classSize", event.target.value)} aria-invalid={Boolean(errors.classSize)} /></label><label>School or institute<input value={values.schoolOrInstitute} onChange={(event) => update("schoolOrInstitute", event.target.value)} aria-invalid={Boolean(errors.schoolOrInstitute)} /></label><label>Intended use<input value={values.intendedUse} onChange={(event) => update("intendedUse", event.target.value)} aria-invalid={Boolean(errors.intendedUse)} placeholder="For example: guided reading" /></label></div></fieldset>}

      {institutionRequest && <fieldset className={styles.fieldset}><legend>Institution details</legend><div className={styles.formGrid}><label>Department<input value={values.department} onChange={(event) => update("department", event.target.value)} aria-invalid={Boolean(errors.department)} /></label><label>Student count<input type="number" min="1" value={values.studentCount} onChange={(event) => update("studentCount", event.target.value)} aria-invalid={Boolean(errors.studentCount)} /></label><label>Resources required<input value={values.resourcesRequired} onChange={(event) => update("resourcesRequired", event.target.value)} aria-invalid={Boolean(errors.resourcesRequired)} /></label><label>Workshop or licensing requirement<input value={values.workshopOrLicensingRequirement} onChange={(event) => update("workshopOrLicensingRequirement", event.target.value)} aria-invalid={Boolean(errors.workshopOrLicensingRequirement)} /></label></div></fieldset>}

      <label className={styles.full}>Proposed collaboration<textarea rows="6" value={values.proposedCollaboration} onChange={(event) => update("proposedCollaboration", event.target.value)} aria-invalid={Boolean(errors.proposedCollaboration)} /></label>
      <label className={styles.full}>Why the collaboration is relevant<textarea rows="5" value={values.relevance} onChange={(event) => update("relevance", event.target.value)} aria-invalid={Boolean(errors.relevance)} /></label>
      <label className={styles.honeypot} aria-hidden="true">Company website<input tabIndex="-1" autoComplete="off" value={values.companyWebsite} onChange={(event) => update("companyWebsite", event.target.value)} /></label>
      <label className={styles.consent}><input type="checkbox" checked={values.consent} onChange={(event) => update("consent", event.target.checked)} /> I consent to LearnStack reviewing this request and contacting me about it.</label>
      {status.type !== "idle" && <output className={`${styles.status} ${styles[status.type]}`} role={status.type === "error" ? "alert" : "status"}>{status.message}</output>}
      <button className="brutalButton" type="submit" disabled={status.type === "loading" || !values.consent}>{status.type === "loading" ? "Sending..." : "Submit Partnership Request"}</button>
    </form>
  );
}
