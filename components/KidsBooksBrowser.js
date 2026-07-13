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
  const [category, setCategory] = useState("All");
  const [ageRange, setAgeRange] = useState("All");
  const [sort, setSort] = useState("recommended");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const categories = useMemo(() => ["All", ...Array.from(new Set(products.map((product) => product.category).filter(Boolean))).sort()], [products]);
  const ages = useMemo(() => ["All", ...Array.from(new Set(products.map((product) => product.ageRange || product.badge).filter(Boolean))).sort()], [products]);

  const filteredProducts = useMemo(() => {
    const search = normalize(query);

    const matches = products.filter((product) => {
      const searchable = [
        product.title,
        product.summary,
        product.tagline,
        product.category,
        product.badge,
        ...(Array.isArray(product.topics) ? product.topics : [])
      ].map(normalize).join(" ");

      const matchesCategory = category === "All" || product.category === category;
      const productAge = product.ageRange || product.badge || "";
      const matchesAge = ageRange === "All" || productAge === ageRange;
      return matchesCategory && matchesAge && searchable.includes(search);
    });

    return [...matches].sort((a, b) => {
      if (sort === "price-low") return (Number(a.price) || 0) - (Number(b.price) || 0);
      if (sort === "price-high") return (Number(b.price) || 0) - (Number(a.price) || 0);
      if (sort === "newest") return Date.parse(b.createdAt || b.updatedAt || 0) - Date.parse(a.createdAt || a.updatedAt || 0);
      return Number(Boolean(b.featured || b.isFeatured)) - Number(Boolean(a.featured || a.isFeatured));
    });
  }, [products, query, category, ageRange, sort]);

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
      <div className={styles.filters}>
        <label>Category<select value={category} onChange={(event) => { setCategory(event.target.value); setVisibleCount(PAGE_SIZE); }}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Age range<select value={ageRange} onChange={(event) => { setAgeRange(event.target.value); setVisibleCount(PAGE_SIZE); }}>{ages.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Sort<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="recommended">Recommended</option><option value="newest">Newest</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></label>
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
