import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Create Languages Fast',
    Svg: require('@site/static/img/rocket-312767.svg').default,
    description: (
      <>
        Create your project, import the dependency and define your language.
        Still too slow? Sample starter projects allow you to get a running start.
      </>
    ),
  },
  {
    title: 'Building Blocks',
    Svg: require('@site/static/img/Jigsaw-Puzzle.svg').default,
    description: (
      <>
        LARF uses an object orientated approach to language development. All literal,
        operation or statement logic is contained within a single class.
      </>
    ),
  },
  {
    title: 'Flexible Framework',
    Svg: require('@site/static/img/Andy_Tools_Hammer_Spanner.svg').default,
    description: (
      <>
        It is completely customisable with the ability to override any property and
        component. Don't like the default parser? Write your own!
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
        <p className="featureText">{description}</p>
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
