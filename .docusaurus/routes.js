import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', 'e1b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', 'e3a'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', '92e'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', '5a5'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '498'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '306'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '8f5'),
    exact: true
  },
  {
    path: '/blog',
    component: ComponentCreator('/blog', '7f0'),
    exact: true
  },
  {
    path: '/blog/archive',
    component: ComponentCreator('/blog/archive', '3ba'),
    exact: true
  },
  {
    path: '/blog/first-blog-post',
    component: ComponentCreator('/blog/first-blog-post', '887'),
    exact: true
  },
  {
    path: '/blog/long-blog-post',
    component: ComponentCreator('/blog/long-blog-post', 'c06'),
    exact: true
  },
  {
    path: '/blog/mdx-blog-post',
    component: ComponentCreator('/blog/mdx-blog-post', '0b1'),
    exact: true
  },
  {
    path: '/blog/tags',
    component: ComponentCreator('/blog/tags', '32f'),
    exact: true
  },
  {
    path: '/blog/tags/docusaurus',
    component: ComponentCreator('/blog/tags/docusaurus', '2a2'),
    exact: true
  },
  {
    path: '/blog/tags/facebook',
    component: ComponentCreator('/blog/tags/facebook', '2ec'),
    exact: true
  },
  {
    path: '/blog/tags/hello',
    component: ComponentCreator('/blog/tags/hello', '1fe'),
    exact: true
  },
  {
    path: '/blog/tags/hola',
    component: ComponentCreator('/blog/tags/hola', '6a8'),
    exact: true
  },
  {
    path: '/blog/welcome',
    component: ComponentCreator('/blog/welcome', '775'),
    exact: true
  },
  {
    path: '/markdown-page',
    component: ComponentCreator('/markdown-page', 'be3'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', 'f7a'),
    routes: [
      {
        path: '/docs/category/examples',
        component: ComponentCreator('/docs/category/examples', 'fe3'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/category/parser',
        component: ComponentCreator('/docs/category/parser', '4f1'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/category/tokens',
        component: ComponentCreator('/docs/category/tokens', '0b6'),
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
        path: '/docs/examples/aardvark',
        component: ComponentCreator('/docs/examples/aardvark', 'a15'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/examples/mal',
        component: ComponentCreator('/docs/examples/mal', '28b'),
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
        path: '/docs/toolkit/context',
        component: ComponentCreator('/docs/toolkit/context', '991'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/toolkit/error-handling',
        component: ComponentCreator('/docs/toolkit/error-handling', 'f95'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/toolkit/functions',
        component: ComponentCreator('/docs/toolkit/functions', '0a9'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/toolkit/lexer',
        component: ComponentCreator('/docs/toolkit/lexer', '921'),
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
        path: '/docs/toolkit/parser/overview',
        component: ComponentCreator('/docs/toolkit/parser/overview', 'ab0'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/toolkit/parser/parser-flags',
        component: ComponentCreator('/docs/toolkit/parser/parser-flags', 'c56'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/toolkit/parser/prefix-infix-postfix',
        component: ComponentCreator('/docs/toolkit/parser/prefix-infix-postfix', '5dd'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/toolkit/processor',
        component: ComponentCreator('/docs/toolkit/processor', '0de'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/toolkit/runner',
        component: ComponentCreator('/docs/toolkit/runner', 'ed0'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/toolkit/tokens/callbacks',
        component: ComponentCreator('/docs/toolkit/tokens/callbacks', 'f69'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/toolkit/tokens/grammar',
        component: ComponentCreator('/docs/toolkit/tokens/grammar', '470'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/toolkit/tokens/instances',
        component: ComponentCreator('/docs/toolkit/tokens/instances', '781'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/toolkit/tokens/token-class',
        component: ComponentCreator('/docs/toolkit/tokens/token-class', '1cc'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/toolkit/type-operations',
        component: ComponentCreator('/docs/toolkit/type-operations', '0aa'),
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
    component: ComponentCreator('/', 'a62'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
