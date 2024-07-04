---
sidebar_position: 2
---
# References
When strict syntax checking is enabled, all values outside of literals and static syntax are blocked by the lexer 
by default. This includes things like names assigned to variables, constants and functions. This is where the 
``ReferenceToken`` class can be used to store and represent these values. If no reference token is set then for 
the expression ``int i = 1;``, the error ``Unexpected token 'i' found in expression. Strict syntax checking is enabled`` 
will be returned. A class which is an extension of the ReferenceToken acts as a placeholder and associated with
the tokens to which they belong. Let's take a look at an example of one of these classes:
```java
@NoArgsConstructor
public class ValueRefToken extends ReferenceToken<String> {

    public ValueRefToken(String value) {
        super("Reference", value);
    }

    @Override
    public Token<String> createToken(String value) {
        return new ValueRefToken(value);
    }

    @Override
    public String getPattern() {
        return "^[A-Za-z0-9_]+";
    }

    @Override
    public Optional<String> getGuidance(String token, List<Integer> groupsCount) {
        return Optional.empty();
    }

    @Override
    protected List<Token<?>> process(LARFParser parser, LARFContext context, LARFConfig config) {
        return Collections.singletonList(this);
    }
}
```
It is a very simple class which defined a regular expression pattern. There is no need to set the PatternType as this
is set automatically in the parent class. In this case we want to match any value which is an alpha-numeric value in
an expression String. To add this class to the configuration, we use the ``setReferenceToken`` method:
```java
class MyConfig extends LARFConfig {
    //...
    @Override
    protected void initTokenHandlers() {
        //...
        setReferenceToken(new ValueRefToken());
    }
    //...
}
```
This now ensures all values outside of the list of configured literals and match the pattern are stored into this
token to be processed.