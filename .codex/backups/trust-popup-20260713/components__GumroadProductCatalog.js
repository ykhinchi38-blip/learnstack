"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/pricing";
import { productEventParams, trackEvent } from "@/lib/analytics";
import styles from "./GumroadProductCatalog.module.css";

const CACHE_KEY = "learnstack:gumroad-products:regular:v2";

function readCache() {
  if (typeof window === "undefined") return null;

  try {
    const cached = window.localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

function writeCache(products) {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify({ products, savedAt: Date.now() }));
  } catch {
    // Browser storage can be unavailable in private mode. The live catalog still works.
  }
}

function ProductSkeleton() {
  return (
    <article className={`${styles.card} ${styles.skeletonCard}`} aria-hidden="true">
      <div className={styles.skeletonImage} />
      <div className={styles.skeletonBody}>
        <span />
        <strong />
        <p />
        <p />
        <em />
      </div>
    </article>
  );
}

function ProductImage({ product }) {
  const [src, setSrc] = useState(product.coverImage || "/images/covers/python-handbook.png");

  return (
    <Image
      src={src}
      alt={`${product.name} handbook cover by LearnStack`}
      className={styles.cover}
      width={320}
      height={426}
      sizes="(max-width: 700px) 100vw, 320px"
      loading="lazy"
      unoptimized={String(src).startsWith("http")}
      onError={() => setSrc("/images/covers/python-handbook.png")}
    />
  );
}

export default function GumroadProductCatalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    trackEvent("catalog_viewed", { catalog: "technical_handbooks" });

    let ignore = false;
    const cached = readCache();

    if (cached?.products?.length) {
      setProducts(cached.products);
      setMessage("Refreshing live Gumroad catalog...");
    }

    async function loadProducts() {
      try {
        const response = await fetch("/api/products?audience=regular", { cache: "no-store" });
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || data.message || "Could not load products.");
        }

        if (ignore) return;

        setProducts(data.products || []);
        setMessage(data.stale ? data.message || "Showing saved Gumroad catalog." : "");
        writeCache(data.products || []);
      } catch (error) {
        if (ignore) return;

        const fallback = readCache();
        if (fallback?.products?.length) {
          setProducts(fallback.products);
          setMessage(`Gumroad is unavailable right now, so this is the last saved catalog. Error: ${error.message}`);
        } else {
          setMessage(`We could not load the live Gumroad catalog. Error: ${error.message}`);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadProducts();

    return () => {
      ignore = true;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return products;

    return products.filter((product) => {
      return [product.name, product.description, product.priceDisplay]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [products, query]);

  if (loading && !products.length) {
    return (
      <div className={styles.catalog} aria-label="Loading Gumroad products">
        <div className={styles.statusBar}>Loading live handbooks from Gumroad...</div>
        <div className={styles.grid}>
          {Array.from({ length: 4 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.catalog}>
      <div className={styles.tools}>
        <label>
          <span>Search handbooks</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search live Gumroad products..."
          />
        </label>
        <strong>{products.length ? `${filteredProducts.length} live products` : "Live products unavailable"}</strong>
      </div>

      {message && <div className={styles.statusBar}>{message}</div>}

      {!filteredProducts.length ? (
        <div className={styles.emptyState}>
          <h2>No handbooks found.</h2>
          <p>Try another search, or check back after products are published on Gumroad.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredProducts.map((product) => (
            <article className={styles.card} key={product.id}>
              <ProductImage product={product} />
              <div className={styles.cardBody}>
                <span>Gumroad PDF</span>
                <h2>{product.name}</h2>
                <p>{product.description || "A LearnStack PDF handbook delivered through Gumroad."}</p>
                <div className={styles.metaRow}>
                  <strong>{formatPrice(product)}</strong>
                  <a href={product.url} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("gumroad_buy_clicked", productEventParams(product, "live_catalog"))}>
                    Buy PDF
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
