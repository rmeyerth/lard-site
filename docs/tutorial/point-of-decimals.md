---
sidebar_position: 6
---
# Point of decimals
### Decimal Token
Decimals will be our second literal type that we'll add to our language. To do this let's start by creating a 
new DecimalToken.java class in the ``tokens.literals`` package. This will be defined as the following:
```java
public class DecimalToken extends Token<Double> {

    public DecimalToken() { super("Double", 0.0); }

    public DecimalToken(Double value) {
        super("Double", value);
    }

    @Override
    public PatternType getPatternType() {
        return PatternType.REGEX;
    }

    @Override
    public String getPattern() {
        return "^-?[0-9]+\\.[0-9]+";
    }

    @Override
    public Optional<String> getGuidance(String token, List<Integer> groupsCount) {
        return Optional.empty();
    }

    @Override
    public List<Token<?>> process(LARFParser parser, LARFContext context, LARFConfig config) {
        return Collections.singletonList(this);
    }

    @Override
    public Token<Double> createToken(String value) {
        return new DecimalToken(Double.parseDouble(value));
    }
}
```
The pattern is really the only thing is note here. Again we're defining an optional '-' character preceding the number,
followed by one or more numbers from 0 to 9 separated by a '.'. 

### Token Localisation
We could actually choose to make our language adhere to the rules of the country it is running in. For example, we 
could use the following:
```java
public class DecimalToken extends Token<Double> {
    //...
    @Override
    public String getPattern() {
        DecimalFormat df = (DecimalFormat) NumberFormat.getNumberInstance(Locale.getDefault());
        String n = df.format(1.1);
        return String.format("^-?[0-9]+\\%s[0-9]+", n.charAt(1));
    }
    //...
}
```
:::tip Customisation

LARF is completely customisable and most classes designed to be extensible or have their methods overridden. If you 
don't like the default behaviour, change it and do something crazy!

:::
For Aardvark, I'll omit any localisation to keep things simple. Let's add our new token to the config:
```java
public class AardvarkConfig extends LARFConfig {
    //...
    @Override
    protected void initTokenHandlers() {
        addTokenHandler(new NullToken());
        addTokenHandler(new IntegerToken());
        addTokenHandler(new DecimalToken());
    }
    //...
}
```
### Changes to the Type Operation Class
Now let's go back to our IntegerOperation class. The natural behaviour of Java as well as other languages is to stick
to the types being used in the operation. As such, when we do ``Integer <divide> Integer``, we get back an Integer even
if we wanted to keep precision. One solution to this to use a type that can handle both number formats and then cast 
the result to the desired type. Let's look back at the ``IntegerOperation.process`` method:

```java
public class IntegerOperation implements TypeOperation {
    //...
    @Override
    public Token<?> process(LARFConfig config, LARFContext context, Token<?> firstToken, OperatorHandler<?> operator,
                            Token<?> secondToken, Token<?> leftSide) {
      //Extract token values to BigDecimal
      BigDecimal first = new BigDecimal(firstToken.getValue(Integer.class));
      BigDecimal second = new BigDecimal(secondToken.getValue(Integer.class));
      //Check that operator is Arithmetic and handle each case using switch
      if (operator instanceof ArithmeticOperator) {
        switch (((ArithmeticOperator)operator).getOpType()) {
          case ADD: return wrap(first.add(second));
          case SUBTRACT: return wrap(first.subtract(second));
          case DIVIDE: return wrap(first.divide(second, 6, RoundingMode.HALF_UP));
          case MULTIPLY: return wrap(first.multiply(second));
          case MODULO: return wrap(first.remainder(second));
        }
      }
      //Fallback
      return handleCustomOperator(firstToken, operator, secondToken);
    }

    private Token<?> wrap(BigDecimal result) {
        return result.stripTrailingZeros().scale() >= 0 ?
            new DecimalToken(result.doubleValue()) :
            new IntegerToken(result.intValue());
    }
}
```
The following changes have made the code a lot more capable at the cost of some complexity. Firstly both Integer values
are cast to BigDecimal. This presumes that all operations have the possibility to spit out a remainder value. We've also
changed the behaviour of our wrap method to check if the result has a remainder and return the appropriate type. 
Let's try our runner again:
```
-10 / 3
Result: -3.333333 (Type: Double, Time taken: 11ms)
3 * 10
Result: 30 (Type: Integer, Time taken: 1ms)
6 / 4
Result: 1.5 (Type: Double, Time taken: 1ms)
5 + 3 / 2
dev.larf.exception.ParserException: No handler for type operation with arguments of type IntegerToken and DecimalToken found.
	at dev.larf.parser.LARFParser.processOp(LARFParser.java:317)
	at dev.larf.parser.LARFParser.replaceCalcsInfix(LARFParser.java:382)
	at dev.larf.parser.LARFParser.lambda$processExpression$0(LARFParser.java:74)
	at java.base/java.util.Spliterators$ArraySpliterator.forEachRemaining(Spliterators.java:948)
	at java.base/java.util.stream.ReferencePipeline$Head.forEach(ReferencePipeline.java:658)
	at dev.larf.parser.LARFParser.lambda$processExpression$1(LARFParser.java:74)
	at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:183)
	at java.base/java.util.stream.SortedOps$SizedRefSortingSink.end(SortedOps.java:357)
	...
```
### Making our Type Operation more Generic
This is where things turn a bit interesting. Firstly, we can now see that it is casting to either a Double or Integer
depending on the calculation. However, we get an error when try something a bit more complex. This is because the
result of ``3 / 2`` is 1.5. The next parser operation (given our use of BODMAS) will be 5 + 1.5 which we don't yet
support. Don't worry, I'm not going to recommend creating an operation class for every possible type pairing as we can
make life easier for ourselves. Firstly, I'm going to rename IntegerOperation to NumericOperation:
```java
public class NumericOperation implements TypeOperation {

    @Override
    public boolean canHandle(Token<?> first, OperatorHandler<?> operator, Token<?> second) {
        try {
            if (Objects.isNull(first.getValue()) || Objects.isNull(second.getValue())) return false;
            new BigDecimal(first.getValue().toString());
            new BigDecimal(second.getValue().toString());
            return true;
        } catch (NumberFormatException ex) {
            return false;
        }
    }    
    //...
}
```
Secondly I've modified the operations canHandle method. The BigDecimal class is quite adept at handling any number of
different types, so it useful as a handler in this scenario. If whatever the token value is can be parsed then it means
we can handle it, otherwise we'll return false and defer to other operation classes.

Let's load up our runner once more:
```
-10 / 3
Result: -3.333333 (Type: Double, Time taken: 11ms)
3 * 10
Result: 30 (Type: Integer, Time taken: 1ms)
6 / 4
Result: 1.5 (Type: Double, Time taken: 1ms)
5 + 3 / 2
Result: 6.5 (Type: Double, Time taken: 4ms)
```
Perfect! What happens though if we want to resolve 5 + 3 before dividing by 2? Well, this would be achieved using
parentheses and will be the perfect introduction to statements. It will also be our first introduction to defining a
token using grammar as opposed to regular expressions.

Up until now, the tokens we've created have all represented types. Null, Decimal, Integer etc. Now we're
going to define one whose sole purpose is to perform a task based on one or more tokens, or more accurately groups of 
tokens, passed to it by the lexer. These groups are defined in the token's grammar. Don't worry if this all sounds 
pretty confusing, as it will become more explanatory by showing you in the next section.