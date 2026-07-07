export const amazonBooks = [
  {
    title: "The Jealousy Monster: A Story About Understanding Jealousy and Choosing Kindness",
    shortTitle: "The Jealousy Monster",
    author: "Mr Yogesh Khinchi",
    category: "Kids",
    format: "Paperback",
    asin: "B0H6V85HCH",
    amazonUrl: "https://www.amazon.com/dp/B0H6V85HCH",
    authorUrl: "https://amazon.com/author/learnstack",
    status: "live",
    price: "",
    coverImage: "",
    digitalUrl: "/kids/learnstackkids-jealousy-monster",
    learnstackUrl: "/kids/learnstackkids-jealousy-monster",
    description: "A gentle LearnStack Kids paperback about understanding jealousy and choosing kindness.",
    productSlug: "learnstackkids-jealousy-monster"
  },
  {
    title: "The Angry Volcano: A Story About Big Feelings and Bigger Choices",
    shortTitle: "The Angry Volcano",
    author: "Mr Yogesh Khinchi",
    category: "Kids",
    format: "Paperback",
    asin: "B0H7XCLMXB",
    amazonUrl: "https://www.amazon.com/dp/B0H7XCLMXB",
    authorUrl: "https://amazon.com/author/learnstack",
    status: "publishing",
    price: "$12.00 USD",
    coverImage: "",
    digitalUrl: "",
    description: "A LearnStack Kids paperback about big feelings, self-control, and making better choices.",
    productSlug: "the-angry-volcano"
  },
  {
    title: "The Ant Who Lifted the Whole Mountain: A story about believing in yourself, no matter how small you are",
    shortTitle: "The Ant Who Lifted the Whole Mountain",
    author: "Mr Yogesh Khinchi",
    category: "Kids",
    format: "Paperback",
    asin: "B0H72BB53F",
    amazonUrl: "https://www.amazon.com/dp/B0H72BB53F",
    authorUrl: "https://amazon.com/author/learnstack",
    status: "live",
    price: "$13.00 USD",
    coverImage: "",
    digitalUrl: "",
    description: "A LearnStack Kids paperback about courage, self-belief, and trying even when you feel small.",
    productSlug: "the-ant-who-lifted-the-whole-mountain"
  },
  {
    title: "Brave Enough to Cry: 8 gentle stories about big feelings",
    shortTitle: "Brave Enough to Cry",
    author: "Mr Yogesh Khinchi",
    category: "Kids",
    format: "Paperback",
    asin: "B0H7WFJDJ5",
    amazonUrl: "https://www.amazon.com/dp/B0H7WFJDJ5",
    authorUrl: "https://amazon.com/author/learnstack",
    status: "live",
    price: "$16.60 USD",
    coverImage: "",
    digitalUrl: "",
    description: "A collection of gentle LearnStack Kids stories that help children understand big feelings.",
    productSlug: "brave-enough-to-cry"
  },
  {
    title: "The Seed's Big Adventure: A LearnStack Kids Picture Book",
    shortTitle: "The Seed's Big Adventure",
    author: "Mr Yogesh Khinchi",
    category: "Kids",
    format: "Paperback",
    asin: "B0H7WHTK76",
    amazonUrl: "https://www.amazon.com/dp/B0H7WHTK76",
    authorUrl: "https://amazon.com/author/learnstack",
    status: "live",
    price: "$13.00 USD",
    coverImage: "",
    digitalUrl: "",
    description: "A LearnStack Kids picture book about growth, patience, and discovering the world.",
    productSlug: "the-seeds-big-adventure"
  },
  {
    title: "I Don't Want to Try: A LearnStack Kids Picture Book About Tiny Brave Steps",
    shortTitle: "I Don't Want to Try",
    author: "Mr Yogesh Khinchi",
    category: "Kids",
    format: "Paperback",
    asin: "B0H7WKVTL3",
    amazonUrl: "https://www.amazon.com/dp/B0H7WKVTL3",
    authorUrl: "https://amazon.com/author/learnstack",
    status: "live",
    price: "$13.00 USD",
    coverImage: "",
    digitalUrl: "",
    description: "A LearnStack Kids picture book about confidence, practice, and taking tiny brave steps.",
    productSlug: "i-dont-want-to-try"
  }
];

export const amazonPaperbacks = amazonBooks.reduce((map, book) => {
  if (book.status === "live" && book.productSlug && book.amazonUrl) {
    map[book.productSlug] = book.amazonUrl;
  }

  return map;
}, {});

function normalizeMatchValue(value = "") {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function matchTokens(value = "") {
  const stopWords = new Set(["a", "about", "and", "book", "kids", "learnstack", "picture", "story", "the", "to", "who"]);
  return normalizeMatchValue(value)
    .split("-")
    .filter((token) => token.length > 2 && !stopWords.has(token));
}

function productMatchValues(product = {}) {
  return [
    product.title,
    product.name,
    product.slug,
    product.id,
    product.permalink,
    product.customPermalink,
    product.custom_permalink,
    product.linkName,
    product.link_name,
    product.raw?.permalink,
    product.raw?.custom_permalink,
    product.raw?.slug,
    product.asin,
    product.ASIN
  ].map(normalizeMatchValue).filter(Boolean);
}

export function getLiveAmazonBooks() {
  return amazonBooks.filter((book) => book.status === "live" && book.amazonUrl);
}

export function getDisplayableAmazonBooks() {
  return amazonBooks.filter((book) => book.status === "live" || book.status === "publishing" || book.status === "coming-soon");
}

export function findAmazonBookForProduct(product = {}) {
  const values = productMatchValues(product);

  return getLiveAmazonBooks().find((book) => {
    const bookValues = [
      book.title,
      book.shortTitle,
      book.productSlug,
      book.asin
    ].map(normalizeMatchValue).filter(Boolean);

    return bookValues.some((bookValue) => values.includes(bookValue));
  }) || null;
}

export function getAmazonUrlForProduct(product = {}) {
  return findAmazonBookForProduct(product)?.amazonUrl || product.amazonUrl || null;
}

function getBookMatchValues(book = {}) {
  return [
    book.title,
    book.shortTitle,
    book.productSlug,
    book.asin
  ].map(normalizeMatchValue).filter(Boolean);
}

function findProductForAmazonBook(book = {}, products = []) {
  const bookValues = getBookMatchValues(book);
  const bookTokens = matchTokens([book.title, book.shortTitle, book.productSlug].filter(Boolean).join(" "));

  return products.find((product) => {
    const values = productMatchValues(product);
    const directMatch = bookValues.some((bookValue) => values.includes(bookValue));

    if (directMatch) {
      return true;
    }

    const strongContainmentMatch = bookValues
      .filter((bookValue) => bookValue.length >= 12)
      .some((bookValue) => values.some((value) => value.length >= 12 && (value.includes(bookValue) || bookValue.includes(value))));

    if (strongContainmentMatch) {
      return true;
    }

    const productTokens = matchTokens([product.title, product.name, product.slug, product.id, product.permalink, product.raw?.permalink].filter(Boolean).join(" "));
    const overlap = bookTokens.filter((token) => productTokens.includes(token));
    return overlap.length >= Math.min(3, bookTokens.length);
  }) || null;
}

export function getAmazonCover(book = {}, products = []) {
  if (book.coverImage) {
    return book.coverImage;
  }

  const matchedProduct = findProductForAmazonBook(book, products);
  return matchedProduct?.coverImage || matchedProduct?.image || matchedProduct?.thumbnail || matchedProduct?.raw?.thumbnail_url || matchedProduct?.raw?.cover_url || "";
}

export function getAmazonPaperbackProducts(products = []) {
  return getDisplayableAmazonBooks().map((book) => {
    const matchedProduct = findProductForAmazonBook(book, products);
    const coverImage = getAmazonCover(book, products);

    return {
      ...matchedProduct,
      ...book,
      id: book.asin,
      title: book.title,
      shortTitle: book.shortTitle,
      coverImage,
      image: coverImage,
      digitalUrl: book.digitalUrl || book.learnstackUrl || (matchedProduct?.detailPath || ""),
      learnstackUrl: book.digitalUrl || book.learnstackUrl || (matchedProduct?.detailPath || "")
    };
  });
}

export function getHomepageAmazonPaperbackProducts(products = [], limit = 4) {
  const priority = [
    "the-ant-who-lifted-the-whole-mountain",
    "brave-enough-to-cry",
    "the-seeds-big-adventure",
    "i-dont-want-to-try",
    "learnstackkids-jealousy-monster"
  ];

  return getAmazonPaperbackProducts(products)
    .filter((book) => book.status === "live")
    .sort((first, second) => {
      const firstIndex = priority.indexOf(first.productSlug);
      const secondIndex = priority.indexOf(second.productSlug);
      return (firstIndex === -1 ? 99 : firstIndex) - (secondIndex === -1 ? 99 : secondIndex);
    })
    .slice(0, limit);
}
