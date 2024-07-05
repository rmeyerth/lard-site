---
sidebar_position: 2
---
# Functions
Regardless of which language you use, it will likely provide some way to provide a callable block of code. These may differ in design
and capability but they generally follow the same principles:
1. They have a unique name within that namespace to call the function. Functions so long as they're made public or within scope can be
called from anywhere, even itself (Recursion).
2. They may have one or more values (parameters) passed in the header sectopm used within the body.
3. A keyword e.g. ``return myResult;`` can be used to return a literal or object
4. If you're creating a typed language then modifiers and return types may be specified
5. Can declare what would be thrown from the function if an error were to occur (checked).
Let's see an example of this in the Java language:
```java
public double divideNumbers(double a, double b) throws DivideByZeroException {
    if (b == 0)
        throw new DivideByZeroException("Cannot divide by zero");
    return a / b;
}
```
Let's get started on creating a new token to represent functions for a typeless langauge for simplicity:
```java
public class FunctionToken extends Token<Void> implements TokenParameters {

    public FunctionToken() {
        super("Function", null);
    }

    @Override
    public Token<Void> createToken(String value) {
        return cloneDefaultProperties(new FunctionToken());
    }

    @Override
    public PatternType getPatternType() {
        return PatternType.GRAMMAR;
    }

    @Override
    public String getPattern() {
        return "'func' val '(' ( val ','? )+ ')' ( [ throws ] )? [ singleLine, multiLine ]";
    }

    @Override
    public List<Token<?>> process(LARFParser parser, LARFContext context, LARFConfig config) { ... }

    @Override
    public List<Token<?>> process(LARFParser parser, LARFContext context, LARFConfig config, 
                                  List<Token<?>> providedParams) { ... }

    @Override
    public List<ErrorToken> getThrowsToken() { ... }                                  

    @Override
    public String getNameIdentifier() {
        return getTokenGroups().get(0).getFlatTokens().get(0).getValue(String.class);
    }

    @Override
    public boolean hasParserPriority() {
        return true;
    }

    @Override
    public VariableType getVariableType() {
        return VariableType.FUNCTION;
    }                                  
}
```
First thing to note is that we implement an interface specifically for parameter passing between tokens. This introduces some new
methods which we don't normally see when extending the standard Token class. I'll cover these below:
1. ``getThrowsToken()``: (Optional) This is used to return the ErrorToken captured by the equivalent ``throws`` token. This token
uses a special grammar value called ``error`` to capture each type of error thrown.
2. ``getNameIdentifier()``: This is the unique name in scope to identify the function. In the example I provided above this would
be ``divideNumbers``.
3. ``hasParserPriority()``: This overrides the default method from the base Token class which is usually set to false. When the 
parser first iterates through the mapped tokens, it calls the default ``process`` method. In most languages you are able to call a 
method from before you've encountered it. Otherwise you'd have to arrange all your methods in order which would be impractical. 
As such, this flag is used by the Parser to first scan through the list and execute these tokens so that they can be set in the 
context before any other line of code is run.
4. ``getVariableType()``: This is used for tracing purposes and allows the parser to identify these values correctly during runtime
in context as functions.

There is also one additional new method which is the new ``process`` method which accepts additional parameters. I will go into 
more details to describe exactly how the token works by providing examples of the ``{ ... }`` methods below.

First, let's look at the standard ``process`` method. This one gets called by the parser when it is first executed:
```java
    @Override
    public List<Token<?>> process(LARFParser parser, LARFContext context, LARFConfig config) {
        //Part 1
        if (getTokenGroups().size() != 4) {
            throw new ParserException(String.format("Expected four groups being 1) Function Name " +
                    "2) Parameters (if provided) 3) throws <error> (if provided) 4) Implementation. " +  
                    "Found only %d groups", getTokenGroups().size()));
        }
        //Part 2
        if (getTokenGroups().get(0).getFlatTokens().size() != 1) {
            throw new ParserException(String.format("Expected a single TokenValue for the function " + 
                    "name but found %d tokens provided", getTokenGroups().get(0).getTokenPosition()));
        }
        //Part 3
        String functionName = getTokenGroups().get(0).getFlatTokens().get(0).getValue().toString();
        context.set(functionName.concat(Integer.toString(getTokenGroups().get(1).getFlatTokens().size())),
                this, VariableType.FUNCTION);
        //Part 4
        return Collections.singletonList(config.getNullToken());
    }
```
- **Part 1**: First we check and validate that the four token groups are present
- **Part 2**: Next we perform a check to ensure that a name has been provided
- **Part 3**: We extract the function name from the token group and set the current token in context against that name. This is
so we can fetch it later on when that name is referenced in other tokens.
- **Part 4**: We return a simple null token as there is no result from this initial call used to insert the function into context.

Let's look at the ``process`` method which accepts parameters next:
```java
    public List<Token<?>> process(LARFParser parser, LARFContext context, LARFConfig config, 
                                  List<Token<?>> providedParams) {
        //Part 1
        String functionName = getTokenGroups().get(0).getFlatTokens().get(0).getValue().toString();
        List<Token<?>> paramVars = getTokenGroups().get(1).getFlatTokens();
        //Part 2
        if (paramVars.size() != providedParams.size()) {
            throw new ParserException(String.format("Function %s expected %d parameters, but only called " +
                    "with %d", functionName, paramVars.size(), providedParams.size()));
        }
        //Part 3
        for (int i = 0;i < paramVars.size();i++) {
            context.set(paramVars.get(i).getValue(String.class), providedParams.get(i), 
                        VariableType.PARAMETER);
        }
        //Part 4
        Token<?> result = parser.processExpression(getTokenGroups().get(3).getFlatTokens(), context);
        //Part 5
        if (!result.getParserFlags().isEmpty() && !result.getParserFlags().contains(ParserFlag.ERROR)) {
            //Unwrap result as we don't want to return token any further
            return Collections.singletonList(result.getValue() instanceof Token ?
                    (Token<?>)result.getValue() : new TokenValue(result.getValue()));
        }
        return Collections.singletonList(result);
    }
```
Firstly, let's mention how this token would be called. This would typically occur through the use of another token. In our case
we're goin to use another token called InvocationToken. This is simply used for 