import React from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <img className="myLogo" style={{width: '30%', height: '30%'}} src={'img/icon.svg'} />
      </div>
    </header>
  );
}

export default function Home() {
  return (
    <Layout
      title={`Language Architect and Runtime Development`}
      description="Create a programming language">
      <HomepageHeader />
      <div className="quote"><span style={{color: "cadetblue"}}>sys</span>:print(<span style={{color: "lightgreen"}}>'Discover the secret to turn your programming language dreams into a reality'</span>)</div>
      <div className="container">
        <HomepageFeatures />
      </div>
    </Layout>
  );
}
