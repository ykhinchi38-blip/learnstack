import styles from "./ProductDetailLoading.module.css";

export default function ProductDetailLoading({ label = "Loading details..." }) {
  return (
    <section className={styles.loadingSection} aria-label={label}>
      <div className={`container ${styles.loadingGrid}`}>
        <div className={styles.mediaSkeleton}>
          <div className={styles.loadingMark} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className={styles.coverSkeleton} />
          <div className={styles.previewSkeleton}>
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
        <div className={styles.copySkeleton}>
          <span className={styles.tagSkeleton} />
          <span className={styles.titleSkeleton} />
          <span className={styles.titleSkeletonShort} />
          <span className={styles.lineSkeleton} />
          <span className={styles.priceSkeleton} />
          <span className={styles.lineSkeleton} />
          <span className={styles.lineSkeleton} />
          <span className={styles.buttonSkeleton} />
        </div>
      </div>
    </section>
  );
}
