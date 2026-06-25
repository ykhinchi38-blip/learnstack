export const site = {
  name: "LearnStack",
  tagline: "Learn. Build. Grow.",
  description:
    "LearnStack offers premium PDF handbooks for CSE students, developers, coding beginners, and kids learning books with instant access, demo previews, and affordable launch pricing.",
  url: "https://www.learnstack.co.in",
  gumroadStore: process.env.NEXT_PUBLIC_GUMROAD_STORE_URL || "https://learnstacks.gumroad.com/",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@learnstack.co.in",
  logo: "/images/logo/learnstack-logo.png",
  ogImage: "/og-image.png",
  socials: {
    gumroad: "https://learnstacks.gumroad.com/",
    pinterest: "#",
    instagram: "#",
    youtube: "#"
  }
};

export const navLinks = [
  { href: "/products", label: "Handbooks" },
  { href: "/kids", label: "Kids Books" },
  { href: "/categories", label: "Categories" },
  { href: "/bundles", label: "Bundles" },
  { href: "/free-resources", label: "Free Resources" },
  { href: "/coupons", label: "Coupons" },
  { href: "/#about", label: "About" },
  { href: "/contact", label: "Contact" }
];
