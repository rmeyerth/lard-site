import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '02c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', 'dea'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', '712'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', '1e4'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '848'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '3aa'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '690'),
    exact: true
  },
  {
    path: '/blog',
    component: ComponentCreator('/blog', '9f4'),
    exact: true
  },
  {
    path: '/blog/archive',
    component: ComponentCreator('/blog/archive', '566'),
    exact: true
  },
  {
    path: '/blog/first-blog-post',
    component: ComponentCreator('/blog/first-blog-post', 'ceb'),
    exact: true
  },
  {
    path: '/blog/long-blog-post',
    component: ComponentCreator('/blog/long-blog-post', '9f2'),
    exact: true
  },
  {
    path: '/blog/mdx-blog-post',
    component: ComponentCreator('/blog/mdx-blog-post', 'dee'),
    exact: true
  },
  {
    path: '/blog/tags',
    component: ComponentCreator('/blog/tags', '5e5'),
    exact: true
  },
  {
    path: '/blog/tags/docusaurus',
    component: ComponentCreator('/blog/tags/docusaurus', 'e7d'),
    exact: true
  },
  {
    path: '/blog/tags/facebook',
    component: ComponentCreator('/blog/tags/facebook', '511'),
    exact: true
  },
  {
    path: '/blog/tags/hello',
    component: ComponentCreator('/blog/tags/hello', '3e8'),
    exact: true
  },
  {
    path: '/blog/tags/hola',
    component: ComponentCreator('/blog/tags/hola', '21a'),
    exact: true
  },
  {
    path: '/blog/welcome',
    component: ComponentCreator('/blog/welcome', 'a22'),
    exact: true
  },
  {
    path: '/markdown-page',
    component: ComponentCreator('/markdown-page', 'd67'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', 'b24'),
    routes: [
      {
        path: '/docs/category/examples',
        component: ComponentCreator('/docs/category/examples', 'fe3'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/category/toolkit',
        component: ComponentCreator('/docs/category/toolkit', 'd4d'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/category/tutorial',
        component: ComponentCreator('/docs/category/tutorial', '0ab'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/examples/Aardvark',
        component: ComponentCreator('/docs/examples/Aardvark', 'a7c'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/examples/slop',
        component: ComponentCreator('/docs/examples/slop', 'bd9'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/intro',
        component: ComponentCreator('/docs/intro', 'aed'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/toolkit/configuration',
        component: ComponentCreator('/docs/toolkit/configuration', '48d'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/toolkit/grammar',
        component: ComponentCreator('/docs/toolkit/grammar', 'd4f'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/toolkit/operators',
        component: ComponentCreator('/docs/toolkit/operators', 'b63'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/tutorial/a-character-study',
        component: ComponentCreator('/docs/tutorial/a-character-study', '0cc'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/tutorial/could-you-repeat-that',
        component: ComponentCreator('/docs/tutorial/could-you-repeat-that', '025'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/tutorial/getting-started',
        component: ComponentCreator('/docs/tutorial/getting-started', 'aab'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/tutorial/grammar-system',
        component: ComponentCreator('/docs/tutorial/grammar-system', '9a0'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/tutorial/in-the-beginning',
        component: ComponentCreator('/docs/tutorial/in-the-beginning', 'e51'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/tutorial/make-a-statement',
        component: ComponentCreator('/docs/tutorial/make-a-statement', '46c'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/tutorial/modus-operandi',
        component: ComponentCreator('/docs/tutorial/modus-operandi', '2a2'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/tutorial/point-of-decimals',
        component: ComponentCreator('/docs/tutorial/point-of-decimals', '8e4'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/tutorial/speaking-literally',
        component: ComponentCreator('/docs/tutorial/speaking-literally', '288'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/tutorial/to-be-or-not-to-be',
        component: ComponentCreator('/docs/tutorial/to-be-or-not-to-be', 'c50'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/tutorial/type-operations',
        component: ComponentCreator('/docs/tutorial/type-operations', '134'),
        exact: true,
        sidebar: "tutorialSidebar"
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', '8b0'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
