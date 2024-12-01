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
SLOP follows the typical form of error handling where errors / exceptions can be thrown. As such, the next step
is to create a token to handle this:
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
    public PatternType getPatternType() {
        return PatternType.GRAMMAR;
    }

    @Override
    public String getPattern() {
        return "'throws' ( error ','? )+";
    }

    @Override
    public Optional<String> getGuidance(String token, List<Integer> groupsCount) {
        return Optional.empty();
    }

    @Override
    protected List<Token<?>> process(LARFParser parser, LARFContext context, LARFConfig config) {
        return null;
    }

    @Override
    public List<ErrorHandler<?>> getErrorHandlers() {
        return null;
    }

    @Override
    public List<String> getErrorTypes() {
        return getErrorTypes(0);
    }
}
```
This extends the class ``ErrorToken`` which provides functionality to handle error types. 