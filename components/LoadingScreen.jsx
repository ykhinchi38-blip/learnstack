"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./LoadingScreen.module.css";

const FLOATING_DOTS = [
  { x: "13%", y: "20%", size: "7px", delay: "0s" },
  { x: "24%", y: "72%", size: "10px", delay: "0.18s" },
  { x: "73%", y: "18%", size: "8px", delay: "0.32s" },
  { x: "84%", y: "67%", size: "6px", delay: "0.48s" },
  { x: "58%", y: "82%", size: "9px", delay: "0.64s" }
];

export default function LoadingScreen() {
  const pathname = usePathname();
  const isKidsRoute = pathname === "/kids" || pathname?.startsWith("/kids/");
  const isStoryRoute = pathname === "/story";
  const suppressLoader = isKidsRoute || isStoryRoute;
  const firstPath = useRef(true);
  const [showInitial, setShowInitial] = useState(true);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    if (suppressLoader) {
      setShowInitial(false);
      return undefined;
    }

    const timer = setTimeout(() => setShowInitial(false), 2300);
    return () => clearTimeout(timer);
  }, [suppressLoader]);

  useEffect(() => {
    if (suppressLoader) {
      setTransitioning(false);
      firstPath.current = true;
      return undefined;
    }

    if (firstPath.current) {
      firstPath.current = false;
      return;
    }

    setTransitioning(false);
    const frame = requestAnimationFrame(() => setTransitioning(true));
    const timer = setTimeout(() => setTransitioning(false), 760);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [pathname, suppressLoader]);

  if (suppressLoader) return null;

  return (
    <>
      <div className={`${styles.progressBar} ${transitioning ? styles.progressActive : ""}`} aria-hidden="true" />
      {showInitial && (
        <div className={styles.loader} aria-label="Loading LearnStack">
          <div className={styles.floatingDots} aria-hidden="true">
            {FLOATING_DOTS.map((dot) => (
              <span
                key={`${dot.x}-${dot.y}`}
                style={{
                  "--dot-x": dot.x,
                  "--dot-y": dot.y,
                  "--dot-size": dot.size,
                  "--dot-delay": dot.delay
                }}
              />
            ))}
          </div>
          <div className={styles.loaderCard}>
            <div className={styles.bookLoader} aria-hidden="true">
              <span className={styles.bookGlow} />
              <span className={`${styles.bookCover} ${styles.leftCover}`} />
              <span className={`${styles.bookCover} ${styles.rightCover}`} />
              <span className={styles.bookSpine} />
              <span className={`${styles.bookLine} ${styles.bookLineOne}`} />
              <span className={`${styles.bookLine} ${styles.bookLineTwo}`} />
            </div>
            <div className={styles.loaderCopy}>
              <strong>LearnStack</strong>
              <span>Learn. Build. Grow.</span>
            </div>
            <div className={styles.loaderProgress} aria-hidden="true">
              <span />
            </div>
            <div className={styles.loaderDots} aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
