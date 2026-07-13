"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/analytics";
import ProductCard from "./ProductCard";
import ProductComparison from "./ProductComparison";
import styles from "./ProductCatalog.module.css";

export default function ProductCatalog({
  products,
  searchLabel = "Search handbooks",
  searchPlaceholder = "Search Python, SQL, API, DSA...",
  countLabel = "handbooks",
  buyLabel = "Buy on Gumroad",
  enableComparison = false
}) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(() => searchParams.get("category") || "All");
  const [level, setLevel] = useState("All");
  const [type, setType] = useState("All");
  const [sort, setSort] = useState("recommended");
  const [comparisonIds, setComparisonIds] = useState([]);

  const comparisonProducts = useMemo(() => {
    if (!enableComparison) return [];

    return products.filter((product) => {
      const audience = String(product.audience || "regular").toLowerCase();
      return audience === "regular" && !product.isBundle;
    });
  }, [enableComparison, products]);

  const selectedProducts = useMemo(() => {
    const selected = new Set(comparisonIds);
    return comparisonProducts.filter((product) => selected.has(String(product.id)));
  }, [comparisonIds, comparisonProducts]);

  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(products.map((product) => product.category))).sort()];
  }, [products]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();
    const matches = products.filter((product) => {
      const matchesCategory = category === "All" || product.category === category;
      const productLevel = String(product.level || product.skillLevel || "").toLowerCase();
      const matchesLevel = level === "All" || productLevel.includes(level.toLowerCase());
      const matchesType = type === "All" || (type === "Bundles" ? product.isBundle : !product.isBundle);
      const searchable = [product.title, product.subtitle, product.tagline, product.category, ...(product.topics || [])]
        .join(" ")
        .toLowerCase();
      return matchesCategory && matchesLevel && matchesType && searchable.includes(normalizedQuery);
    });

    return [...matches].sort((a, b) => {
      if (sort === "price-low") return (Number(a.price) || 0) - (Number(b.price) || 0);
      if (sort === "price-high") return (Number(b.price) || 0) - (Number(a.price) || 0);
      if (sort === "newest") return Date.parse(b.createdAt || b.updatedAt || 0) - Date.parse(a.createdAt || a.updatedAt || 0);
      return Number(Boolean(b.featured || b.isFeatured)) - Number(Boolean(a.featured || a.isFeatured));
    });
  }, [products, query, category, level, type, sort]);

  function clearFilters() {
    setQuery("");
    setCategory("All");
    setLevel("All");
    setType("All");
    setSort("recommended");
  }

  function toggleComparison(product) {
    const productId = String(product.id);

    setComparisonIds((currentIds) => {
      if (currentIds.includes(productId)) {
        return currentIds.filter((id) => id !== productId);
      }

      return currentIds.length < 3 ? [...currentIds, productId] : currentIds;
    });
  }

  function clearComparison() {
    setComparisonIds([]);
  }

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

      <div className={styles.selectFilters}>
        <label>Level<select value={level} onChange={(event) => setLevel(event.target.value)}><option>All</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label>
        <label>Type<select value={type} onChange={(event) => setType(event.target.value)}><option>All</option><option>Individual</option><option>Bundles</option></select></label>
        <label>Sort<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="recommended">Recommended</option><option value="newest">Newest</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></label>
        <button type="button" className={styles.clearButton} onClick={clearFilters}>Clear filters</button>
      </div>

      <div className={styles.filters} aria-label="Product category filters">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            className={category === item ? styles.active : ""}
            onClick={() => {
              setCategory(item);
              trackEvent("category_selected", { category: item });
            }}
          >
            {item}
          </button>
        ))}
      </div>

      {enableComparison && (
        <ProductComparison
          products={selectedProducts}
          onRemove={toggleComparison}
          onClear={clearComparison}
        />
      )}

      <div className={styles.grid}>
        {filtered.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            priority={index < 2}
            buyLabel={buyLabel}
            comparisonSelected={comparisonIds.includes(String(product.id))}
            comparisonDisabled={enableComparison && comparisonIds.length >= 3 && !comparisonIds.includes(String(product.id))}
            onToggleComparison={enableComparison ? toggleComparison : undefined}
          />
        ))}
      </div>
      {filtered.length === 0 && <div className={styles.empty}>No books match those filters. Clear a filter or search a different topic.</div>}
    </div>
  );
}
