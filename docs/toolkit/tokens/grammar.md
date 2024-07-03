---
sidebar_position: 10
---
# Grammar
The grammar system allows you to outline the pattern the lexer it should match for your statement when tokenizing an 
expression. It also tells the lexer the groups to which tokens should be assigned so that they are accessible during 
parsing when your Token ``process`` method gets called. During its development it became fondly known as the Least
Effort Grammar System (LEGS for short). This is because you don't have to outline every possible interaction between
sets of tokens. Instead we give it the basic structure, state what will be captured at a given point and the Lexer 
will figure out the rest. Below is a table showing the symbols you can use within the grammar and what they do:

| Symbol | Example            | Description                                                                                                                                                                                                                     |
|--------|--------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| '...'  | ``'for'``          | A static syntax value                                                                                                                                                                                                           |
| expr   | ``expr``           | A capture group of one or more tokens                                                                                                                                                                                           |
| val    | ``val``            | A capture group of strictly one token                                                                                                                                                                                           |
| ?      | ``expr?``          | Makes the preceding group or token optional                                                                                                                                                                                     |
| <?     | ``'!'<?``          | Stores the static syntax value to the group. This can be used as a flag so that if the value is used it can be used by the code during processing.                                                                              |
| (...)  | ``( expr )``       | Defines a token group so that actions can be applied against the contents. It also provides the ability to create multiple levels of tokens groups for complex structures.                                                      |
| +      | ``( expr ',' )+``  | Flags that the previous token group can occur multiple times                                                                                                                                                                    |
| [...]  | ``[ ref1, ref2 ]`` | Grammar references defer responsibility to one or more other tokens to handle execution. This allows grammar branching so one token can support multiple implementation e.g. for / foreach both using the same ``for`` keyword. |
| :      | ``val:String``     | Used in conjunction with a single capture group. This forces a given value to adhere to the provided name / type specified.                                                                                                     |
| type   | ``type``           | Captures a type when defining a typed language. Types can be used when defining variables, return types of methods / classes or generics. Literals representing types should implement the TypedToken interface.                |
| mod    | ``( mod )+?``      | Modifiers are used to change the immutability or visibility of a variable, function or type. These tokens implement the TokenModifier interface.                                                                                |
| error  | ``error``          | Captures an error handler which is thrown by the resources on which it is defined.                                                                                                                                              |

Let's look at a couple of examples from various languages to see how we would define them.
### Kotlin - Elvis Operator (Easy)
In Kotlin, including several other languages there is the elvis operator. This is the equivalent of what the 
Optional.ofNullable does in Java. An example of this would be ``customerAges.get("mary") ?: -1``. It looks at the value of the 
left-side and if found to be null, uses the right-side as a fallback. The grammar for this in LARF would be:
```java
@Override
public String getPattern() {
    return "val '?:' val";
}
```
Alternatively you could replace the ``val`` with ``expr`` for the fallback portion which would provide 
support for multiple token evaluation e.g. ``possibleNull ?: fallback + 2``. Now that we have our grammar, let's look
at this in terms of token groups. In this simple example there are only two, which is the value being evaluated and
the fallback. Since we now know this, we can write our process method as the following:
```java
@Override
public List<Token<?>> process(LARFParser parser, LARFContext context, LARFConfig config) {
    if (getTokenGroups().size() != 2) {
        throw new ParserException(String.format("Expected both a value to check for null and a fallback. " +
                "Found %s tokens", getTokenGroups().size()));
    }
    Token<?> result = parser.processExpression(getTokenGroups().get(0).getTokens(), context);
    if (Objects.isNull(result.getValue())) {
        return Collections.singletonList(
                parser.processExpression(getTokenGroups().get(1).getTokens(), context));
    }
    return Collections.singletonList(result);
}
```
1. First we check to see if we have two token groups. If not we can throw a parser error.
2. Next we evaluate the content of the first token group. If the left-side is null, evaluate and return the content of 
the fallback group. Alternatively just return the result.

:::tip Verifying Token Groups

Although it is good practise to verify token content during the processing phase, many issues would typically be
caught by the syntax checker and throw an error during the lexing stage. Still, for safety and to prevent any 
unforeseen issues, it is always best to verify the groups you're expecting are present before using them.

:::
### C++ - If Statement (Medium)
A common statement across all languages is the conditional of ``if`` statement. It evaluates a boolean condition and
executes one or more statements or expressions. It could include an alternative group of expressions to execute using 
an ``else`` which could be chained with other ``if`` statements. Although the nature of this statement is simple, there
is actually a branch in the body. This is because we could do ``if (i == 1) j = 4;`` or we could have multiple lines
in a code-block:
```java
int j, j;
if (i == 1) {
    i = j;
    j += 2;
}
```
To handle both from within the same statement, we can define the following:
```java
@Override
public String getPattern() {
    return "'if' '(' expr ')' [ singleLine, multiLine ] ( 'else' [ singleLine, multiLine ] )?";
}
```
Let's break this down:
1. First we expect an ``if`` keyword
2. Next an expression (one or more tokens) wrapped in syntax parentheses e.g. ``'(' ... ')'``.
3. We have our first branch which defers responsibility to a token identified by the name ``singleLine`` or ``multiLine``.
4. Finally we declare another optional group for the ``else`` portion with yet another single or multi-line body

Before we dive into look at the single and multi-line tokens, let's look at the process method implementation for this:
```java
@Override
public List<Token<?>> process(LARFParser parser, LARFContext context, LARFConfig config) {
    Token<?> condition = parser.processExpression(getTokenGroups().get(0).getFlatTokens(), context);
    if (!condition.is(Boolean.class)) {
        throw new ParserException("If requires a boolean to be used as a the condition!");
    }
    if (Boolean.TRUE.equals(condition.getValue(Boolean.class))) {
        return Collections.singletonList(parser.processExpression(getTokenGroups().get(1).getFlatTokens(), context));
    } else if (getTokenGroups().size() == 3) {
        return Collections.singletonList(parser.processExpression(getTokenGroups().get(2).getFlatTokens(), context));
    }
    return Collections.singletonList(config.getNullToken());
}
```
Let's again break this down:
1. Although it might not be clear to see, there are in fact 3 resulting token groups from the above grammar string. 
The first is the condition with the second and third being the two possible grammar reference branches (true or false)
scenarios.
2. The code evaluates the content of the first token group
3. If the result is not a Boolean then an error is thrown
4. If the result is true then the second token group is evaluated
5. If the condition evaluates to false then we check to see if there are 3 token groups and evaluate that group.
Alternatively a null token is returned as nothing needs to be done.

Before we dive in and start looking at the single and multi-line token variants, there is one more thing to be aware of.
Tokens by default are created as TokenType.PRIMARY. This means it is added to the list so that it can be matched directly
from the keywords found in code. The alternative to this is TokenType.SECONDARY which cannot be instantiated from code 
alone and must exist as part of another Token. An example of this is the MultiLineToken (as referenced above). In C / C++
or Java you cannot define ```{ ... }``` on their own, but only as part of another token. Whether that is a condition,
function or class. Now that we know this, let's look at the SingleLineToken implementation:
```java 
public class SingleLineToken extends Token<Void> {

    public SingleLineToken() {
        super("singleLine", null);
    }

    @Override
    public PatternType getPatternType() {
        return PatternType.GRAMMAR;
    }

    @Override
    public String getPattern() {
        return "expr ';'";
    }

    @Override
    public List<Token<?>> process(LARFParser parser, LARFContext context, LARFConfig config) {
        if (getTokenGroups().isEmpty())
            return Collections.singletonList(config.getNullToken());
        //Fetch all inner tokens within line to process
        List<Token<?>> tokens = getTokenGroups().get(0).getFlatTokens();
        return Collections.singletonList(parser.processExpression(tokens, context));
    }

    @Override
    public Token<Void> createToken(String value) {
        return cloneDefaultProperties(new SingleLineToken());
    }

    @Override
    public boolean isExpression() {
        return true;
    }
}
```
We can see that when we create a Token, the superclass constructor must be called which requires a name and value. 
This is where we can see our unique reference for our token that can be used in grammar references. Here are some
observations about the class:
1. The SingleLineToken is TokenType.PRIMARY rather than SECONDARY. This is because we define use it on it's own by
defining ``int i = 1 + 2;``. It needs no other token to exist.
2. In our case, the grammar for this is very simple with one or more tokens being defined, ending with a ';' character.
3. Moving into our process method, if no token groups are found then a NullToken is returned.
4. If a token group does exist, we evaluate and return the result from token group 0 and return it.
5. Because this Token is used to hold expressions, we need to override the ``isExpression`` method and return true.
This flag for special handling by the Lexer and Parser.

Let's now contrast this with our MultiLineToken:
```java
public class MultiLineToken extends Token<Void> {

    public MultiLineToken() {
        super("multiLine", null, TokenType.SECONDARY);
    }

    @Override
    public PatternType getPatternType() {
        return PatternType.GRAMMAR;
    }

    @Override
    public String getPattern() {
        return "'{' ( [ singleLine ] )+ '}'";
    }

    @Override
    public Optional<String> getGuidance(String token, List<Integer> groupsCount) {
        return Optional.empty();
    }

    @Override
    public List<Token<?>> process(LARFParser parser, LARFContext context, LARFConfig config) {
        if (getTokenGroups().isEmpty()) return Collections.singletonList(new NullToken());
        List<Token<?>> singleLines = getTokenGroups().get(0).getFlatTokens();
        return Collections.singletonList(parser.processExpression(singleLines, context));
    }

    @Override
    public Token<Void> createToken(String value) {
        return cloneDefaultProperties(new MultiLineToken());
    }

    @Override
    public boolean isExpression() {
        return true;
    }
}
```
There are some subtle differences to this token:
1. Firstly we pass the ``TokenType.SECONDARY`` in the constructor to make it clear this cannot be used on its own.
2. The grammar string expects the body to be wrapped in curly braces e.g. ``{ ... }``. We do something interesting
here in that we reference the singleLine token in a group that can occur one or more times. This might be a bit 
confusing, but it saves having to repeat ourselves and just defer responsibility to the other class. As such, we'll
have the following references in some scenarios: OurIfToken => MultiLineToken => SingleLineToken.
3. We are only expecting one token group which will contain our SingleLineToken definitions. For this, we pass the
list of tokens to our parser and return the result.
4. Again we override the ``isExpression`` method and return true.

This might seem a bit confusing, but we don't need to cater to ``else if`` scenarios as this is already covered. This
is because ``if (...) { ... } else ...`` covers that. The next ``if`` statement will be a follow-on statement 
and executed as such. You can join as many if ... else if ... else if ... else ... statements as you like. This is 
something to keep in mind when designing your language.