"use client";

import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import styles from "./ProductCatalog.module.css";

export default function ProductCatalog({
  products,
  searchLabel = "Search handbooks",
  searchPlaceholder = "Search Python, SQL, API, DSA...",
  countLabel = "handbooks",
  buyLabel = "Buy on Gumroad"
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(products.map((product) => product.category))).sort()];
  }, [products]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();
    return products.filter((product) => {
      const matchesCategory = category === "All" || product.category === category;
      const searchable = [product.title, product.subtitle, product.tagline, product.category, ...(product.topics || [])]
        .join(" ")
        .toLowerCase();
      return matchesCategory && searchable.includes(normalizedQuery);
    });
  }, [products, query, category]);

  return (
    <div className={styles.catalog}>
      <div className={styles.tools}>
        <div className={styles.searchBox}>
          <label htmlFor="catalog-search">{searchLabel}</label>
          <input
            id="catalog-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
          />
        </div>
        <div className={styles.count}>Showing {filtered.length} {countLabel}</div>
      </div>

      <div className={styles.filters} aria-label="Product category filters">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            className={category === item ? styles.active : ""}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {filtered.map((product, index) => (
          <ProductCard key={product.id} product={product} priority={index < 2} buyLabel={buyLabel} />
        ))}
      </div>
    </div>
  );
}
