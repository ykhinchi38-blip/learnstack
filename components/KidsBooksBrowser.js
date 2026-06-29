"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import styles from "./KidsBooksBrowser.module.css";

const PAGE_SIZE = 12;

function normalize(value = "") {
  return String(value || "").toLowerCase().trim();
}

export default function KidsBooksBrowser({ products = [] }) {
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filteredProducts = useMemo(() => {
    const search = normalize(query);

    if (!search) return products;

    return products.filter((product) => {
      const searchable = [
        product.title,
        product.summary,
        product.tagline,
        product.category,
        product.badge,
        ...(Array.isArray(product.topics) ? product.topics : [])
      ].map(normalize).join(" ");

      return searchable.includes(search);
    });
  }, [products, query]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  function handleSearch(event) {
    setQuery(event.target.value);
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <div className={styles.browser}>
      <div className={styles.toolbar}>
        <label htmlFor="kids-book-search">Search kids books</label>
        <input
          id="kids-book-search"
          type="search"
          value={query}
          onChange={handleSearch}
          placeholder="Search by title or topic"
        />
        <span>{filteredProducts.length} {filteredProducts.length === 1 ? "book" : "books"}</span>
      </div>

      {visibleProducts.length ? (
        <>
          <div className={styles.grid}>
            {visibleProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                priority={index < 2}
                buyLabel="Buy on Gumroad"
                showSample
              />
            ))}
          </div>

          {hasMore && (
            <div className={styles.loadMoreWrap}>
              <button
                type="button"
                className="brutalButton"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              >
                Load More
              </button>
            </div>
          )}
        </>
      ) : (
        <div className={styles.emptyState}>
          <h2>No kids books match your search.</h2>
          <p>Try another title, topic, or keyword.</p>
        </div>
      )}
    </div>
  );
}
