import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Create Languages Fast',
    Svg: require('@site/static/img/rocket-312767.svg').default,
    description: (
      <>
        Create your project, import the dependency and start defining your language!
        Still too slow? Starter projects allow you to hit the floor running.
      </>
    ),
  },
  {
    title: 'Building Blocks',
    Svg: require('@site/static/img/Jigsaw-Puzzle.svg').default,
    description: (
      <>
        All logic for your languages including literals, operations and statements
        are contained within a single class providing easy maintenance and expansion.
      </>
    ),
  },
  {
    title: 'Flexible Framework',
    Svg: require('@site/static/img/Andy_Tools_Hammer_Spanner.svg').default,
    description: (
      <>
        LARF has been built from the ground up to expand. Don't find the built-in parser
        offers what you need? Override part or write your own
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
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
