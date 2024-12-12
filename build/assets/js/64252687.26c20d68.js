"use strict";(self.webpackChunklarf_site=self.webpackChunklarf_site||[]).push([[2261],{5680:(e,t,n)=>{n.d(t,{xA:()=>p,yg:()=>h});var o=n(6540);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?s(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,o,r=function(e,t){if(null==e)return{};var n,o,r={},s=Object.keys(e);for(o=0;o<s.length;o++)n=s[o],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(o=0;o<s.length;o++)n=s[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var c=o.createContext({}),l=function(e){var t=o.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},p=function(e){var t=l(e.components);return o.createElement(c.Provider,{value:t},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},g=o.forwardRef((function(e,t){var n=e.components,r=e.mdxType,s=e.originalType,c=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),u=l(n),g=r,h=u["".concat(c,".").concat(g)]||u[g]||d[g]||s;return n?o.createElement(h,a(a({ref:t},p),{},{components:n})):o.createElement(h,a({ref:t},p))}));function h(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var s=n.length,a=new Array(s);a[0]=g;var i={};for(var c in t)hasOwnProperty.call(t,c)&&(i[c]=t[c]);i.originalType=e,i[u]="string"==typeof e?e:r,a[1]=i;for(var l=2;l<s;l++)a[l]=n[l];return o.createElement.apply(null,a)}return o.createElement.apply(null,n)}g.displayName="MDXCreateElement"},7275:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>a,default:()=>d,frontMatter:()=>s,metadata:()=>i,toc:()=>l});var o=n(8168),r=(n(6540),n(5680));const s={sidebar_position:6},a="Processor",i={unversionedId:"toolkit/processor",id:"toolkit/processor",title:"Processor",description:"Processor",source:"@site/docs/toolkit/processor.md",sourceDirName:"toolkit",slug:"/toolkit/processor",permalink:"/docs/toolkit/processor",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/toolkit/processor.md",tags:[],version:"current",sidebarPosition:6,frontMatter:{sidebar_position:6},sidebar:"tutorialSidebar",previous:{title:"Prefix, Infix and Postfix",permalink:"/docs/toolkit/parser/prefix-infix-postfix"},next:{title:"System Functions",permalink:"/docs/toolkit/system-functions"}},c={},l=[{value:"File Handling",id:"file-handling",level:3}],p={toc:l},u="wrapper";function d(e){let{components:t,...s}=e;return(0,r.yg)(u,(0,o.A)({},p,s,{components:t,mdxType:"MDXLayout"}),(0,r.yg)("h1",{id:"processor"},"Processor"),(0,r.yg)("p",null,(0,r.yg)("img",{alt:"Processor",src:n(5816).A,width:"1462",height:"298"}),"\nThe processor class is primary class you'll be dealing with when executing code in your own language. By using the\noverloaded constructors, it provides the ability to override any of the default components found within LARF if\nyou so choose. "),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-java"},"public LARFProcessor(LARFConfig config, Lexer<?> grammarLexer, Lexer<?> languageLexer, \n                     Parser languageParser) { ... }\n\npublic LARFProcessor(LARFConfig config, LARFContext context) { ... }\n\npublic LARFProcessor(LARFConfig config) { ... }\n")),(0,r.yg)("p",null,"Like many other class implementations within LARF it hasn't been sealed, which means you can extend and implement\nyour own custom constructors if necessary. Let's look at a basic example:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-java"},"class MyLanguage {\n    private final LARFProcessor processor;\n\n    public MyLanguage() {\n        LARFConfig config = new SLOPConfig();\n        config.setProperty(DefaultProperty.SAFE_OPERATIONS, false);\n        processor = new LARFProcessor(config);\n    }\n\n    public <T> T processResult(String code, Class<T> clazz) {\n        return processor.process(code).getValue(clazz);\n    }\n}\n")),(0,r.yg)("p",null,"In the above case we're setting up some basic properties in our language and initialising the processor with the\nconfig object. We can then define a method to run the code against our language using the ",(0,r.yg)("inlineCode",{parentName:"p"},"processor.process(...)"),"\nmethod and cast it to the expected result class using ",(0,r.yg)("inlineCode",{parentName:"p"},".getValue(Class<?>)"),". There are some overloaded variants\nof this method which are the following:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-java"},"public ExpressionResult<?> process(String expression, LARFContext context) { ... }\n\npublic ExpressionResult<?> process(String expression, Object... contextObjects) { ... }\n\npublic ExpressionResult<?> process(List<String> expressions) { ... }\n")),(0,r.yg)("p",null,"The first of these passes a context object that can contain one or more objects that can be referenced within the\ncode. The context can be passed in the constructor when creating the processor, but this adds some flexibility if\nthis context is likely to change between subsequent calls. If you'd like to know more about the context, please\nsee the ",(0,r.yg)("a",{parentName:"p",href:"/docs/toolkit/context"},"context")," section. The next omits the context object and passes any objects referenced within\nthe code directly in. For example, if I had a Java object and my language had support for referencing those objects\nwithin the language, we could do the following:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-java"},"public <T> T processResult(String code, Class<T> clazz, Employee...employees) {\n    LARFContext context = new LARFContext();\n    context.addAll(List.of(employees));\n    return processor.process(code).getValue(clazz);\n}\n")),(0,r.yg)("p",null,"The final method is one which can be used with separate, but related, code expressions. Results and context can be\npassed between them, but this has mostly been superceded by multi-line support which was added some time ago."),(0,r.yg)("h3",{id:"file-handling"},"File Handling"),(0,r.yg)("p",null,"Having the ability to save code in source files is a mainstay of most languages. As such, LARF has several methods\nto support this:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-java"},"public void tokenizeToFile(String sourcePath, String compiledPath) { ... }\n\npublic ExpressionResult<?> processFromFile(String filePath, LARFContext context) { ... }\n")),(0,r.yg)("p",null,"The ",(0,r.yg)("inlineCode",{parentName:"p"},"tokenizeToFile")," method takes two arguments which is the path to the source file, and the path to the intended\noutput file for the compiled version. The file types are completely open to please feel free to define your own\nextensions associated with your project. This can then be used in conjunction with the ",(0,r.yg)("inlineCode",{parentName:"p"},"processFromFile")," method\nand accepts a path to the compiled file and a context object."))}d.isMDXComponent=!0},5816:(e,t,n)=>{n.d(t,{A:()=>o});const o=n.p+"assets/images/processor-18744407c32cd2dd11f2297b1dc53056.jpg"}}]);