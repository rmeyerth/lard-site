---
sidebar_position: 10
---
# Error Handling
![Error Handling](/img/error.jpg)
:::tip Example Source
For this section, I am going to use the SLOP language implementation to show how errors are handled. You can
check out the full SLOP source code and its error handling code [here](https://www.gitlab.com/tronied/slop).
:::
Handling errors is a maintstay of any language. This allows developers not just the ability to throw and handle 
their own errors, but also provide traceability as to where the issue occurred and how to resolve it. The majority 
of languages have two basic types of error, known as exceptions in Java, that can be thrown. The first of these is 
a checked error which requires it to be declared or handled by methods / resources moving up the call hierarchy. 
The second (unchecked) means no declaration needs to take place, but hides which errors may be thrown in the body
of code being executed. This section will look at how we would implement not just these types of error,
but also how we can handle and throw our own types of error in a language we create.
### Native Errors
Before we move onto defining custom errors, types and handling them, it is worth addressing that LARF has the 
ability to catch and interpret native errors and propagate them as errors into your language. This may sound
confusing as to why you'd want to do this, but let's take a look at the following:
```
func aMethod(a) {
    //Will throw a divide by 0 error
    return a / 0;
}

return aMethod(4);
```
We could in fact write a bunch of custom errors to handle these scenarios in our type operation classes, but 
since these errors are already being thrown by the underlying language (Java), why not use them? To do this
we can extend one of the following classes found within LARF:
- StandardErrorHandler
- ResourceErrorHandler
- NetworkErrorHandler
- ThreadErrorHandler
- TypeErrorHandler
Each of these has a set of native error mappings. For example, if we wanted to handle the above scenario within
our langauge, we could write the following class:
```java
public class SLOPStandardErrorHandler extends StandardErrorHandler {

    public SLOPStandardErrorHandler(String name) {
        super(name);
    }

    @Override
    public void initErrorHandlers() {
        addErrorMapping("ArithmeticError", StandardError.ARITHMETIC);
    }
}
```
Here we are assigning a specific language name to the arithmetic error type which would be thrown in the case of
a division by 0. These error handler mappings can be registered in the configuration class under the ``initErrorHandler``
method:
```java
@Override
protected void initErrorHandlers() {
    addErrorHandler(new SLOPStandardErrorHandler(null));
}
```
Now, if we run the above code we will find we get the following error thrown in our language:
```
Unhandled ArithmeticError: / by zero (Mapped JVM Error)
=======================================================
Operation: 4 / 0
SLOP Trace:
  at Default.aMethod(Expression:3)
  at Default.None(Expression:6)
JVM Trace:
  at java.math.BigDecimal.divideAndRound(BigDecimal.java:4955)
  at java.math.BigDecimal.divide(BigDecimal.java:6028)
  at java.math.BigDecimal.divide(BigDecimal.java:1653)
  at java.math.BigDecimal.divide(BigDecimal.java:1683)
  at dev.larf.languages.slop.src.operations.NumericOperation.process(NumericOperation.java:63)
  at dev.larf.operations.TypeOperation.processOperation(TypeOperation.java:49)
  at dev.larf.parser.LARFParser.processOp(LARFParser.java:443)
  at dev.larf.parser.LARFParser.processExpression(LARFParser.java:151)
  at dev.larf.languages.slop.src.tokens.statements.SingleLineToken.process(SingleLineToken.java:54)
  at dev.larf.tokens.Token.processNoParams(Token.java:249)
```
You can see we have two stack traces with one for our code and the second for the JVM. If you want to only show the
in-language trace then we can simply disable this by setting ``showNative = false`` in the constructor of our
error handler:
```java
public class SLOPStandardErrorHandler extends StandardErrorHandler {

    public SLOPStandardErrorHandler(String name) {
        super(name);
        showNative = false;
    }
    
    //...
}
```
Using this approach can save a lot of time as opposed to having to define your own each each scenario. The name 
mappings e.g. ``AritheticError`` above can be used to throw your own errors of these types within your language.
These errors by default are unchecked and will not need to be caught.
### Custom Errors
First we need to define the names for each type of error we want to represent in our language. We do this by
creating a class which extends the ``NativeErrorHandler``. This only has one method which it is required to 
overwrite which is the ``initErrorHandlers`` as can be seen below:
```java
public class SLOPNativeErrorHandler extends NativeErrorHandler {

    public SLOPNativeErrorHandler(String name) {
        super(name);
    }

    @Override
    public void initErrorHandlers() {
        addErrorMapping("Error", NativeError.CHECKED);
        addErrorMapping("RunError", NativeError.UNCHECKED);
    }
}
```
In the case above we're assigning ``Error`` to checked errors and ``RunError` to unchecked errors. We can now
add this along with our standard error handler in our configuration:
```java
@Override
protected void initErrorHandlers() {
    addErrorHandler(new SLOPStandardErrorHandler(null));
    addErrorHandler(new SLOPNativeErrorHandler(null));
}
```
SLOP follows the typical form of error handling where errors / exceptions can be thrown. As such, let's perform
the next step logical step and define a token to handle these:
```java
public class ThrowsToken extends ErrorToken {

    public ThrowsToken() {
        super("throws", ErrorAction.THROWS);
    }

    @Override
    public Token<Void> createToken(String value) { 
        return cloneDefaultProperties(new ThrowsToken());
    }

    @Override
    public PatternType getPatternType() { return PatternType.GRAMMAR; }

    @Override
    public String getPattern() { return "'throws' ( error ','? )+"; }

    @Override
    public Optional<String> getGuidance(String token, List<Integer> groupsCount) { 
        return Optional.empty(); 
    }

    @Override
    protected List<Token<?>> process(LARFParser parser, LARFContext context, LARFConfig config) { 
        return null; 
    }

    @Override
    public List<ErrorHandler<?>> getErrorHandlers() { return null; }

    @Override
    public List<String> getErrorTypes() { return getErrorTypes(0); }
}
```
This extends the class ``ErrorToken`` which provides functionality to handle error types. It's sole purpose as can 
be seen from the pattern is to define error types. You'll notice that errors have their own grammar keyword. This is so
that when an error in your language is declared, it is assigned to the parent type ``ErrorHandler<T>`` and can
be handled accordingly in grammar and elsewhere for special cases. The ``getErrorTypes`` method returns these references 
to be used for things like error validation. This is so that if the code contained within the token to which this 
``throws`` token is associated (typically a Function variant) and a checked exception is being thrown by any children 
but not declared, an error will be thrown. Following normal operation, all checked exceptions must be declared if one 
is thrown downstream. You'll also see that we've declared the name of our token throws 
(``super("throws", ErrorAction.THROWS);``) in the constructor. We'll see that used in a single grammar reference in the 
grammar of our next token:
```java
public class FunctionToken extends Token<Void> implements TokenParameters {

    //...

    @Override
    public String getPattern() {
        return "'func' val '(' ( val ','? )+ ')' ( [ throws ] )? [ singleLine, multiLine ]";
    }

    //...

    public List<Token<?>> process(LARFParser parser, LARFContext context, LARFConfig config, 
                                  List<Token<?>> providedParams) {
        String functionName = getTokenGroups().get(0).getFlatTokens().get(0).getValue().toString();
        List<Token<?>> paramVars = getTokenGroups().get(1).getFlatTokens();
        if (paramVars.size() != providedParams.size()) {
            throw new ParserException(String.format("Function %s expected %d parameters, but only " +
                    "called with %d", functionName, paramVars.size(), providedParams.size()));
        }
        for (int i = 0;i < paramVars.size();i++) {
            context.set(paramVars.get(i).getValue(String.class), providedParams.get(i), 
                    VariableType.PARAMETER);
        }
        Token<?> result = parser.processExpression(getTokenGroups().get(3).getFlatTokens(), context);
        if (!result.getParserFlags().isEmpty() && !result.getParserFlags()
                    .contains(ParserFlag.ERROR)) {
            //Unwrap result as we don't want to return token any further
            return Collections.singletonList(result.getValue() instanceof Token ?
                    (Token<?>)result.getValue() : new TokenValue(result.getValue()));
        }
        return Collections.singletonList(result);
    }

    @Override
    public List<ErrorToken> getThrowsToken() {
        return getTokenGroups().get(2).getFlatTokens().stream()
                .filter(t -> t instanceof ErrorToken)
                .map(ErrorToken.class::cast)
                .filter(t -> t.getErrorAction() == ErrorAction.THROWS)
                .collect(Collectors.toList());
    }

    //...
}
```
I have covered the implementation of the FunctionToken elsewhere [here](./tokens/functions.md), so instead have just
left the methods relevant to error handling. First, you'll notice the reference to our ThrowToken in the grammar e.g.
``( [ throws ] )?``. This declares that the token may appear here, but is not guaranteed. This follows the typical
pattern where you can declare the following:
```
func myFunc(a,b,c) throws SimpleError {
    //...
}
```
:::tip Error Checking Limitation

Currently the handling for validating checked errors happens within the main Token class. This is hardcoded using a
private method in the class. Given this is not ideal and goes against open nature of the framework, I am looking to 
move this into a more dedicated error handling class where you can override this behaviour if you so wish.

:::

 This will allow our checked exceptions to be validated, but let's define a way to handle these within our functions.
 For that we'll create the next class which is TryCatchToken:
 ```java
public class TryCatchToken extends ErrorToken {

    public TryCatchToken() {
        super("Try-Catch", ErrorAction.CATCH);
    }

    public Token<Void> createToken(String value) {
        return cloneDefaultProperties(new TryCatchToken());
    }

    @Override
    public PatternType getPatternType() {
        return PatternType.GRAMMAR;
    }

    @Override
    public String getPattern() {
        return "'try' [ singleLine, multiLine ] 'catch' '(' error ')' [ singleLine, multiLine ]";
    }

    @Override
    public Optional<String> getGuidance(String token, List<Integer> groupsCount) {
        return Optional.empty();
    }

    @Override
    protected List<Token<?>> process(LARFParser parser, LARFContext context, LARFConfig config) {
        Token<?> result = parser.processExpression(getTokenGroups().get(0).getFlatTokens(), context);
        if (result.getParserFlags().contains(ParserFlag.ERROR)) {
            Token<?> variableToken = getTokenGroups().get(1).getFlatTokens().get(0);
            context.set(variableToken.getValue().toString(), result);
            return Collections.singletonList(parser.processExpression(
                    getTokenGroups().get(2).getFlatTokens(), context));
        }
        return Collections.singletonList(result);
    }

    @Override
    public List<ErrorHandler<?>> getErrorHandlers() {
        return null;
    }

    @Override
    public List<String> getErrorTypes() {
        return getErrorTypes(1);
    }
}
 ```
 Let's first look at the pattern:
 ```
 'try' [ singleLine, multiLine ] 'catch' '(' error ')' [ singleLine, multiLine ]
 ```
 First we start out with the 'try' syntax and then have a branching path for either a single or multi-line
 code block. We next have a 'catch' word and then a pair of brackets which contain a single ``error``. This
 could be modified to handle multiple errors by changing the pattern to ``'(' ( error )+ ')' ``. We then
 finish off with another single or multi-line definition. Let's now look at the ``process`` method
 definition. First we process the content of the first code block and get the result. We then check the
 result to see if it contains the ERROR parser flag. If it is then we know an error has been thrown.

 We then store the active error to context and then process the error token by the parser. The current 
 implementation uses this ``activeError`` stored into context...

:::danger Under Construction

Unfortunately this page hasn't been completed yet. Work is under way to complete the rest of the site and will be updated
as soon as possible.

:::

![Work in Progress](/img/work-in-progress.jpg)