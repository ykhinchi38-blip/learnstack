import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import KidsBooksBrowser from "@/components/KidsBooksBrowser";
import PageEntrance from "@/components/PageEntrance";
import { getKidsProductsResult } from "@/lib/gumroad";
import { getAllKidsProducts } from "@/lib/productCollections";
import { breadcrumbJsonLd, collectionPageJsonLd, createMetadata } from "@/lib/seo";
import styles from "./KidsBooksPage.module.css";

export const revalidate = 300;

export const metadata = createMetadata({
  title: "Educational Children's Books & Printable Activities",
  description: "Browse LearnStack educational children's books with stories, guided activities, coding ideas, and practical learning resources for families and classrooms.",
  path: "/kids/books",
  keywords: ["educational children's books", "printable children's activities", "classroom learning resources", "kids learning PDFs"]
});

export default async function KidsBooksPage() {
  const { products, error } = await getKidsProductsResult();
  const kidsProducts = getAllKidsProducts(products);

  return (
    <PageEntrance variant="staggerCards" stagger className={styles.page}>
      <JsonLd data={breadcrumbJsonLd([
        { name: "Home", href: "/" },
        { name: "Kids Books", href: "/kids" },
        { name: "All Kids Books", href: "/kids/books" }
      ])} />
      <JsonLd data={collectionPageJsonLd({ name: "Educational Children's Books and Activities", description: metadata.description, path: "/kids/books" })} />

      <section className={styles.hero}>
        <div className="container">
          <span className={styles.eyebrow}>LearnStack Kids</span>
          <h1>All Kids Books</h1>
          <p>Colourful, practical, value-based books for curious kids.</p>
          <div className={styles.heroActions}>
            <Link href="/kids" className="brutalButton brutalButtonWhite">Kids Home</Link>
            <Link href="/free-samples" className="brutalButton">Free Samples</Link>
          </div>
        </div>
      </section>

      <section className={styles.catalogSection}>
        <div className="container">
          {error ? (
            <div className={styles.emptyState}>
              <h2>Unable to load kids books right now.</h2>
              <p>Please try again later.</p>
            </div>
          ) : kidsProducts.length ? (
            <KidsBooksBrowser products={kidsProducts} />
          ) : (
            <div className={styles.emptyState}>
              <h2>No kids books found yet.</h2>
              <p>Please check that Gumroad kids product URLs contain learnstackkids.</p>
            </div>
          )}
        </div>
      </section>
    </PageEntrance>
  );
}
