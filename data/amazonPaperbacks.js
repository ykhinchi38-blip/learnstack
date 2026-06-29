export const amazonBooks = [
  {
    title: "The Jealousy Monster: A Story About Understanding Jealousy and Choosing Kindness",
    shortTitle: "The Jealousy Monster",
    author: "Mr Yogesh Khinchi",
    category: "Kids",
    format: "Paperback",
    asin: "B0H6V85HCH",
    amazonUrl: "https://www.amazon.com/dp/B0H6V85HCH",
    status: "live",
    learnstackUrl: "/kids/learnstackkids-jealousy-monster",
    coverImage: "",
    productSlug: "learnstackkids-jealousy-monster"
  }
];

export const amazonPaperbacks = amazonBooks.reduce((map, book) => {
  if (book.productSlug && book.amazonUrl) {
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

function productMatchValues(product = {}) {
  return [
    product.title,
    product.name,
    product.slug,
    product.id,
    product.raw?.permalink,
    product.raw?.slug,
    product.asin,
    product.ASIN
  ].map(normalizeMatchValue).filter(Boolean);
}

export function getLiveAmazonBooks() {
  return amazonBooks.filter((book) => book.status === "live" && book.amazonUrl);
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

export function getAmazonPaperbackProducts(products = []) {
  return getLiveAmazonBooks().map((book) => {
    const matchedProduct = products.find((product) => findAmazonBookForProduct(product)?.asin === book.asin);
    const coverImage = book.coverImage || matchedProduct?.image || matchedProduct?.coverImage || "";

    return {
      ...matchedProduct,
      ...book,
      id: book.asin,
      title: book.title,
      shortTitle: book.shortTitle,
      coverImage,
      image: coverImage,
      learnstackUrl: book.learnstackUrl || (matchedProduct?.detailPath || "")
    };
  });
}
