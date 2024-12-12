"use strict";(self.webpackChunklarf_site=self.webpackChunklarf_site||[]).push([[397],{5680:(e,n,t)=>{t.d(n,{xA:()=>u,yg:()=>m});var r=t(6540);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function a(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?a(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,r,o=function(e,n){if(null==e)return{};var t,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var l=r.createContext({}),p=function(e){var n=r.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},u=function(e){var n=p(e.components);return r.createElement(l.Provider,{value:n},e.children)},c="mdxType",g={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},d=r.forwardRef((function(e,n){var t=e.components,o=e.mdxType,a=e.originalType,l=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),c=p(t),d=o,m=c["".concat(l,".").concat(d)]||c[d]||g[d]||a;return t?r.createElement(m,i(i({ref:n},u),{},{components:t})):r.createElement(m,i({ref:n},u))}));function m(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var a=t.length,i=new Array(a);i[0]=d;var s={};for(var l in n)hasOwnProperty.call(n,l)&&(s[l]=n[l]);s.originalType=e,s[c]="string"==typeof e?e:o,i[1]=s;for(var p=2;p<a;p++)i[p]=t[p];return r.createElement.apply(null,i)}return r.createElement.apply(null,t)}d.displayName="MDXCreateElement"},2711:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>i,default:()=>g,frontMatter:()=>a,metadata:()=>s,toc:()=>p});var r=t(8168),o=(t(6540),t(5680));const a={sidebar_position:2},i="Functions",s={unversionedId:"toolkit/tokens/functions",id:"toolkit/tokens/functions",title:"Functions",description:"Functions",source:"@site/docs/toolkit/tokens/functions.md",sourceDirName:"toolkit/tokens",slug:"/toolkit/tokens/functions",permalink:"/docs/toolkit/tokens/functions",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/toolkit/tokens/functions.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"tutorialSidebar",previous:{title:"Token Overview",permalink:"/docs/toolkit/tokens/token-overview"},next:{title:"Instances",permalink:"/docs/toolkit/tokens/instances"}},l={},p=[],u={toc:p},c="wrapper";function g(e){let{components:n,...a}=e;return(0,o.yg)(c,(0,r.A)({},u,a,{components:n,mdxType:"MDXLayout"}),(0,o.yg)("h1",{id:"functions"},"Functions"),(0,o.yg)("p",null,(0,o.yg)("img",{alt:"Functions",src:t(5451).A,width:"1468",height:"309"}),"\nRegardless of which language you use, it will likely provide some way to provide a callable block of code. These may differ in design\nand capability but they generally follow the same principles:"),(0,o.yg)("ol",null,(0,o.yg)("li",{parentName:"ol"},"They have a unique name within that namespace to call the function. Functions so long as they're made public or within scope can be\ncalled from anywhere, even itself (Recursion)."),(0,o.yg)("li",{parentName:"ol"},"They may have one or more values (parameters) passed in the header sectopm used within the body."),(0,o.yg)("li",{parentName:"ol"},"A keyword e.g. ",(0,o.yg)("inlineCode",{parentName:"li"},"return myResult;")," can be used to return a literal or object"),(0,o.yg)("li",{parentName:"ol"},"If you're creating a typed language then modifiers and return types may be specified"),(0,o.yg)("li",{parentName:"ol"},"Can declare what would be thrown from the function if an error were to occur (checked).\nLet's see an example of this in the Java language:")),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre",className:"language-java"},'public double divideNumbers(double a, double b) throws DivideByZeroException {\n    if (b == 0)\n        throw new DivideByZeroException("Cannot divide by zero");\n    return a / b;\n}\n')),(0,o.yg)("p",null,"Let's get started on creating a new token to represent functions for a typeless langauge for simplicity:"),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre",className:"language-java"},"public class FunctionToken extends Token<Void> implements TokenParameters {\n\n    public FunctionToken() {\n        super(\"Function\", null);\n    }\n\n    @Override\n    public Token<Void> createToken(String value) {\n        return cloneDefaultProperties(new FunctionToken());\n    }\n\n    @Override\n    public PatternType getPatternType() {\n        return PatternType.GRAMMAR;\n    }\n\n    @Override\n    public String getPattern() {\n        return \"'func' val '(' ( val ','? )+ ')' ( [ throws ] )? [ singleLine, multiLine ]\";\n    }\n\n    @Override\n    public List<Token<?>> process(LARFParser parser, LARFContext context, LARFConfig config) { ... }\n\n    @Override\n    public List<Token<?>> process(LARFParser parser, LARFContext context, LARFConfig config, \n                                  List<Token<?>> providedParams) { ... }\n\n    @Override\n    public List<ErrorToken> getThrowsToken() { ... }                                  \n\n    @Override\n    public String getNameIdentifier() {\n        return getTokenGroups().get(0).getFlatTokens().get(0).getValue(String.class);\n    }\n\n    @Override\n    public boolean hasParserPriority() {\n        return true;\n    }\n\n    @Override\n    public VariableType getVariableType() {\n        return VariableType.FUNCTION;\n    }                                  \n}\n")),(0,o.yg)("p",null,"First thing to note is that we implement an interface specifically for parameter passing between tokens. This introduces some new\nmethods which we don't normally see when extending the standard Token class. I'll cover these below:"),(0,o.yg)("ol",null,(0,o.yg)("li",{parentName:"ol"},(0,o.yg)("inlineCode",{parentName:"li"},"getThrowsToken()"),": (Optional) This is used to return the ErrorToken captured by the equivalent ",(0,o.yg)("inlineCode",{parentName:"li"},"throws")," token. This token\nuses a special grammar value called ",(0,o.yg)("inlineCode",{parentName:"li"},"error")," to capture each type of error thrown."),(0,o.yg)("li",{parentName:"ol"},(0,o.yg)("inlineCode",{parentName:"li"},"getNameIdentifier()"),": This is the unique name in scope to identify the function. In the example I provided above this would\nbe ",(0,o.yg)("inlineCode",{parentName:"li"},"divideNumbers"),"."),(0,o.yg)("li",{parentName:"ol"},(0,o.yg)("inlineCode",{parentName:"li"},"hasParserPriority()"),": This overrides the default method from the base Token class which is usually set to false. When the\nparser first iterates through the mapped tokens, it calls the default ",(0,o.yg)("inlineCode",{parentName:"li"},"process")," method. In most languages you are able to call a\nmethod from before you've encountered it. Otherwise you'd have to arrange all your methods in order which would be impractical.\nAs such, this flag is used by the Parser to first scan through the list and execute these tokens so that they can be set in the\ncontext before any other line of code is run."),(0,o.yg)("li",{parentName:"ol"},(0,o.yg)("inlineCode",{parentName:"li"},"getVariableType()"),": This is used for tracing purposes and allows the parser to identify these values correctly during runtime\nin context as functions.")),(0,o.yg)("p",null,"There is also one additional new method which is the new ",(0,o.yg)("inlineCode",{parentName:"p"},"process")," method which accepts additional parameters. I will go into\nmore details to describe exactly how the token works by providing examples of the ",(0,o.yg)("inlineCode",{parentName:"p"},"{ ... }")," methods below."),(0,o.yg)("p",null,"First, let's look at the standard ",(0,o.yg)("inlineCode",{parentName:"p"},"process")," method. This one gets called by the parser when it is first executed:"),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre",className:"language-java"},'    @Override\n    public List<Token<?>> process(LARFParser parser, LARFContext context, LARFConfig config) {\n        //Part 1\n        if (getTokenGroups().size() != 4) {\n            throw new ParserException(String.format("Expected four groups being 1) Function Name " +\n                    "2) Parameters (if provided) 3) throws <error> (if provided) 4) Implementation. " +  \n                    "Found only %d groups", getTokenGroups().size()));\n        }\n        //Part 2\n        if (getTokenGroups().get(0).getFlatTokens().size() != 1) {\n            throw new ParserException(String.format("Expected a single TokenValue for the function " + \n                    "name but found %d tokens provided", getTokenGroups().get(0).getTokenPosition()));\n        }\n        //Part 3\n        String functionName = getTokenGroups().get(0).getFlatTokens().get(0).getValue().toString();\n        context.set(functionName.concat(Integer.toString(getTokenGroups().get(1).getFlatTokens().size())),\n                this, VariableType.FUNCTION);\n        //Part 4\n        return Collections.singletonList(config.getNullToken());\n    }\n')),(0,o.yg)("ul",null,(0,o.yg)("li",{parentName:"ul"},(0,o.yg)("strong",{parentName:"li"},"Part 1"),": First we check and validate that the four token groups are present"),(0,o.yg)("li",{parentName:"ul"},(0,o.yg)("strong",{parentName:"li"},"Part 2"),": Next we perform a check to ensure that a name has been provided"),(0,o.yg)("li",{parentName:"ul"},(0,o.yg)("strong",{parentName:"li"},"Part 3"),": We extract the function name from the token group and concatenate it with the number of parmeters and set the\ncurrent token in context against that name. This is so we can fetch it later on when that name is referenced in other tokens. As\nit is, because we're adhering to it being truly typeless we can only have one version of a method with the same number of\nparameters."),(0,o.yg)("li",{parentName:"ul"},(0,o.yg)("strong",{parentName:"li"},"Part 4"),": We return a simple null token as there is no result from this initial call used to insert the function into context.")),(0,o.yg)("p",null,"Let's look at the ",(0,o.yg)("inlineCode",{parentName:"p"},"process")," method which accepts parameters next:"),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre",className:"language-java"},'    public List<Token<?>> process(LARFParser parser, LARFContext context, LARFConfig config, \n                                  List<Token<?>> providedParams) {\n        //Part 1\n        String functionName = getTokenGroups().get(0).getFlatTokens().get(0).getValue().toString();\n        List<Token<?>> paramVars = getTokenGroups().get(1).getFlatTokens();\n        //Part 2\n        if (paramVars.size() != providedParams.size()) {\n            throw new ParserException(String.format("Function %s expected %d parameters, but only called " +\n                    "with %d", functionName, paramVars.size(), providedParams.size()));\n        }\n        //Part 3\n        for (int i = 0;i < paramVars.size();i++) {\n            context.set(paramVars.get(i).getValue(String.class), providedParams.get(i), \n                        VariableType.PARAMETER);\n        }\n        //Part 4\n        Token<?> result = parser.processExpression(getTokenGroups().get(3).getFlatTokens(), context);\n        //Part 5\n        if (!result.getParserFlags().isEmpty() && !result.getParserFlags().contains(ParserFlag.ERROR)) {\n            //Unwrap result as we don\'t want to return token any further\n            return Collections.singletonList(result.getValue() instanceof Token ?\n                    (Token<?>)result.getValue() : new TokenValue(result.getValue()));\n        }\n        return Collections.singletonList(result);\n    }\n')),(0,o.yg)("p",null,"Firstly, let's mention how this token would be called. This would typically occur through the use of another token. In our case\nwe're going to use another token called InvocationToken. This allows us to make calls to the function we've created and pass it\nvalues. Let's look at this tokens implementation:"),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre",className:"language-java"},'public class InvocationToken extends Token<Void> {\n\n    public InvocationToken(TokenValue value) {\n        super("Function", null);\n        getTokenGroups().add(new TokenGroup(Collections.singletonList(value)));\n    }\n\n    @Override\n    public Token<Void> createToken(String value) {\n        return cloneDefaultProperties(new InvocationToken(new TokenValue(value)));\n    }\n\n    @Override\n    public PatternType getPatternType() {\n        return PatternType.GRAMMAR;\n    }\n\n    @Override\n    public String getPattern() {\n        return "val:String \'(\' ( expr \',\'? )+ \')\'";\n    }\n\n    @Override\n    public Optional<String> getGuidance(String token, List<Integer> groupsCount) {\n        if (token.equalsIgnoreCase(")"))\n            return Optional.of("A function definition requires parameters to be wrapped in a pair of braces " +\n                    "e.g. FUNC( 1,2,3 )<--");\n        return Optional.empty();\n    }\n\n    @Override\n    public List<Token<?>> process(LARFParser parser, LARFContext context, LARFConfig config) {\n        ...\n    }\n}\n')),(0,o.yg)("admonition",{title:"Grammar Help",type:"tip"},(0,o.yg)("p",{parentName:"admonition"},"For more help on understanding and defining grammar, please see the ",(0,o.yg)("a",{parentName:"p",href:"/docs/toolkit/tokens/grammar"},"Grammar")," section.")),(0,o.yg)("p",null,"The sole purpose of this token is to call a function by name and pass it parameters. As we're using a typeless language, it only\nexpects a name (",(0,o.yg)("inlineCode",{parentName:"p"},"val:String"),") along with ` list of one or more parameters found between a pair of brackets (",(0,o.yg)("inlineCode",{parentName:"p"},"'(' ( expr ','? )+ ')'"),").\nAs we have a single capture group for the name and a capture group for the parameters, this means we have two token groups to\nwhich these values will be written to. For example, if we had the following expresion ",(0,o.yg)("inlineCode",{parentName:"p"},"myMethod(1,2,3)"),", this would be mapped to:"),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre"},'[0] TokenGroup\n    [0] StringValue("myMethod")\n[1] TokenGroup\n    [0] TokenGroup *\n        [0] IntegerToken(1)\n    [1] TokenGroup\n        [0] IntegerToken(2)\n    [2] TokenGroup\n        [0] IntegerToken(3)\n')),(0,o.yg)("p",null,"*"," When a group is defined in the grammar i.e. ",(0,o.yg)("inlineCode",{parentName:"p"},"(...)"),", the lexer creates a child group for each token passed in that\ngroup. This is because the group can contain one or more tokens. For example, the method call may be ",(0,o.yg)("inlineCode",{parentName:"p"},"myMehod(1 + 2,3 - 4,5)"),". This\nwould result in:"),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre"},'[0] TokenGroup\n    [0] StringValue("myMethod")\n[1] TokenGroup\n    [0] TokenGroup\n        [0] IntegerToken(1)\n        [1] OperatorToken("+")\n        [2] IntegerToken(2)\n    [1] TokenGroup\n        [0] IntegerToken(3)\n        [1] OperatorToken("-")\n        [2] IntegerToken(4)\n    [2] TokenGroup\n        [0] IntegerToken(3)\n')),(0,o.yg)("p",null,"Let's now look at the InvocationToken's ",(0,o.yg)("inlineCode",{parentName:"p"},"process")," method:"),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre",className:"language-java"},'@Override\npublic List<Token<?>> process(LARFParser parser, LARFContext context, LARFConfig config) {\n    //Part 1\n    if (getTokenGroups().isEmpty() || getTokenGroups().get(0).getTokens().isEmpty()) {\n        throw new ParserException("Function has no name or parameters");\n    }\n    //Part 2\n    String methodName = getTokenGroups().get(0).getTokens().get(0).getValue(String.class);\n    List<Token<?>> params = getTokenGroups().size() > 1 ?\n            getTokenGroups().get(1).processTokens(parser, context) : new ArrayList<>();\n    //Part 3\n    Object definedFunction = context.getContextObject(methodName.concat(Integer.toString(params.size())));\n    if (!(definedFunction instanceof FunctionToken)) {\n        throw new ParserException(String.format("Found user defined function %s in the context but was not a FunctionToken",\n                methodName));\n    }\n    //Part 4\n    Token<?> token = (Token<?>)definedFunction;\n    return token.processWithParams(this, parser, context, config, params);\n}\n')),(0,o.yg)("p",null,"Let's break down the implementation:"),(0,o.yg)("ul",null,(0,o.yg)("li",{parentName:"ul"},(0,o.yg)("strong",{parentName:"li"},"Part 1"),": Performs some validation on the tokens to ensure that a name has been provided"),(0,o.yg)("li",{parentName:"ul"},(0,o.yg)("strong",{parentName:"li"},"Part 2"),": Fetches the method name and parameter list from Token Groups 0 and 1 respectively"),(0,o.yg)("li",{parentName:"ul"},(0,o.yg)("strong",{parentName:"li"},"Part 3"),": Concatenates the name with the size of the parameter list to fetch the FunctionToken from context. It then\nperforms a validation check to ensure that the name is indeed a function token."),(0,o.yg)("li",{parentName:"ul"},(0,o.yg)("strong",{parentName:"li"},"Part 4"),": As tokens that are stored into context are returned as Objects, we cast it to a Token before calling the\nFunctionTokens ",(0,o.yg)("inlineCode",{parentName:"li"},"processWithParams")," method along with the list of parameters declared. This then calls that method\nfound within our FunctionToken class which we've already covered above. The result of this is returned from the Invocation\ntoken back to the parser which is propagated up the stack.")))}g.isMDXComponent=!0},5451:(e,n,t)=>{t.d(n,{A:()=>r});const r=t.p+"assets/images/functions-900325567202ff1082769684424fb61e.jpg"}}]);