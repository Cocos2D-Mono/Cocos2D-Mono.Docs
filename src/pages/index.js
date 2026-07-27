import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import Showcase from "@site/src/components/Showcase";
import LatestNews from "@site/src/components/LatestNews";

import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">
          <img src={useBaseUrl("img/logo-text.svg")} alt="Cocos2d-Mono" />
        </h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <p className={styles.heroTagline}>
          A free, open-source C# game engine built on MonoGame — one package,
          every platform.
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/guides/getting-started/introduction"
          >
            Get Started
          </Link>
          <Link
            className={clsx("button button--outline button--lg", styles.buttonGitHub)}
            to="https://github.com/Cocos2D-Mono/cocos2d-mono"
          >
            View on GitHub
          </Link>
        </div>
      </div>
    </header>
  );
}

const ctaCards = [
  {
    title: "Guides",
    description: "Install the engine, create a project, and learn the ropes.",
    to: "/docs/guides/getting-started/introduction",
  },
  {
    title: "Tutorials",
    description: "Build a complete platformer, step by step.",
    to: "/docs/tutorials/introduction",
  },
  {
    title: "Samples",
    description: "Working example projects for every major engine system.",
    to: "https://github.com/Cocos2D-Mono/cocos2d-mono-samples",
  },
  {
    title: "Project Templates",
    description: "Visual Studio templates to start a new game in minutes.",
    to: "https://marketplace.visualstudio.com/items?itemName=Cocos2D-MonoTeamBrokenWallsStudios.cocos2dmonoprojecttemplates",
  },
];

function CtaSection() {
  return (
    <section className={styles.ctaSection}>
      <div className="container">
        <div className={styles.ctaGrid}>
          {ctaCards.map((card) => (
            <Link key={card.title} to={card.to} className={styles.ctaCard}>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Cocos2d-Mono is a free, open-source C# game engine built on MonoGame. One NuGet package targets Windows, Linux, macOS, Android, and iOS."
    >
      <HomepageHeader />
      <main>
        <LatestNews />
        <CtaSection />
        <HomepageFeatures />
        <Showcase />
      </main>
    </Layout>
  );
}
