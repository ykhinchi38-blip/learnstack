export const site = {
  name: "LearnStack",
  tagline: "Learn. Build. Grow.",
  description:
    "LearnStack creates visual, practical, easy-to-follow digital learning books for students, developers, kids, parents, and teachers.",
  url: "https://www.learnstack.co.in",
  gumroadStore: process.env.NEXT_PUBLIC_GUMROAD_STORE_URL || "https://learnstacks.gumroad.com/",
  supportEmail: "learnstacksupport@gmail.com",
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
  { href: "/", label: "Home" },
  { href: "/products", label: "Handbooks" },
  { href: "/kids", label: "Kids" },
  { href: "/life-career", label: "Life & Career" },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
  { href: "/help", label: "Help" },
  { href: "/free-samples", label: "Free Samples" },
  { href: "/why-learnstack", label: "Why LearnStack" },
  { href: "/story", label: "Our Story" },
  { href: "/amazon-special", label: "Amazon Special" },
  { href: "/contact", label: "Contact" }
];
