---
sidebar_position: 7
---
# Making a statement
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

#### Ternary Conditional Token
I'm sure we're all familiar with these. They generally take the form ``condition ? trueResult : falseResult``.
We've got several issues to overcome though. Namely, how can we define a condition when we have no way to compare
values? More immediate though, how do we make LARD understand the condition result (Boolean)? Let's first start then
by defining a BooleanToken. If you're feeling confident writing your own token using what you learned, go ahead and
try it yourself. Alternatively, click the spoiler below for help:

<details> 
    <summary>BooleanToken Implementation</summary> 

First we define a new token called Boolean token in our ``tokens.literals`` package:
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
                       BooleanToken.java
                       DecimalToken.java
                       IntegerToken.java
                       NullToken.java
                   [statements]
                       ExpressionToken.java
               Application.java
```
Next, let's define our BooleanToken by extending Token and passing the Boolean generic type:
```java
public class BooleanToken extends Token<Boolean> {

    public BooleanToken() { super("Boolean", false); }

    public BooleanToken(Boolean value) {
        super("Boolean", value);
    }

    @Override
    public PatternType getPatternType() {
        return PatternType.REGEX;
    }

    @Override
    public String getPattern() {
        return "^(true|false)";
    }

    @Override
    public Optional<String> getGuidance(String token, List<Integer> groupsCount) {
        return Optional.empty();
    }

    @Override
    public List<Token<?>> process(LARDParser parser, LARDContext context, LARDConfig config) {
        return Collections.singletonList(this);
    }

    @Override
    public Token<Boolean> createToken(String value) {
        return new BooleanToken(Boolean.parseBoolean(value));
    }
}
```
Finally, let's add it to the configuration:

```java
public class AardvarkConfig extends LARDConfig {
    //...
    @Override
    protected void initTokenHandlers() {
        //Literals
        addTokenHandler(new NullToken());
        addTokenHandler(new IntegerToken());
        addTokenHandler(new DecimalToken());
        addTokenHandler(new BooleanToken());        

        //Statements
        addTokenHandler(new ExpressionToken());
    }
    //...
}
```
Test in the runner:
```
true
Result: true (Type: Boolean, Time taken: 18ms)
false
Result: false (Type: Boolean, Time taken: 1ms)
```
</details>

Now that we've defined and configured booleans, we need to think about a different set of Operators. If you remember
back to the available operator sets, one of those was called the ComparisonOperator. Again, if you feel you know
how to do this using the AardvarkArithmeticOperator as a base, please do that. Alternatively, you can expand the
spoiler again for help:

<details> 
    <summary>AardvarkComparisonOperator Implementation</summary> 

Add a new class called AardvarkComparisonOperator.java to the ``tokens.operators`` package.
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
                       AardvarkComparisonOperator.java
                   [literals]
                       BooleanToken.java
                       DecimalToken.java
                       IntegerToken.java
                       NullToken.java
                   [statements]
                       ExpressionToken.java
               Application.java
```
Open up the new class and extend the ComparisonOperator template class. We'll stick with using the C / Java operators
for this:
```java
public class AardvarkComparisonOperator extends ComparisonOperator {

    public AardvarkComparisonOperator() {
        super(null);
    }

    @Override
    public Token<String> createToken(String value) {
        return new AardvarkComparisonOperator();
    }

    @Override
    public String getPattern() {
        return "^(==|!=|>=|<=|>|<)";
    }

    @Override
    protected void initOperators() {
        addOperator("==", ComparisonOperatorType.EQUAL);
        addOperator("!=", ComparisonOperatorType.NOT_EQUAL);
        addOperator(">=", ComparisonOperatorType.GREATER_EQUAL_TO);
        addOperator("<=", ComparisonOperatorType.LESS_EQUAL_TO);
        addOperator(">", ComparisonOperatorType.GREATER_THAN);
        addOperator("<", ComparisonOperatorType.LESS_THAN);
    }

    @Override
    public String[][] getOperatorOrder() {
        return new String[][] {
                {">=", "<=", ">", "<"},
                {"==", "!="}
        };
    }
}
```
Add the operator class to the configuration:
```java
@Override
public class AardvarkConfig extends LARDConfig {
    //...
    @Override
    protected void initOperators() {
        addOperatorHandler(new AardvarkArithmeticOperator(null));
        addOperatorHandler(new AardvarkComparisonOperator(null));
    }
    //...
}
```
</details>

We're one step closer to defining our statement. We've got the comparison operators defined and the result type. Let's
see what happens in the runner app:
```
1 == 1
dev.lard.exception.ParserException: Unable to handle numeric operation with operator '=='
	at dev.lard.languages.aardvark.operations.NumericOperation.handleCustomOperator(NumericOperation.java:34)
	at dev.lard.languages.aardvark.operations.NumericOperation.process(NumericOperation.java:53)
	at dev.lard.parser.LARDParser.processOp(LARDParser.java:321)
	at dev.lard.parser.LARDParser.processExpression(LARDParser.java:113)
	at dev.lard.parser.LARDParser.process(LARDParser.java:44)
	at dev.lard.processor.LARDProcessor.process(LARDProcessor.java:83)
	at dev.lard.runner.LARDRunner.run(LARDRunner.java:39)
	at dev.lard.runner.LARDRunner.run(LARDRunner.java:11)
	at dev.lard.languages.aardvark.AardvarkRunner.main(AardvarkRunner.java:11)
```
Yes, we need to update our NumericOperation class to handle those operators. Let's do that now:
```java
public class NumericOperation implements TypeOperation {
    //...
    @Override
    public Token<?> process(LARDConfig config, LARDContext context, Token<?> firstToken, OperatorHandler<?> operator,
                            Token<?> secondToken, Token<?> leftSide) {
        BigDecimal first = new BigDecimal(firstToken.getValue().toString());
        BigDecimal second = new BigDecimal(secondToken.getValue().toString());
        if (operator instanceof ArithmeticOperator) {
            switch (((ArithmeticOperator)operator).getOpType()) {
                case DIVIDE: return convert(first.divide(second, 6, RoundingMode.HALF_UP));
                case ADD: return convert(first.add(second));
                case SUBTRACT: return convert(first.subtract(second));
                case MULTIPLY: return convert(first.multiply(second));
                case MODULO: return convert(first.remainder(second));
                default: return handleCustomOperator(firstToken, operator, secondToken);
            }
        } else if (operator instanceof ComparisonOperator) {
            switch (((ComparisonOperator)operator).getOpType()) {
                case GREATER_EQUAL_TO: return new BooleanToken(first.compareTo(second) >= 0);
                case LESS_EQUAL_TO: return new BooleanToken(first.compareTo(second) <= 0);
                case NOT_EQUAL: return new BooleanToken(first.compareTo(second) != 0);
                case EQUAL: return new BooleanToken(first.compareTo(second) == 0);
                case GREATER_THAN: return new BooleanToken(first.compareTo(second) > 0);
                case LESS_THAN: return new BooleanToken(first.compareTo(second) < 0);
            }
        }
        return handleCustomOperator(firstToken, operator, secondToken);
    }
    //...
}
```
In the case of the comparison operators, we can simply return the result as a BooleanToken with no need to use the
wrap method. Let's run some tests:
```
4 + 4 <= 6 + 2
Result: true (Type: Boolean, Time taken: 19ms)
10 == 5 + 5
Result: true (Type: Boolean, Time taken: 1ms)
3 < 4
Result: true (Type: Boolean, Time taken: 1ms)
9 > 10
Result: false (Type: Boolean, Time taken: 1ms)
13 != 13
Result: false (Type: Boolean, Time taken: 1ms)
```
Great, so we've got the condition portion of our statement covered. Let's write our statement class. Add a new token
called TernaryConditionalToken.java (or in my case ConditionalToken.java) to the ``tokens.statements`` package. We'll
then define the class as such:
```java
public class ConditionalToken extends Token<Void> {

    public ConditionalToken() {
        super("Conditional", null);
    }

    @Override
    public PatternType getPatternType() {
        return PatternType.GRAMMAR;
    }

    @Override
    public String getPattern() {
        return "expr '?' expr ':' expr";
    }

    @Override
    public Optional<String> getGuidance(String token, List<Integer> groupsCount) {
        if (token.equalsIgnoreCase(":"))
            return Optional.of("A conditional requires true / false outcomes to be separated by a ':' " +
                    "e.g. a > b ? a :<-- b");
        return Optional.empty();
    }

    @Override
    public List<Token<?>> process(LARDParser parser, LARDContext context, LARDConfig config) {
        //Expect that there are 3 tokens groups representing the condition and true / false token groups
        if (getTokenGroups().size() < 3) {
            String found = getTokenGroups().stream().map(Token::toSimpleString).collect(Collectors.joining(","));
            throw new ParserException(String.format("Condition does not have required arguments to execute. Expecting " +
                    "3 groups being condition, trueResult and falseResult. Found: [%s]", found));
        }
        //Evaluate the condition using the tokens found in the first token group
        Token<?> conditionResult = parser.processExpression(getTokenGroups().get(0).getTokens(), context);
        //If the condition is not a Boolean then throw an error i.e. "1 + 2 ? 3 : 4"
        if (!(conditionResult instanceof BooleanToken)) {
            throw new ParserException(String.format("Expected a boolean result from condition '%s'. Possible invalid " +
                            "condition specified", getTokenGroups().get(0)));
        }
        //Execute the relevant set of tokens based on the condition result
        return Collections.singletonList((((BooleanToken) conditionResult).getValue()) ?
                parser.processExpression(getTokenGroups().get(1).getFlatTokens(), context) :
                parser.processExpression(getTokenGroups().get(2).getFlatTokens(), context));
    }

    @Override
    public Token<Void> createToken(String value) {
        return cloneDefaultProperties(new ConditionalToken());
    }

    @Override
    public String toString() {
        return "Conditional{" +
                "condition=" + (!getTokenGroups().isEmpty() ? getTokenGroups().get(0) : null) +
                ", trueResult=" + (getTokenGroups().size() > 1 ? getTokenGroups().get(1) : null) +
                ", falseResult=" + (getTokenGroups().size() > 2 ? getTokenGroups().get(2) : null) +
                '}';
    }
}
```
Ok, that's a big chunk of code but let's break it down:
1. The pattern now defines three capture groups of one or more tokens. This means we can do something like
   ``1 + 2 > 3 ? 4 + 4 : 3 / 2``. After the first capture group we're expecting a '?' character with a ':' expected
   between true / false cases.
2. We have one guidance condition if a user defines the first and second capture including the '?' value, but no
   subsequent ':' is defined, this will trigger this scenario.
3. The process is actually quite straightforward. Since the pattern has defined three capture groups, if there are
   less than 3 returned by the lexer then we throw an exception. The next line:
    ```java
    Token<?> conditionResult = parser.processExpression(getTokenGroups().get(0).getTokens(), context);
    ```
   Passes evaluation of the condition (the first token group) back to∫******** the parser for a result. We then check to see
   if the result is a BooleanToken, otherwise we'll throw an error. For example, defining ``1 + 1 ? 1 : 2`` would
   cause this error to be thrown. I've aggregated a few steps into the final line, but effectively we evaluate the
   result of the condition using Java's own ternary condition operator. In each scenario, we pass the relevant
   token group to the parser for evaluation and return the result in a list.
4. I've overridden the ``toString()`` here as it's useful to do this for debugging purposes. It makes the content
   of the token easier tor read.

Ok, let's add our new Token as a new token handler to the configuration:
```java
public class AardvarkConfig extends LARDConfig {
    //...
    @Override
    protected void initTokenHandlers() {
        //Literals
        addTokenHandler(new NullToken());
        addTokenHandler(new IntegerToken());
        addTokenHandler(new DecimalToken());
        addTokenHandler(new BooleanToken());        

        //Statements
        addTokenHandler(new ExpressionToken());
        addTokenHandler(new ConditionalToken());
    }
    //...
}
```
Let's try evaluating some conditionals:
```
3 > 4 ? 1 : 2
Result: 2 (Type: Integer, Time taken: 22ms)
4 > 3 ? 1 : 2
Result: 1 (Type: Integer, Time taken: 3ms)
1 + (3 * 2) > 9 - 2 ? 1 : 2
Result: 2 (Type: Integer, Time taken: 4ms)
```