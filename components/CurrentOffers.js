"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/useToast";
import styles from "./CurrentOffers.module.css";

const CACHE_KEY = "learnstack:gumroad-coupons:v1";

function readCache() {
  if (typeof window === "undefined") return null;

  try {
    const cached = window.localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

function writeCache(coupons) {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify({ coupons, savedAt: Date.now() }));
  } catch {
    // Ignore storage failures; live offers still render.
  }
}

function discountLabel(coupon) {
  if (coupon.discountPercentage) return `${coupon.discountPercentage}% off`;
  return coupon.discountAmount || "Discount available";
}

export default function CurrentOffers() {
  const { showToast } = useToast();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [copiedCode, setCopiedCode] = useState("");

  useEffect(() => {
    let ignore = false;
    const cached = readCache();

    if (cached?.coupons?.length) {
      setCoupons(cached.coupons);
      setMessage("Refreshing current offers...");
    }

    async function loadCoupons() {
      try {
        const response = await fetch("/api/coupons", { cache: "no-store" });
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Could not load coupons.");
        }

        if (ignore) return;

        const activeCoupons = data.coupons || [];
        setCoupons(activeCoupons);
        setMessage(data.stale ? data.message || "Showing saved offers." : "");
        writeCache(activeCoupons);
      } catch (error) {
        if (ignore) return;

        const fallback = readCache();
        if (fallback?.coupons?.length) {
          setCoupons(fallback.coupons);
          setMessage("Gumroad is unavailable right now, so these are the last saved offers.");
        } else {
          setMessage("Current offers are unavailable right now.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadCoupons();

    return () => {
      ignore = true;
    };
  }, []);

  async function copyCode(code) {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      showToast("Code copied! 🎉", "success");
      window.setTimeout(() => setCopiedCode(""), 1400);
    } catch {
      setCopiedCode("");
      showToast("Could not copy code.", "error");
    }
  }

  if (loading && !coupons.length) {
    return (
      <section className={styles.offersSection} aria-label="Loading current offers">
        <div className={`container ${styles.offersBox}`}>
          <div>
            <span className={styles.kicker}>Current Offers</span>
            <h2>Checking live Gumroad coupons...</h2>
          </div>
          <div className={styles.skeletonGrid}>
            <span />
            <span />
            <span />
          </div>
        </div>
      </section>
    );
  }

  if (!coupons.length && !message) return null;
  if (!coupons.length && message) return null;

  return (
    <section className={styles.offersSection} aria-label="Current Gumroad offers">
      <div className={`container ${styles.offersBox}`}>
        <div className={styles.header}>
          <div>
            <span className={styles.kicker}>Current Offers</span>
            <h2>Use active Gumroad coupons before checkout.</h2>
          </div>
          {message && <p>{message}</p>}
        </div>

        <div className={styles.offerGrid}>
          {coupons.map((coupon) => (
            <article className={styles.offerCard} key={coupon.id}>
              <div>
                <strong>{coupon.productName}</strong>
                <span>{discountLabel(coupon)}</span>
              </div>
              <button type="button" onClick={() => copyCode(coupon.couponCode)}>
                {coupon.couponCode}
                <small>{copiedCode === coupon.couponCode ? "Copied" : "Copy"}</small>
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
