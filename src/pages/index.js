import React from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Link from '@docusaurus/Link';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">

      {/* Main Tagline */}
      <div
        style={{
          fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          marginTop: 0,
          paddingTop: 0,
          fontSize: "1.75rem",
          fontWeight: 600,
          color: "#4cc2ff",
          letterSpacing: "0.5px",
          margin: "20px 0 5px 0"
        }}
      >
        Your shortcut to writing languages: fast, flexible, fully yours.
      </div>

      {/* Sub‑Tagline */}
      <div
        style={{
          fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          fontSize: "1.15rem",
          fontWeight: 400,
          color: "#a8e6ff",
          marginBottom: "30px",   // increased spacing by ~8px
          opacity: 0.9
        }}
      >
        Define tokens, configure, and ship your own language in record time.
      </div>

      {/* CTA Buttons */}
      <div
        style={{
          marginBottom: "35px",
          display: "flex",
          gap: "14px",
          alignItems: "center",   // <-- This fixes the misalignment
          justifyContent: "center" 
        }}
      >

        <Link to="/docs/tutorial/getting-started" className={styles.buttonPrimary}>
          Get Started
        </Link>

        <Link to="/docs/intro" className={styles.buttonSecondary}>
          View Docs
        </Link>

      </div>

        {/* Terminal + Layout */}
        <div className="myContainer">
          <div className="invisibleBox"></div>
          <div>
            <div className="testHeader">
              <img
                style={{ paddingLeft: 5, width: 70, height: 25, float: "left" }}
                src={'img/buttons.png'}
              />
              &nbsp;&nbsp;
              <img
                style={{ paddingTop: 5, width: 15, height: 20 }}
                src={'img/icon.svg'}
              />
              &nbsp;Language Architect and Runtime Framework - DSL++
            </div>

            <div className="terminal">
              <div style={{ maxHeight: "360px", overflowY: "auto" }}>
                <div><span style={{color:"yellow"}}>DSL++ Test Utility</span></div>
                <div>==============================================================================================================<span style={{color:"black"}}>=</span></div>
                <div>Author: <span style={{color:"grey"}}>John Smith</span>, Version: <span style={{color:"grey"}}>1.1</span></div>
                <div>Description: <span style={{color:"grey"}}>Named as such because all languages are better with pluses</span></div>
                <div>==============================================================================================================<span style={{color:"black"}}>=</span></div>
                <div>[<span style={{color:"#4EA3FF"}}>Multi-line enabled</span>] Please add &lt;newline&gt; + '.' + &lt;return&gt; to the end of finished code to evaluate the result.</div>                      
                <div>&nbsp;</div>
                <div><span style={{color:"cadetblue"}}>type</span> Customer(name, loyaltyDiscount) &#123; ... &#125;</div>
                <div><span style={{color:"cadetblue"}}>type</span> OrderBase(customer, items) &#123; ... &#125;</div>
                <div><span style={{color:"cadetblue"}}>type</span> Product(name, price) &#123; ... &#125;</div>
                <div>&nbsp;</div>

                <div><span style={{color:"cadetblue"}}>type</span> OnlineOrder(customer, items, shippingCost) &lt;- OrderBase &#123;</div>

                <div>&nbsp;&nbsp;<span style={{color:"cadetblue"}}>func</span> calculateTotal() &#123;</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;<span style={{color:"#6A8759"}}>// Calculate subtotal and apply loyalty discount</span></div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;subtotal = calculateSubtotal();</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;loyaltyMultiplier = customer.getLoyaltyMultiplier();</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;<span style={{color:"cadetblue"}}>return</span> (subtotal * loyaltyMultiplier) + shippingCost;</div>
                <div>&nbsp;&nbsp;&#125;</div>

                <div>&nbsp;&nbsp;<span style={{color:"cadetblue"}}>func</span> summary() &#123;</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;<span style={{color:"#6A8759"}}>// Build order summary</span></div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;<span style={{color:"cadetblue"}}>return</span> <span style={{color:"lightgreen"}}>'Order for '</span> + customer.name +</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{color:"lightgreen"}}>' | Items: '</span> + items.length +</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{color:"lightgreen"}}>' | Total: '</span> + calculateTotal();</div>
                <div>&nbsp;&nbsp;&#125;</div>

                <div>&#125;</div>
                <div>&nbsp;</div>

                <div><span style={{color:"#6A8759"}}>// Create some products</span></div>
                <div>apple = <span style={{color:"cadetblue"}}>new</span> Product(<span style={{color:"lightgreen"}}>'Apple'</span>, <span style={{color:"lightcoral"}}>0.50</span>);</div>
                <div>coffee = <span style={{color:"cadetblue"}}>new</span> DiscountedProduct(<span style={{color:"lightgreen"}}>'Coffee Beans'</span>, <span style={{color:"lightcoral"}}>12.00</span>, <span style={{color:"lightcoral"}}>10</span>);</div>
                <div>bread = <span style={{color:"cadetblue"}}>new</span> Product(<span style={{color:"lightgreen"}}>'Sourdough Bread'</span>, <span style={{color:"lightcoral"}}>3.20</span>);</div>

                <div>&nbsp;</div>

                <div><span style={{color:"#6A8759"}}>// Create a customer and place an order</span></div>
                <div>customer = <span style={{color:"cadetblue"}}>new</span> Customer(<span style={{color:"lightgreen"}}>'Alice Johnson'</span>, <span style={{color:"lightcoral"}}>140</span>);</div>
                <div>order = <span style={{color:"cadetblue"}}>new</span> OnlineOrder(customer, [apple, coffee, bread], <span style={{color:"lightcoral"}}>2.99</span>);</div>

                <div>&nbsp;</div>

                <div><span style={{color:"cadetblue"}}>return</span> order.summary();</div>
                <div>.</div>                      
                <div>&gt; Result: Order for Alice Johnson | Items: 3 | Total: 16.77 (Type: String, Time taken: 24ms)</div>
              </div>
            </div>
          </div>
          <div className="invisibleBox"></div>
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
