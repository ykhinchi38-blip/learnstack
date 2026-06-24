export default function Icon({ name = "book", className = "" }) {
  const common = {
    width: 26,
    height: 26,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className,
    "aria-hidden": true
  };

  const icons = {
    book: (
      <svg {...common}><path d="M4 5.5C4 4.7 4.7 4 5.5 4H20v14H6.5A2.5 2.5 0 0 0 4 20.5v-15Z" stroke="currentColor" strokeWidth="2.2"/><path d="M4 18c0-1.1.9-2 2-2h14" stroke="currentColor" strokeWidth="2.2"/></svg>
    ),
    bolt: (
      <svg {...common}><path d="m13 2-9 12h7l-1 8 9-12h-7l1-8Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round"/></svg>
    ),
    code: (
      <svg {...common}><path d="m9 18-6-6 6-6M15 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square"/></svg>
    ),
    shield: (
      <svg {...common}><path d="M12 3 5 6v5c0 4.5 3 8.5 7 10 4-1.5 7-5.5 7-10V6l-7-3Z" stroke="currentColor" strokeWidth="2.2"/><path d="m9 12 2 2 4-5" stroke="currentColor" strokeWidth="2.2"/></svg>
    ),
    graph: (
      <svg {...common}><path d="M4 19V5M4 19h16M8 16v-5M12 16V8M16 16v-8" stroke="currentColor" strokeWidth="2.2"/></svg>
    ),
    file: (
      <svg {...common}><path d="M6 3h8l4 4v14H6V3Z" stroke="currentColor" strokeWidth="2.2"/><path d="M14 3v5h5M9 13h6M9 17h6" stroke="currentColor" strokeWidth="2.2"/></svg>
    )
  };

  return icons[name] || icons.book;
}
