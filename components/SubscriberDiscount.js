"use client";

import { useState } from "react";
import Link from "next/link";
import { useToast } from "@/hooks/useToast";
import { site } from "@/lib/site";
import styles from "./SubscriberDiscount.module.css";

export default function SubscriberDiscount({ compact = false }) {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [code, setCode] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    setCode("");

    try {
      const response = await fetch("/api/verify-subscriber", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        setStatus("error");
        setMessage(data.message || "Email not found. Follow us on Gumroad to unlock future discounts.");
        return;
      }

      setStatus("success");
      setCode(data.code);
      setMessage(data.message);
    } catch (error) {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setMessage("Code copied. Paste it at Gumroad checkout.");
      showToast("Code copied! 🎉", "success");
    } catch {
      showToast("Could not copy code.", "error");
    }
  }

  return (
    <section className={compact ? styles.compactBox : styles.box}>
      <div>
        <span className={styles.kicker}>Subscriber gate</span>
        <h2>LearnStack Subscriber <mark>Exclusive</mark></h2>
        <p>Already follow us on Gumroad? You&apos;ve earned a discount. Enter the email you used on Gumroad.</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="subscriber-email">Gumroad email</label>
        <div className={styles.inputRow}>
          <input
            id="subscriber-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <button className="brutalButton" type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Checking..." : "Check My Discount"}
          </button>
        </div>
      </form>

      {status === "success" && (
        <div className={styles.success}>
          <p>{message}</p>
          <div className={styles.codeBox}>
            <strong>{code}</strong>
            <button type="button" onClick={copyCode}>Copy Code</button>
          </div>
          <Link href={site.gumroadStore} target="_blank" className="brutalButton brutalButtonWhite">
            Apply to your order →
          </Link>
        </div>
      )}

      {status === "error" && (
        <div className={styles.error}>
          <p>{message}</p>
          <Link href={site.gumroadStore} target="_blank">Follow LearnStack on Gumroad →</Link>
        </div>
      )}
    </section>
  );
}
