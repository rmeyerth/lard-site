---
sidebar_position: 1
---
# Token Overview
### Introduction
LARF takes a unique approach to tokens. For many when defining languages, tokens represent keywords, operators and literals 
so that if you had the expression ``int i = 1;``, this would be broken up into ``int``, ``i``, ``=``, ``1`` and ``;``. 
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
the above case we can see a ``'for'`` static syntax value that matches the first token in the expression (Please see [Grammar](./grammar) for more information). If multiple token
handlers when matching the current token, it will attempt to use a look-ahead mechanism to make a "best guess", but if 
that still fails then an error will be thrown by the Lexer due to token ambuiguity. In our case we only have one Token 
which represents a for statement as a match. As such, the Lexer will create a new instance of this and push it onto the
stack. 