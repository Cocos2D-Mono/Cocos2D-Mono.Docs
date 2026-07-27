import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import showcase from "@site/src/data/showcase";
import styles from "./styles.module.css";

function Initials({ title }) {
  const initials = title
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return <div className={styles.initialsTile}>{initials}</div>;
}

function ShowcaseCard({ title, studio, blurb, image, links }) {
  const imageUrl = useBaseUrl(image ?? "");
  const primary = links[0];
  return (
    <div className={styles.card}>
      <Link to={primary.url} className={styles.media} aria-label={`${title} — ${primary.label}`}>
        {image ? (
          <img src={imageUrl} alt={`${title} key art`} loading="lazy" />
        ) : (
          <Initials title={title} />
        )}
      </Link>
      <div className={styles.body}>
        <h3 className={styles.cardTitle}>
          <Link to={primary.url} className={styles.titleLink}>
            {title}
          </Link>
        </h3>
        <p className={styles.studio}>{studio}</p>
        <p className={styles.blurb}>{blurb}</p>
        <div className={styles.linksRow}>
          {links.map((entry) => (
            <Link key={entry.label} to={entry.url} className={styles.platformLink}>
              {entry.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Showcase() {
  return (
    <section className={styles.showcase}>
      <div className="container">
        <div className={styles.header}>
          <h2>Made with Cocos2d-Mono</h2>
          <p>Shipped games and apps built on the engine.</p>
        </div>
        <div className={styles.grid}>
          {showcase.map((entry) => (
            <ShowcaseCard key={entry.title} {...entry} />
          ))}
        </div>
        <p className={styles.cta}>
          Built something with Cocos2d-Mono?{" "}
          <Link to="https://github.com/Cocos2D-Mono/cocos2d-mono/discussions/landing">
            Share it with us →
          </Link>
        </p>
      </div>
    </section>
  );
}
