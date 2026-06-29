import styles from "./StoryBookAnimation.module.css";

export default function StoryBookAnimation() {
  return (
    <div
      className={styles.stage}
      role="img"
      aria-label="An open LearnStack book with animated pages"
    >
      <span className={`${styles.spark} ${styles.sparkOne}`} />
      <span className={`${styles.spark} ${styles.sparkTwo}`} />
      <span className={`${styles.spark} ${styles.sparkThree}`} />

      <div className={styles.bookWrap}>
        <div className={styles.bookShadow} />

        <div className={styles.openBook}>
          <div className={styles.leftPage}>
            <span className={styles.pageTitle} />
            <span className={styles.pageLine} />
            <span className={styles.pageLineShort} />
            <span className={styles.highlightYellow} />
            <span className={styles.pageLine} />
          </div>

          <div className={styles.rightPage}>
            <span className={styles.pageTitleBlue} />
            <span className={styles.pageLine} />
            <span className={styles.highlightBlue} />
            <span className={styles.pageLineShort} />
            <span className={styles.pageLine} />
          </div>

          <div className={styles.flippingPage}>
            <span className={styles.pageTitle} />
            <span className={styles.pageLine} />
            <span className={styles.pageLineShort} />
          </div>

          <span className={styles.spine} />
        </div>

        <div className={styles.bookLabel}>
          <strong>LearnStack</strong>
          <small>Clear learning books</small>
        </div>
      </div>
    </div>
  );
}
