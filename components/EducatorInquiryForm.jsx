"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics";
import styles from "./EducatorInquiryForm.module.css";

const initialValues = {
  name: "",
  email: "",
  organization: "",
  role: "",
  resource: "",
  learners: "",
  message: ""
};

export default function EducatorInquiryForm() {
  const [values, setValues] = useState(initialValues);
  const [status, setStatus] = useState("idle");

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setStatus("sending");
    const message = [
      `Name: ${values.name}`,
      `Work email: ${values.email}`,
      `Organization: ${values.organization}`,
      `Role: ${values.role}`,
      `Resource of interest: ${values.resource}`,
      `Number of learners: ${values.learners}`,
      "",
      values.message
    ].join("\n");

    trackEvent("educator_inquiry_submitted", { resource_interest: values.resource, learner_count: values.learners });
    setStatus("success");
    window.location.href = `mailto:learnstacksupport@gmail.com?subject=${encodeURIComponent("LearnStack educator inquiry")}&body=${encodeURIComponent(message)}`;
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label>Name<input value={values.name} onChange={(event) => update("name", event.target.value)} required /></label>
      <label>Work email<input type="email" value={values.email} onChange={(event) => update("email", event.target.value)} required /></label>
      <label>Organization<input value={values.organization} onChange={(event) => update("organization", event.target.value)} required /></label>
      <label>Role<input value={values.role} onChange={(event) => update("role", event.target.value)} required /></label>
      <label>Resource of interest<input value={values.resource} onChange={(event) => update("resource", event.target.value)} placeholder="For example: coding handbooks" required /></label>
      <label>Number of learners<input type="number" min="1" value={values.learners} onChange={(event) => update("learners", event.target.value)} required /></label>
      <label className={styles.full}>Message<textarea rows="6" value={values.message} onChange={(event) => update("message", event.target.value)} required /></label>
      <button className="brutalButton" type="submit" disabled={status === "sending"}>{status === "sending" ? "Preparing..." : "Send Inquiry"}</button>
      {status === "success" && <output className={styles.success}>Your email app is ready with this inquiry.</output>}
    </form>
  );
}
