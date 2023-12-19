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
        <img className="myLogo" style={{width: 380, height: 330}} src={'img/icon.svg'} />
        <div className="testHeader"><img style={{paddingLeft: 5, width: 70, height: 25, float: "left"}} src={'img/buttons.png'} />Language Architect and Runtime Framework</div>
        <div className="terminal">
            <div><span>Your Language Runner</span></div>
            <div><span>====================</span></div>
            <div>&gt; <span style={{color: "cadetblue"}}>sys</span>:print(<span style={{color: "lightgreen"}}>'Discover the secret to turn your programming language dreams into a reality'</span>)</div>
        </div>
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
      <div className="container">
        <HomepageFeatures />
      </div>
    </Layout>
  );
}
