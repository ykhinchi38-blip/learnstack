import styles from "./PageEntrance.module.css";

export default function PageEntrance({ as: Element = "div", variant = "fadeUp", stagger = false, children, className = "" }) {
  const variantClass = styles[variant] || styles.fadeUp;
  const classNames = [styles.shell, variantClass, stagger ? styles.staggerCards : "", className].filter(Boolean).join(" ");

  return <Element className={classNames}>{children}</Element>;
}
