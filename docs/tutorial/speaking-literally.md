---
sidebar_position: 2
---
# Speaking literally
### Integer Token
So, we've got a language that only contains null. Let's move on to adding numbers so that we can start to think
about resolving some basic calculations. For this we'll need to add a new token for Integers. Create a new token
called IntegerToken in your project ``tokens.literals`` folder and define the following:
```java
public class IntegerToken extends Token<Integer> {

    public IntegerToken() { super("Integer", 0); }

    public IntegerToken(Integer value) { super("Integer", value); }

    @Override
    public PatternType getPatternType() {
        return PatternType.REGEX;
    }

    @Override
    public String getPattern() {
        return "^-?[0-9]+";
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
    public Token<Integer> createToken(String value) {
        return new IntegerToken(Integer.parseInt(value));
    }
}
```
### Regular Expression Explanation
This follows a very similar structure to the NullToken, but with a different regular expression pattern declared. In
this case we are declaring the starts with '^' character, followed by '-' (minus character), followed by a '?' which
makes the preceding character optional. Next we define a list of possible characters in a group to match. In this case
we want to match numeric digits in a String between 0 up to 9. The final '+' means we can have one or more of those.
Using this pattern we can define the full range of positive and negative integer values.

We've also added an overloaded version of the constructor which accepts an Integer value. This is because the Integer
token deviates from the null as its value is mutable and can be set. It is actually used from the ``createToken``
method by converting the value from the expression String. So long as we've got the defined regular expression right,
we should have no conversion issues.

Again, let's add this to our configuration class:
```java
public class AardvarkConfig extends LARDConfig {
    //...
    @Override
    protected void initTokenHandlers() {
        addTokenHandler(new NullToken());
        addTokenHandler(new IntegerToken());
    }
    //...
}
```
### Numbers but...
Launch our runner app and...
```
Aardvark Language Test Utility
==============================
-10
Result: -10 (Type: Integer, Time taken: 19ms)
10
Result: 10 (Type: Integer, Time taken: 1ms)
```
We now have simple Integer support in our language. Let's try to do a basic calculation:
```
10 + 10
dev.lard.exception.ParserException: Unexpected token '+' found in expression. Strict syntax checking is enabled
	at dev.lard.lexer.LARDLexer.analysePatterns(LARDLexer.java:98)
	at dev.lard.lexer.LARDLexer.tokenize(LARDLexer.java:57)
	at dev.lard.lexer.Lexer.tokenize(Lexer.java:49)
	at dev.lard.processor.LARDProcessor.process(LARDProcessor.java:82)
	at dev.lard.runner.LARDRunner.run(LARDRunner.java:39)
	at dev.lard.runner.LARDRunner.run(LARDRunner.java:10)
	at dev.lard.runner.Application.main(Application.java:10)
```
You knew it wasn't going to be that simple. Move onto the next section to learn about operators.