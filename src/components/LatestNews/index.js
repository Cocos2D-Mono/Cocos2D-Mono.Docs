import React from "react";
import Link from "@docusaurus/Link";
import { usePluginData } from "@docusaurus/useGlobalData";
import styles from "./styles.module.css";

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function LatestNews() {
  const { posts = [] } = usePluginData("recent-blog-posts") ?? {};
  if (posts.length === 0) {
    return null;
  }
  return (
    <section className={styles.news}>
      <div className="container">
        <div className={styles.header}>
          <h2>Latest News</h2>
          <Link to="/blog">View all news →</Link>
        </div>
        <div className={styles.grid}>
          {posts.map((post) => (
            <Link key={post.permalink} to={post.permalink} className={styles.card}>
              <p className={styles.date}>{formatDate(post.date)}</p>
              <h3 className={styles.title}>{post.title}</h3>
              {post.description && <p className={styles.excerpt}>{post.description}</p>}
              <span className={styles.readMore}>Read more →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
