"use strict";(self.webpackChunklarf_site=self.webpackChunklarf_site||[]).push([[8227],{5680:(e,t,n)=>{n.d(t,{xA:()=>p,yg:()=>y});var a=n(6540);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=a.createContext({}),d=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},p=function(e){var t=d(e.components);return a.createElement(s.Provider,{value:t},e.children)},u="mdxType",g={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},c=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,s=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),u=d(n),c=r,y=u["".concat(s,".").concat(c)]||u[c]||g[c]||o;return n?a.createElement(y,i(i({ref:t},p),{},{components:n})):a.createElement(y,i({ref:t},p))}));function y(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=c;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[u]="string"==typeof e?e:r,i[1]=l;for(var d=2;d<o;d++)i[d]=n[d];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}c.displayName="MDXCreateElement"},257:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>i,default:()=>g,frontMatter:()=>o,metadata:()=>l,toc:()=>d});var a=n(8168),r=(n(6540),n(5680));const o={sidebar_position:1},i="Configuration",l={unversionedId:"toolkit/configuration",id:"toolkit/configuration",title:"Configuration",description:"Configuration",source:"@site/docs/toolkit/configuration.md",sourceDirName:"toolkit",slug:"/toolkit/configuration",permalink:"/docs/toolkit/configuration",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/toolkit/configuration.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Introduction",permalink:"/docs/intro"},next:{title:"Token Overview",permalink:"/docs/toolkit/tokens/token-overview"}},s={},d=[{value:"Overview",id:"overview",level:3},{value:"Common Properties",id:"common-properties",level:3}],p={toc:d},u="wrapper";function g(e){let{components:t,...o}=e;return(0,r.yg)(u,(0,a.A)({},p,o,{components:t,mdxType:"MDXLayout"}),(0,r.yg)("h1",{id:"configuration"},"Configuration"),(0,r.yg)("p",null,(0,r.yg)("img",{alt:"Configuration",src:n(508).A,width:"1981",height:"469"})),(0,r.yg)("h3",{id:"overview"},"Overview"),(0,r.yg)("p",null,"At the basic level, the configuration class is used to define which tokens are to be used in your language.\nWhen you first create the class and extend the ",(0,r.yg)("inlineCode",{parentName:"p"},"LARFConfig")," class, several methods are required to be\nimplemented:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-java"},'public class MyLanguageConfig extends LARFConfig {\n\n    public IndentConfig() {\n        super("My Language", 0.5);\n    }\n\n    @Override\n    protected void initFunctions() { }\n\n    @Override\n    protected void initTokenHandlers() { }\n\n    @Override\n    public Optional<TokenModifier> getDefaultModifier() {\n        return Optional.empty();\n    }\n\n    @Override\n    protected TypeOperation initTypeOperations() { return null; }\n\n    @Override\n    protected void initOperators() { }\n\n    @Override\n    protected void initParserFormatters() { }\n\n    @Override\n    protected void initErrorHandlers() { }\n}\n')),(0,r.yg)("p",null,"Firstly, a call to the superclass constructor method can be used to set the name and version of the\nlanguage. This is used so that when code is loaded, a check is made to ensure that versions support\nbackwards compatibility, but will throw an error if the language is not correct or that the version\ncontained in the file is greater than the version running. This ensures that issues don't occur with\nmissing tokens. The same checks are implemented on most languages. In Java this looks like the following:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre"},"java.lang.UnsupportedClassVersionError: Unsupported major.minor version 51.0\n    at java.lang.ClassLoader.defineClass1(Native Method)\n    at java.lang.ClassLoader.defineClassCond(Unknown Source)\n")),(0,r.yg)("p",null,"The constructor can also be used to set properties which affect how your language operates. The other\nmethods are used for the following:"),(0,r.yg)("ol",null,(0,r.yg)("li",{parentName:"ol"},(0,r.yg)("inlineCode",{parentName:"li"},"initFunctions"),": Used to define any system functions to provide functionality from the underlying\nlanguage (Java). For an example, please see the ",(0,r.yg)("a",{parentName:"li",href:"/docs/toolkit/system-functions"},"System Functions"),"\nsection for more details."),(0,r.yg)("li",{parentName:"ol"},(0,r.yg)("inlineCode",{parentName:"li"},"initTokenHandlers"),": Used to define all literals and statement tokens. Your tokens may require an\nargument for the value when creating a new instance e.g. ",(0,r.yg)("inlineCode",{parentName:"li"},"addTokenHandler(new MyToken(null))"),", but\npassing null in this instance is fine as it is used for pattern matching and the creation of new\ninstances once a match is made. See ",(0,r.yg)("a",{parentName:"li",href:"/docs/toolkit/tokens/token-overview"},"Token Class"),"."),(0,r.yg)("li",{parentName:"ol"},(0,r.yg)("inlineCode",{parentName:"li"},"getDefaultModifier"),": If a variable or object is defined without using a modifier, this method\ndetermines which modifier will be used to enforce encapsulation rules. If none is specified (Optional.empty),\nthen the default will be to lock down access to only be accessible from within the object it resides i.e.\nprivate."),(0,r.yg)("li",{parentName:"ol"},(0,r.yg)("inlineCode",{parentName:"li"},"initTypeOperations"),": This is used to define type operations that handle interactions between\ntokens and operators. The method requires that a token handler be returned which is used as a default\nhandler for basic operations. For example, you might define a simple equals / not equals handler for\nthe any token values. Please see the ",(0,r.yg)("a",{parentName:"li",href:"/docs/toolkit/type-operations"},"Type Operations")," for more details."),(0,r.yg)("li",{parentName:"ol"},(0,r.yg)("inlineCode",{parentName:"li"},"initOperators"),": Defines operators using either one of the inbuilt templates or a custom set (see\n",(0,r.yg)("a",{parentName:"li",href:"/docs/toolkit/operators"},"Operators"),")"),(0,r.yg)("li",{parentName:"ol"},(0,r.yg)("inlineCode",{parentName:"li"},"initParserFormatters"),": Data structures like collections and maps may store their contents using\ntokens depending on their implementation. Formatters are used to map their token structure used in the\nParser back to their Java equivalents if required. Please see ",(0,r.yg)("a",{parentName:"li",href:"/docs/toolkit/parser/formatters"},"Formatters"),"."),(0,r.yg)("li",{parentName:"ol"},(0,r.yg)("inlineCode",{parentName:"li"},"initErrorHandlers"),": Allows handlers to be defined for in-language errors. This could be as simple\nas checked / unchecked or handling thrown Java exceptions for null or Arithmetic events.\nSee ",(0,r.yg)("a",{parentName:"li",href:"/docs/toolkit/error-handling"},"Error Handling")," for more details.")),(0,r.yg)("h3",{id:"common-properties"},"Common Properties"),(0,r.yg)("p",null,"Properties can change how your language operates and behaves. Properties can be set either on the\nconfiguration object itself e.g. ",(0,r.yg)("inlineCode",{parentName:"p"},"myLanguageConfig.setProperty(DefaultProperty.DEBUG_MODE, true);")," or within the\nconstructor:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-java"},'public class MyLanguageConfig extends LARFConfig {\n\n    public IndentConfig() {\n        super("My Language", 0.5);\n        setProperty(DefaultProperty.DEBUG_MODE, true);\n    }\n\n    //...\n}\n')),(0,r.yg)("p",null,"Common properties can be found in the DefaultProperty enum class and are listed below:"),(0,r.yg)("table",null,(0,r.yg)("thead",{parentName:"table"},(0,r.yg)("tr",{parentName:"thead"},(0,r.yg)("th",{parentName:"tr",align:null},"Value"),(0,r.yg)("th",{parentName:"tr",align:null},"Type"),(0,r.yg)("th",{parentName:"tr",align:null},"Description"))),(0,r.yg)("tbody",{parentName:"table"},(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"DATE_FORMAT"),(0,r.yg)("td",{parentName:"tr",align:null},"String"),(0,r.yg)("td",{parentName:"tr",align:null},"This default date pattern used by the in-built DATE function e.g. ",(0,r.yg)("inlineCode",{parentName:"td"},'setProperty(DefaultProperty.DATE_FORMAT, "dd-MM-yyyy")')," would support specifying ",(0,r.yg)("inlineCode",{parentName:"td"},"DATE(23-05-1999)"),". A second argument can be provided to the date function with a custom pattern.")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"DEBUG_MODE"),(0,r.yg)("td",{parentName:"tr",align:null},"Boolean"),(0,r.yg)("td",{parentName:"tr",align:null},"This enabled in-depth logging of all parser and token operations e.g. ",(0,r.yg)("inlineCode",{parentName:"td"},"setProperty(DefaultProperty.DEBUG_MODE, true)"),". This is useful when debugging your own tokens / statements.")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"SAFE_OPERATIONS"),(0,r.yg)("td",{parentName:"tr",align:null},"Boolean"),(0,r.yg)("td",{parentName:"tr",align:null},"This can be used as a flag in your language to enable / disable certain features. For example, if you defined a Token that used reflection to import Java objects into your language, you may want to restrict method invocations to avoid unwanted code being run (code injection attacks if running on a server).")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"STRICT_SYNTAX"),(0,r.yg)("td",{parentName:"tr",align:null},"Boolean"),(0,r.yg)("td",{parentName:"tr",align:null},"It is strongly recommended to keep this setting enabled along with using the ",(0,r.yg)("a",{parentName:"td",href:"/docs/toolkit/tokens/references"},"Reference Token"),". Without this the lexer will allow unknown values to be accepted which could cause unxepected results.")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"NOTATION_TYPE"),(0,r.yg)("td",{parentName:"tr",align:null},"ExpressionNotationType"),(0,r.yg)("td",{parentName:"tr",align:null},"This determines the order in which operators and values are evaluated. There are three types which are ",(0,r.yg)("a",{parentName:"td",href:"/docs/toolkit/parser/prefix-infix-postfix"},"PREFIX, INFIX and POSTFIX"),".")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"CODE_BLOCK_STYLE"),(0,r.yg)("td",{parentName:"tr",align:null},"CodeBlockStyle"),(0,r.yg)("td",{parentName:"tr",align:null},"Language code blocks are typically split between those which start and end with a character or phrase, or alternatively use indentation (whitespace). LARF supports three options for code-blocks which are DELIMITER, WHITESPACE_FIXED, WHITESPACE_IDENTIFY. Please see ",(0,r.yg)("a",{parentName:"td",href:"/docs/toolkit/code-blocks"},"here")," for more details.")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"WHITESPACE_VALUE"),(0,r.yg)("td",{parentName:"tr",align:null},"String"),(0,r.yg)("td",{parentName:"tr",align:null},'When using the CODE_BLOCK_STYLE property with the WHITESPACE_FIXED option, this value determines the fixed value used to represent each stacked indentation code-block. For example, you may choose to specify four spaces or a tab. Alternatively, you can specify multiple of these values using an or (pipe i.e. "...',"|",'..."). Tabs can be represented by using ',(0,r.yg)("inlineCode",{parentName:"td"},"\\t"),".")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"STRICT_WHITESPACE"),(0,r.yg)("td",{parentName:"tr",align:null},"Boolean"),(0,r.yg)("td",{parentName:"tr",align:null},"When using WHITESPACE_FIXED or WHITESPACE_IDENTIFY, if a line is defined which doesn't follow either the pattern determined by WHITESPACE_VALUE or the pattern identified using WHITESPACE_IDENTIFY then an error is thrown.")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"LANGUAGE_TYPED"),(0,r.yg)("td",{parentName:"tr",align:null},"LanguageTyped"),(0,r.yg)("td",{parentName:"tr",align:null},"Languages can either be typed or typeless. Typed languages require a type to be assigned to values within context. If a value is assigned which is not compatible then errors will be thrown.")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"FLAG_NATIVE_ERRORS"),(0,r.yg)("td",{parentName:"tr",align:null},"Boolean"),(0,r.yg)("td",{parentName:"tr",align:null},"When an error is thrown from the underlying language and mapped to an in-language error (See ",(0,r.yg)("a",{parentName:"td",href:"/docs/toolkit/error-handling"},"Error Checking"),") then by default a JVM stack trace will be included. If this is disabled then only the language stack trace will be provided.")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"JVM_TRACE_LIMIT"),(0,r.yg)("td",{parentName:"tr",align:null},"Integer"),(0,r.yg)("td",{parentName:"tr",align:null},"If the FLAG_NATIVE_ERRORS is enabled, this option determines the number of lines of the stack trace to include. This is useful as JVM error and the accompanying stack trace can be quite extensive.")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"JUMP_SUPPORT"),(0,r.yg)("td",{parentName:"tr",align:null},"Boolean"),(0,r.yg)("td",{parentName:"tr",align:null},"Adds support for jumps within a language. This provides the ability for a program to jump directly to defined label (See ",(0,r.yg)("a",{parentName:"td",href:"/docs/toolkit/jumping"},"Jumping")," for more information).")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"FORWARD_JUMPING"),(0,r.yg)("td",{parentName:"tr",align:null},"Boolean"),(0,r.yg)("td",{parentName:"tr",align:null},"By default, jumping through using JUMP_SUPPORT only supports backward jumping. If this option is enabled then jumps forward are permitted.")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"GLOBAL_SCOPE"),(0,r.yg)("td",{parentName:"tr",align:null},"Boolean"),(0,r.yg)("td",{parentName:"tr",align:null},"Values stored to context obey scope by default. As such, code which does not share that same scope cannot access those values directly. This suits most languages, but may want to treat all values for simplicity as accessible. This option will disable variable scoping and make all values irrespective of where they're declared accessible.")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"CASE_SENSITIVE"),(0,r.yg)("td",{parentName:"tr",align:null},"Boolean"),(0,r.yg)("td",{parentName:"tr",align:null},"When writing a language, you may want to allow people to use any case. For example, if you were defining a new language you could allow people to use ",(0,r.yg)("inlineCode",{parentName:"td"},"copy R1 to R2")," or ",(0,r.yg)("inlineCode",{parentName:"td"},"COPY R1 TO R2"),".")))),(0,r.yg)("admonition",{title:"Custom Properties",type:"tip"},(0,r.yg)("p",{parentName:"admonition"},"You can define custom properties using an overloaded version of the ",(0,r.yg)("inlineCode",{parentName:"p"},"setProperty")," method. For example, to set a property to enable some of the more experimental features of your language you could use ",(0,r.yg)("inlineCode",{parentName:"p"},'myLanguageConfig.setProperty("experimentalFeatures", true);'),".You can then read this from any Token ",(0,r.yg)("inlineCode",{parentName:"p"},"process(...)")," method using ",(0,r.yg)("inlineCode",{parentName:"p"},'boolean enableFeatures = config.getProperty("experimentalFeatures", Boolean.class);'),".")))}g.isMDXComponent=!0},508:(e,t,n)=>{n.d(t,{A:()=>a});const a=n.p+"assets/images/config2-43b28bfe0deb74ba903fcdce687c8cb3.jpg"}}]);