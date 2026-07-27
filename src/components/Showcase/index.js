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

function ShowcaseCard({ title, studio, blurb, link, image }) {
  const imageUrl = useBaseUrl(image ?? "");
  return (
    <Link to={link} className={styles.card}>
      <div className={styles.media}>
        {image ? (
          <img src={imageUrl} alt={`${title} key art`} loading="lazy" />
        ) : (
          <Initials title={title} />
        )}
      </div>
      <div className={styles.body}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.studio}>{studio}</p>
        <p className={styles.blurb}>{blurb}</p>
      </div>
    </Link>
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
