"use strict";(self.webpackChunklarf_site=self.webpackChunklarf_site||[]).push([[3976],{5680:(e,t,n)=>{n.d(t,{xA:()=>c,yg:()=>m});var a=n(6540);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=a.createContext({}),u=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},c=function(e){var t=u(e.components);return a.createElement(l.Provider,{value:t},e.children)},d="mdxType",p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},g=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,l=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),d=u(n),g=r,m=d["".concat(l,".").concat(g)]||d[g]||p[g]||o;return n?a.createElement(m,i(i({ref:t},c),{},{components:n})):a.createElement(m,i({ref:t},c))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=g;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[d]="string"==typeof e?e:r,i[1]=s;for(var u=2;u<o;u++)i[u]=n[u];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}g.displayName="MDXCreateElement"},5436:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>p,frontMatter:()=>o,metadata:()=>s,toc:()=>u});var a=n(8168),r=(n(6540),n(5680));const o={sidebar_position:1},i="Introduction",s={unversionedId:"intro",id:"intro",title:"Introduction",description:"Introduction",source:"@site/docs/intro.md",sourceDirName:".",slug:"/intro",permalink:"/docs/intro",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/intro.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",next:{title:"Configuration",permalink:"/docs/toolkit/configuration"}},l={},u=[{value:"Why should you use it?",id:"why-should-you-use-it",level:2}],c={toc:u},d="wrapper";function p(e){let{components:t,...o}=e;return(0,r.yg)(d,(0,a.A)({},c,o,{components:t,mdxType:"MDXLayout"}),(0,r.yg)("h1",{id:"introduction"},"Introduction"),(0,r.yg)("p",null,(0,r.yg)("img",{alt:"Introduction",src:n(6190).A,width:"2650",height:"630"}),"\nLARF is a tool that makes it easy to create interpreted programming languages. It does this by providing a high-level\nAPI that allows you to focus on the building blocks of your language, called tokens. Tokens are matched from expressions\nand represent operators, literals and statements. You can also customize other aspects of your language, such as its\ncore functions, expression notations, and precedence rules. This means that you can create a language that is tailored\nto your specific needs without having to worry about the low-level details of lexing and parsing."),(0,r.yg)("p",null,"The default library gives you a clean slate to create your language from scratch. There are however several starter\nprojects and a tutorial to guide you through everything from defining literals and operations all the way up to custom\ntypes. LARF can handle both typed and typeless languages, so let your imagination run wild and create that language\nyou've always dreamed of."),(0,r.yg)("h2",{id:"why-should-you-use-it"},"Why should you use it?"),(0,r.yg)("p",null,"Writing programming languages is difficult because it requires a deep understanding of computer science concepts,\nsuch as logic, data structures, and algorithms. It also requires a strong understanding of the syntax and semantics of\nthe programming language being created. In addition, writing a programming language takes a long time because it is a\ncomplex process that involves many different steps. These steps include:"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},"Defining the language's grammar and syntax"),(0,r.yg)("li",{parentName:"ul"},"Designing the language's data types and operators"),(0,r.yg)("li",{parentName:"ul"},"Implementing the language's runtime system"),(0,r.yg)("li",{parentName:"ul"},"Writing the language's standard library"),(0,r.yg)("li",{parentName:"ul"},"Testing the language's correctness and performance"),(0,r.yg)("li",{parentName:"ul"},"Documenting the language's features and usage")),(0,r.yg)("p",null,"Even after all of these steps have been completed, the language may still need to be improved or updated over time.\nThis is because new features are constantly being developed, and the language needs to be able to adapt as new ideas\nare introduced. This is where LARF can help as it is built around the concept of adaptability and change. LARF\nprovides the following:"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},"Simple to learn and use: The LARF API is well-documented and easy to understand. Even if you have no prior experience\nwith language development, you should be able to get up and running quickly."),(0,r.yg)("li",{parentName:"ul"},"Large number of features: Aside from the ability to customise nearly every aspect of LARF, the framework provides\na lot of features included in the basic package. These include support for whitespace (inferred or fixed), expression\nnotation customisation (infix, prefix and postfix), custom operators, typed / types languages, error handling and much more."),(0,r.yg)("li",{parentName:"ul"},"Fast development time: LARF takes care of the low-level details of lexing and parsing so that you can focus on the\nmore important aspects of language development, such as syntax and semantics. This can save you a lot of time and effort."),(0,r.yg)("li",{parentName:"ul"},"Powered by Java: LARF is written in Java, which is a multi-platform, secure, and a well-supported programming language.\nThis means that your language will be able to run on a wide range of platforms, including Windows, macOS, and Linux and\nmake use of a large number of underlying frameworks to enhance your language."),(0,r.yg)("li",{parentName:"ul"},"Open source: LARF is open source meaning that it is free to use and modify. This can be a valuable benefit should you\nwish to customize LARF to meet your specific needs."),(0,r.yg)("li",{parentName:"ul"},"Actively maintained: LARF has been two years in the making, is actively maintained and has a lot of planned features\nin the pipeline. You can be confident that LARF will continue to be supported and updated. If you do spot any issues,\nplease do send an email or raise them on gitlab and these will be fixed ASAP.")))}p.isMDXComponent=!0},6190:(e,t,n)=>{n.d(t,{A:()=>a});const a=n.p+"assets/images/sun-3d75d9e1c271c92028acfaf0c1281e47.jpg"}}]);