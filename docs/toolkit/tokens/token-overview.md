---
sidebar_position: 1
---
# Token Overview
![Tokens](/img/tokens.jpg)
### How Tokens are used
:::tip Optional Reading

The following is not required reading if you are simply looking to get up and running. This is those interested in
learning how LARF uses tokens to parse expressions. If you would like more information on the Token class 
itself then I would recommend looking at the [In the beginning](tutorial/in-the-beginning.mdx#token-class)

:::
LARF takes a unique approach to tokens in that in many language tools, tokens represent keywords, operators and literals. 
As such, if you had the expression ``int i = 1;``, this would be broken up into ``int``, ``i``, ``=``, ``1`` and ``;``. 
The parser then constructs an Abstract Syntax Tree (AST) to represent the hierarchical structure of the program with 
nodes in the tree corresponding to language constructs e.g. expressions, statements, functions. LARF on the other hand 
abstracts this so that those constructs become the tokens. Let's look at an example: 
```java
for (int i = 0;i < 10;i++) { 
    if (i % 2 == 0) 
        PRINT(i);
}
```
When the Lexer is run against this expression, it uses several base tokens found within the core project that split the
String into what would normally be called "tokens". These are named NonToken and TokenValue and are registered in the
LARFConfig.initBaseTokens(). These can be overriden should you so wish, but for most this will cover the majority of
scenarios. The TokenValue class represents every alphanumeric value, whereas the NonToken caters to everything else.
As such, when the Lexer reads the first line, it will process them as:
```bash
TokenValue(value = "for")
NonToken(value = "(")
TokenValue(value = "int")
TokenValue(value = "i")
NonToken(value = "=")
...
```
All values at this stage are read as Strings and stored as such in these tokens. The next stage is where your custom 
set of language tokens are used. When you setup your language and define a config file, you'll register the tokens 
that make up your language using the following:
```java
@Override
protected void initTokenHandlers() {
    setNullToken(new NullToken());
    //...
}
```
These token handlers are scanned for a match against the current token. For example, if we take a look at the definition 
of a ForToken, we might see something similar to the following:
```java
public class ForToken extends Token<Void> {
    //...

    @Override
    public PatternType getPatternType() {
        return PatternType.GRAMMAR;
    }

    @Override
    public String getPattern() {
        return "'for' '(' [ fixedLoop, variableLoop ] ')' [ singleLine, multiLine ]";
    }

    //...
}
```
LARF will look for a match against either the regular expression or grammar (as above) to see if a match is found. In 
the above case we can see a ``'for'`` static syntax value that matches the first token in the expression (Please see [Grammar](./grammar) for more information). 
If multiple token handlers are matched, it will attempt to use a look-ahead mechanism to make a "best guess", but if 
that still fails then an error will be thrown by the Lexer due to token ambuiguity. In our case we only have one Token 
which represents a for statement as a match. As such, the Lexer will create a new instance of this and push it onto the
stack. 

This process continues until it reaches the first grammar branch where it can either be a fixed or variable loop
variant of the loop. This is where these references are used to match the next token against one of these references.
The reference labels ``fixedLoop`` and ``variableLoop`` are specified by using the Token constructor name parameter. For
example, if we look at the FixedLoopToken, we can see the following:
```java
public class FixedLoopToken extends Token<Void> implements TokenCallback {

    public FixedLoopToken() {
        super("fixedLoop", null, TokenType.SECONDARY);
    }

    @Override
    public PatternType getPatternType() {
        return PatternType.GRAMMAR;
    }

    @Override
    public String getPattern() {
        return "expr ';' expr ';' expr";
    }

    //...
}
```
You can see that there are three ``expr`` grammar tokens which represent a capture group or one or more tokens. How then
does it know whether to choose this FixedLoopToken over the VariableLoopToken. Let's first compare the above to a
VariableLoopToken implementation:
```java
public class VariableLoopToken extends Token<Void> implements TokenCallback {

    public VariableLoopToken() {
        super("variableLoop", null, TokenType.SECONDARY);
    }

    @Override
    public PatternType getPatternType() {
        return PatternType.GRAMMAR;
    }

    @Override
    public String getPattern() {
        return "val ':' expr";
    }

    //...
}
```
:::tip Token Types

When defining a Token you can specify whether it is a PRIMARY or SECONDARY type. The former is the default
and means it can be created from the expression String without any dependence on another Token. The SECONDARY type
means that it cannot be used on its own and will result in an error if this is attempted. For example, in the 
C / Java language, you cannot define a code-block body e.g. ``{ ... }`` without an associated statement to which
it is associated (class, function, loop etc). In the example above, we would not define the loop definition
without the associated ForToken, hence it being a secondary type.

:::
Let's go back to the expression that is currently being parsed and compare:
```java
for (int i = 0;i < 10;i++) {
    //...
}
```
LARF will keep processing and adding tokens to a short-term processing store until it has identified the parent to which
these tokens belong. In our case we find a match when the first semi-colon (``;``) is found. This immediately identifies
the FixedLoopToken as being the correct branch as the VariableLoop is expecting only a single value and a colon (``:``).
A new instance of this is then created and pushed onto the stack. Those tokens which were captured prior to the semi-colon
are then added to the first capture group and the token positions are updated. 

Once a token has identified itself as being complete (all grammar token requirements are fulfilled), an event is triggered
in the lexer. The complete token is removed from the stack and either added to the parent item if the stack is not empty, 
or added to short-term memory. This process completes until all tokens are read from the expression and returned to the
LARFProcessor class. The result of this can then be persisted to storage to run later or to execute immediately.
