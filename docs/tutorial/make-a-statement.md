---
sidebar_position: 7
---
# Making a statement
:::tip Statements

If literals are considered the building blocks of a language, statements are considered the machinery and workers
which put the whole thing together. Statements are slightly more complicated to define and understand than literals 
due to their nature. However, once you get to grip with LARD's powerful grammar system you'll be able to create a new 
conditional, loop or iterative statement in mere minutes, not days.

:::
Let's start by creating a new package within tokens called statements. We'll call it ExpressionToken.java as what
can be found within the brackets could be referred to as one:
```
[src]
   [main]
       [java]
           [com.aardvark]
               [config]
                   AardvarkConfig.java
               [operations]
                   IntegerOperation.java
               [tokens]
                   [operators]
                       AardvarkArithmeticOperator.java
                   [literals]
                       DecimalToken.java
                       IntegerToken.java
                       NullToken.java
                   [statements]
                       ExpressionToken.java
               Application.java
```
Open up the class and extend Token using the Void generic type. There are several differences between this and previous
tokens we've defined:
```java
public class ExpressionToken extends Token<Void> {

    public ExpressionToken() {
        super("Expression", null);
    }

    @Override
    public Token<Void> createToken(String value) {
        return cloneDefaultProperties(new ExpressionToken());
    }

    @Override
    public PatternType getPatternType() {
        return PatternType.GRAMMAR;
    }

    @Override
    public String getPattern() {
        return "'(' expr ')'";
    }

    @Override
    public Optional<String> getGuidance(String token, List<Integer> groupsCount) {
        if (token.equalsIgnoreCase(")"))
            return Optional.of("An operation requires the contained logic to be wrapped in a pair of braces " + 
                    "e.g. ( <logic> )<--");
        return Optional.empty();
  }

    @Override
    protected List<Token<?>> process(LARDParser parser, LARDContext context, LARDConfig config) {
        return Collections.singletonList(
            parser.processExpression(getTokenGroups().get(0).getTokens(), context)
        );
    }
}
```
Let's break this down:
1. As we're using Void we simply pass null in the parent call from the constructor.
2. The definition in the ``createToken`` method has changed. Now we wrap the new instance within a superclass method
   called ``cloneDefaultProperties``. This allows the new instance to copy the pattern tokens generated from the grammar
   string to the new token. These are used by the lexer to keep track of position and assign lexed tokens into the
   tokens groups.
3. The pattern type has changed to GRAMMAR along with the actual pattern defined as ``'(' expr ')'``. I won't go into
   too much detail at this stage, but any value defined within single quotes is part of the syntax. The ``expr`` informs
   the lexer that it should expect one or more tokens in the capture group. I will cover grammar further once we expand
   more into other statements.
4. This is the first time we are actually using the ``getGuidance`` method. In this case there is only one situation
   that can occur. This is if the closing brace is not used and the statement is left open. As such, we'll provide some
   text to the developer about where they went wrong. I'll show an example in the runner below.
5. Finally, we come to the ``process`` method which is where the code is actually resolved. In this case it is very
   simple as we only have one token group to resolve a value from. Each token group can be fetched using the inherited
   ``getTokenGroups()`` method. This might be a bit hard to get your head around at this stage, so I would suggest trying
   out the ```(5 + 3) / 2``` example, once the token is configured, in the runner. If you debug the first line you'll
   notice that the token group has three tokens contained within:
   ```
   IntegerToken(5)
   AardvarkArithmeticOperator(+)
   IntegerToken(3) 
   ```
   To resolve that calculation, we simply pass that group back to the parser in the call ``parser.processExpression``.
   The responsibility of the current token only goes so far as to resolve its own logic. Everything else is deferred
   to the contained tokens or, in this case, the NumericOperation class we defined earlier. From there we simply return
   it in a collection.

Let's configure our new token in the configuration class:
```java
public class AardvarkConfig extends LARDConfig {
    //...
    @Override
    protected void initTokenHandlers() {
        //Literals
        addTokenHandler(new NullToken());
        addTokenHandler(new IntegerToken());
        addTokenHandler(new DecimalToken());

        //Statements
        addTokenHandler(new ExpressionToken());
    }
    //...
}
```
Now, let's run some examples:
```
(5 + 3) / 2
Result: 4 (Type: Integer, Time taken: 20ms)
5 + 3 / 2
Result: 6.5 (Type: Double, Time taken: 4ms)
3 / (1 + (3 * 3)) - 2
Result: -1.7 (Type: Double, Time taken: 4ms)
```
There are no restrictions on the level of depth statements can be nested.

Ok, let's review what we've achieved so far:
1. Created our project and runner
2. Literals (Null, Integer and Decimal)
3. Arithmetic Operators
4. Numeric Operation Handler
5. Written our first statement

From all of that effort we've got... a glorified calculator. Don't worry! With all the foundations we're laying,
development starts to accelerate exponentially. Soon you'll be able to add even complex statement with little effort.
It's now time to move on to our next statement which is a mainstay of most modern languages.