"use client";

import { useId } from "react";
import { brand } from "@/data/brand";
import styles from "./SuggestBookForm.module.css";

const subject = "New LearnStack Book Suggestion";

function encode(value) {
  return encodeURIComponent(value || "").replace(/%20/g, "+");
}

export default function SuggestBookForm() {
  const id = useId();

  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const body = [
      `Your role: ${formData.get("role")}`,
      `Book type: ${formData.get("bookType")}`,
      `Suggested book topic/title: ${formData.get("topic")}`,
      `Who should this book help?: ${formData.get("audience")}`,
      `What problem should this book solve?: ${formData.get("problem")}`,
      `Optional email: ${formData.get("email") || "Not provided"}`,
      "",
      "Message/details:",
      formData.get("message") || "Not provided"
    ].join("\n");

    window.location.href = `mailto:${brand.contactEmail}?subject=${encode(subject)}&body=${encode(body)}`;
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.fieldGrid}>
        <label>
          <span>Your role</span>
          <select name="role" defaultValue="Student">
            <option>Student</option>
            <option>Parent</option>
            <option>Teacher</option>
            <option>Self-learner</option>
            <option>Reader</option>
          </select>
        </label>

        <label>
          <span>Book type</span>
          <select name="bookType" defaultValue="Student handbook">
            <option>Student handbook</option>
            <option>Kids book</option>
            <option>Activity book</option>
            <option>Free resource</option>
            <option>Other LearnStack idea</option>
          </select>
        </label>
      </div>

      <label>
        <span>Suggested book topic/title</span>
        <input name="topic" required placeholder="Example: Docker basics for beginners" />
      </label>

      <div className={styles.fieldGrid}>
        <label>
          <span>Who should this book help?</span>
          <input name="audience" required placeholder="Example: first-year CSE students" />
        </label>

        <label>
          <span>Optional email</span>
          <input name="email" type="email" autoComplete="email" placeholder="your@email.com" />
        </label>
      </div>

      <label>
        <span>What problem should this book solve?</span>
        <textarea name="problem" required rows={4} placeholder="Tell us what feels confusing, missing, or hard to learn right now." />
      </label>

      <label>
        <span>Message/details</span>
        <textarea name="message" rows={5} placeholder="Add chapters, age group, examples, activities, or any extra context." />
      </label>

      <div className={styles.footer}>
        <p id={`${id}-privacy`}>
          This form opens your email app only. LearnStack does not store this suggestion on the website.
        </p>
        <button className="brutalButton" type="submit" aria-describedby={`${id}-privacy`}>
          Create Email Suggestion
        </button>
      </div>
    </form>
  );
}
