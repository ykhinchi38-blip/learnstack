import Link from "next/link";
import SubscriberDiscount from "@/components/SubscriberDiscount";
import JsonLd from "@/components/JsonLd";
import { createMetadata, breadcrumbJsonLd } from "@/lib/seo";
import styles from "./CouponsPage.module.css";

export const metadata = createMetadata({
  title: "Subscriber Coupons",
  description: "Unlock LearnStack subscriber-only coupon codes for Gumroad purchases after verifying your Gumroad subscriber email.",
  path: "/coupons"
});

export default function CouponsPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", href: "/" }, { name: "Subscriber Coupons", href: "/coupons" }])} />
      <section className="pageHero">
        <div className="container">
          <span className="pageEyebrow">LearnStack</span>
          <h1 className="pageTitle">Subscriber-only discounts.</h1>
          <p className="pageLead">Verify your Gumroad email and unlock exclusive LearnStack coupons for handbook purchases.</p>
        </div>
      </section>
      <section className={styles.section}>
        <div className={`container ${styles.grid}`}>
          <div className={styles.mainCard}>
            <h2>Subscriber Coupons</h2>
            <p>Verify your Gumroad email and unlock exclusive LearnStack coupons for handbook purchases.</p>
            <Link href="/products" className="brutalButton">Browse Handbooks</Link>
          </div>
          <SubscriberDiscount />
        </div>
      </section>
    </>
  );
}
