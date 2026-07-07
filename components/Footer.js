import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandCol}>
          <Link href="/" className={styles.brand}>
            <Image src={site.logo} alt="LearnStack logo" width={44} height={44} />
            <span>LearnStack</span>
          </Link>
          <p>Premium PDF handbooks, Life & Career Playbooks, and kids learning books.</p>
        </div>

        <div>
          <h3>Explore</h3>
          <ul>
            <li><Link href="/products">Handbooks</Link></li>
            <li><Link href="/bundles">Bundles</Link></li>
            <li><Link href="/kids">Kids Books</Link></li>
            <li><Link href="/kids/books">All Kids Books</Link></li>
            <li><Link href="/life-career">Life & Career</Link></li>
            <li><Link href="/resources">Resources</Link></li>
            <li><Link href="/free-samples">Free Samples</Link></li>
            <li><Link href="/story">Our Story</Link></li>
          </ul>
        </div>

        <div>
          <h3>Support</h3>
          <ul>
            <li><Link href="/help">Help</Link></li>
            <li><Link href="/why-learnstack">Why LearnStack</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a></li>
            <li><Link href={site.gumroadStore} target="_blank">Gumroad Store</Link></li>
            <li><Link href="/suggest-a-book">Suggest a Book</Link></li>
          </ul>
        </div>

        <div>
          <h3>Legal</h3>
          <ul>
            <li><Link href="/terms">Terms</Link></li>
            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
            <li><Link href="/refund-policy">Refund Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className={styles.bottom}>Copyright {new Date().getFullYear()} LearnStack. All rights reserved.</div>
    </footer>
  );
}
