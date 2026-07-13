"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getLocalProducts } from "@/data/products";
import { productDetailHref } from "@/lib/productRouting";
import { site } from "@/lib/site";
import styles from "./Navbar.module.css";

const mainLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Handbooks" },
  { href: "/kids", label: "Kids Books" },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
  { href: "/help", label: "Help" }
];

const moreLinks = [
  { href: "/bundles", label: "Bundles" },
  { href: "/life-career", label: "Life & Career" },
  { href: "/free-samples", label: "Free Samples" },
  { href: "/why-learnstack", label: "Why LearnStack" },
  { href: "/story", label: "Our Story" },
  { href: "/amazon-special", label: "Amazon Special" },
  { href: "/suggest-a-book", label: "Suggest a Book" },
  { href: "/for-educators", label: "For Educators" },
  { href: "/partner-with-us", label: "Partner With Us" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms" },
  { href: "/refund-policy", label: "Refund Policy" }
];

const mobileLinks = [
  ...mainLinks,
  ...moreLinks
];
const searchableProducts = getLocalProducts();

function isActivePath(pathname, href) {
  if (href.includes("#")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function linkClassName(active) {
  return active ? `${styles.navLink} ${styles.activeLink}` : styles.navLink;
}

function SearchIcon({ variant = "search" }) {
  if (variant === "star") {
    return <span className={styles.searchStar} aria-hidden="true">★</span>;
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 4 4" />
    </svg>
  );
}

function HighlightedText({ text, query }) {
  const cleanQuery = query.trim();

  if (!cleanQuery) {
    return text;
  }

  const matchIndex = text.toLowerCase().indexOf(cleanQuery.toLowerCase());

  if (matchIndex === -1) {
    return text;
  }

  const before = text.slice(0, matchIndex);
  const match = text.slice(matchIndex, matchIndex + cleanQuery.length);
  const after = text.slice(matchIndex + cleanQuery.length);

  return (
    <>
      {before}
      <mark>{match}</mark>
      {after}
    </>
  );
}

function SearchDropdown({ query, results, onSelect }) {
  const hasQuery = query.trim().length > 0;

  return (
    <div className={styles.searchDropdown} onMouseDown={(event) => event.preventDefault()}>
      {hasQuery && results.length > 0 ? (
        results.map((product) => {
          const href = productDetailHref(product);

          return (
          <Link
            key={product.id}
            href={href}
            className={styles.searchResult}
            onClick={onSelect}
          >
            <strong><HighlightedText text={product.title} query={query} /></strong>
            <span>
              <HighlightedText text={`${product.subtitle} - ${product.category}`} query={query} />
            </span>
          </Link>
          );
        })
      ) : (
        <span className={styles.searchHint}>Press Enter to search</span>
      )}
    </div>
  );
}

function SearchBox({ id, query, setQuery, results, onSubmit, onSelect, mobile = false, placeholder = "Search LearnStack books...", icon = "search" }) {
  const [focused, setFocused] = useState(false);
  const showDropdown = mobile || focused;

  return (
    <form
      className={`${styles.searchWrap} ${mobile ? styles.mobileSearchWrap : ""}`}
      role="search"
      onSubmit={onSubmit}
    >
      <label className="visuallyHidden" htmlFor={id}>Search LearnStack books</label>
      <span className={styles.searchIcon}>
        <SearchIcon variant={icon} />
      </span>
      <input
        id={id}
        type="search"
        value={query}
        placeholder={placeholder}
        className={styles.searchInput}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoComplete="off"
      />
      {showDropdown && <SearchDropdown query={query} results={results} onSelect={onSelect} />}
    </form>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isKidsRoute = pathname.startsWith("/kids");
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const moreRef = useRef(null);
  const moreMenuId = "learnstack-more-menu";
  const mobileMenuId = "learnstack-mobile-menu";
  const moreActive = moreLinks.some((link) => isActivePath(pathname, link.href));
  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return [];
    }

    return searchableProducts
      .filter((product) => !isKidsRoute || (product.audience || "regular") === "kids")
      .filter((product) => {
        const searchableText = [
          product.title,
          product.subtitle,
          product.category,
          product.tagline,
          ...(product.topics || [])
        ].join(" ").toLowerCase();

        return searchableText.includes(query);
      })
      .slice(0, 5);
  }, [isKidsRoute, searchQuery]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function handleDocumentClick(event) {
      if (moreRef.current && !moreRef.current.contains(event.target)) {
        setMoreOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setOpen(false);
        setMoreOpen(false);
        setMobileSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", handleDocumentClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function closeMenus() {
    setOpen(false);
    setMoreOpen(false);
    setMobileSearchOpen(false);
  }

  function handleSearchSubmit(event) {
    event.preventDefault();

    if (searchResults[0]) {
      const firstResult = searchResults[0];
      router.push(productDetailHref(firstResult));
      closeMenus();
      return;
    }

    if (searchQuery.trim()) {
      router.push(isKidsRoute ? "/kids/books" : "/products");
      closeMenus();
    }
  }

  return (
    <header className={`${styles.header} ${isKidsRoute ? styles.kidsHeader : ""}`}>
      <div className={styles.topLine}>
        <Link href={site.gumroadStore} target="_blank" rel="noopener noreferrer">
          <span className={styles.announcementCopy}>Follow us on Gumroad to get extra discounts on LearnStack books.</span>
          {" "}
          <span className={styles.announcementCta}>Follow on Gumroad</span>
        </Link>
      </div>

      <div className={styles.inner}>
        <Link href="/" className={styles.logoWrap} aria-label="LearnStack home" onClick={closeMenus}>
          <span className={styles.logoMark}>
            <Image
              src={site.logo}
              alt="LearnStack logo"
              width={46}
              height={46}
              priority
              className={styles.logo}
            />
            {isKidsRoute && <span className={styles.logoStar} aria-hidden="true">★</span>}
          </span>
          <span className={styles.brandText}>
            <strong>LearnStack</strong>
            <small>Digital handbooks</small>
          </span>
        </Link>

        <nav className={styles.desktopNav} aria-label="Primary navigation">
          {mainLinks.map((link) => (
            <Link key={link.href} href={link.href} className={linkClassName(isActivePath(pathname, link.href))}>
              {isKidsRoute && link.href === "/kids" && <span className={styles.kidsNavStar} aria-hidden="true">★</span>}
              {link.label}
            </Link>
          ))}

          <div
            className={`${styles.moreWrap} ${moreOpen ? styles.moreWrapOpen : ""}`}
            ref={moreRef}
            onMouseEnter={() => setMoreOpen(true)}
            onMouseLeave={() => setMoreOpen(false)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setMoreOpen(false);
              }
            }}
          >
            <button
              type="button"
              className={`${styles.moreButton} ${moreActive ? styles.activeLink : ""}`}
              aria-label="Open more navigation links"
              aria-expanded={moreOpen}
              aria-controls={moreMenuId}
              aria-haspopup="menu"
              onClick={() => setMoreOpen((current) => !current)}
              onFocus={() => setMoreOpen(true)}
            >
              More
              <span aria-hidden="true">+</span>
            </button>

            <div className={styles.moreMenu} id={moreMenuId} role="menu" aria-label="More navigation links">
              {moreLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  role="menuitem"
                  className={isActivePath(pathname, link.href) ? styles.moreActive : ""}
                  onClick={closeMenus}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className={styles.actions}>
          <SearchBox
            id="desktop-handbook-search"
            query={searchQuery}
            setQuery={setSearchQuery}
            results={searchResults}
            onSubmit={handleSearchSubmit}
            onSelect={closeMenus}
            placeholder={isKidsRoute ? "Search kids books..." : "Search LearnStack books..."}
            icon={isKidsRoute ? "star" : "search"}
          />
        </div>

        <button
          className={styles.mobileSearchButton}
          type="button"
          aria-label={mobileSearchOpen ? "Close handbook search" : "Open handbook search"}
          aria-expanded={mobileSearchOpen}
          onClick={() => {
            setOpen(false);
            setMobileSearchOpen((current) => !current);
          }}
        >
          <SearchIcon variant={isKidsRoute ? "star" : "search"} />
        </button>

        <button
          className={styles.menuButton}
          type="button"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls={mobileMenuId}
          onClick={() => setOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {mobileSearchOpen && (
        <div className={styles.mobileSearchPanel}>
          <SearchBox
            id="mobile-handbook-search"
            query={searchQuery}
            setQuery={setSearchQuery}
            results={searchResults}
            onSubmit={handleSearchSubmit}
            onSelect={closeMenus}
            placeholder={isKidsRoute ? "Search kids books..." : "Search LearnStack books..."}
            icon={isKidsRoute ? "star" : "search"}
            mobile
          />
        </div>
      )}

      {open && (
        <div className={styles.overlay} id={mobileMenuId} role="dialog" aria-modal="true" aria-label="Mobile navigation menu">
          <div className={styles.overlayTop}>
            <Link href="/" className={styles.overlayBrand} onClick={closeMenus}>
              <Image src={site.logo} alt="LearnStack logo" width={48} height={48} />
              <span>
                <strong>LearnStack</strong>
                <small>Digital handbooks</small>
              </span>
            </Link>
            <button
              className={styles.closeButton}
              type="button"
              aria-label="Close navigation menu"
              onClick={() => setOpen(false)}
            >
              &times;
            </button>
          </div>

          <nav className={styles.mobileNav} aria-label="Mobile navigation">
            {mobileLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={isActivePath(pathname, link.href) ? styles.mobileActive : ""}
                onClick={closeMenus}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className={styles.mobileActions}>
            <Link
              href={site.amazonAuthorUrl}
              className={styles.gumroadMobile}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
            >
              View LearnStack on Amazon
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
