import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

const FeatureList = [
  {
    title: "Modern C#",
    Svg: require("@site/static/img/c-logo.svg").default,
    description: (
      <>
        Write your game in modern C# on .NET — full access to the .NET
        ecosystem, first-class tooling, and a familiar scene/node/action API
        that stays out of your way.
      </>
    ),
  },
  {
    title: "One Package, Every Platform",
    Svg: require("@site/static/img/cocos2d-mono-small-logo.svg").default,
    description: (
      <>
        A single NuGet reference multi-targets DesktopGL (Windows, Linux,
        macOS), WindowsDX, Android, and iOS — the right build for your project
        is selected automatically.
      </>
    ),
  },
  {
    title: "Powered by MonoGame",
    Svg: require("@site/static/img/monogame-logo.svg").default,
    description: (
      <>
        Built on the battle-tested MonoGame framework, with shipped titles on
        Steam and the mobile stores to prove it — open source, free, and
        actively modernized.
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
