---
sidebar_position: 2
---
# Instances
### Introduction
Token instances provide a route to implement and represent types (custom objects) within your language. It is important
to understand that no strict type handling is written into LARF itself, instead it provides this interface to act as a 
guide when implementing your own type system. You are free to implement your own approach should you wish, but this guide 
will take you through the steps to make use of the TokenInstance interface.

### Adding Types to your Language
Firstly let's create a class which extends not only the standard Token class but also implements the TokenInstance 
interface. An example of this can be seen below:
```java
public class MyTypeToken extends Token<Token<?>> implements TokenInstance {

    //Standard Token Methods
    //...

    @Override
    public PatternType getPatternType() {
        return PatternType.GRAMMAR;
    }

    @Override
    public String getPattern() {
        return "'type' val:String ( '(' ( val:String ','? )+? ')' )? ( '<-' val:String )? [ multiLine ]";
    }    

    @Override
    public Token<?> createInstance(LARFParser parser, LARFContext context, LARFConfig config, 
                                   String typeName) { ... }    

    @Override
    protected List<Token<?>> process(LARFParser parser, LARFContext context, LARFConfig config) {
        while (getTokenGroups().size() < 4) getTokenGroups().add(new TokenGroup());
        if (!getTokenGroups().get(1).getFlatTokens().isEmpty() &&
                !getContainedTokensOfType(getTokenGroups().get(3), "Constructor").isEmpty()) {
            throw new ParserException("Found both type param definitions and constructors. The current " +
                    "type implementation only supports one at a time.");
        }
        if (getTokenGroups().get(0).getFlatTokens().size() != 1) {
            throw new ParserException(String.format("Expected a single TokenValue for the function name " + 
                    "but found %d tokens provided", getTokenGroups().get(0).getTokenPosition()));
        }
        String typeName = getTokenGroups().get(0).getFlatTokens().get(0).getValue().toString();

        context.set(typeName, this, VariableType.PROTOTYPE);
        return Collections.singletonList(new NullToken());
    }                                   

    @Override
    public List<Token<?>> process(Token<?> source, LARFParser parser, LARFContext context, LARFConfig config, 
                                  String target, List<Token<?>> params) { ... }

    @Override
    public String getTypeName() { ... }    

    @Override
    public List<String> getDependencies() { ... }    

}
```
This may look confusing at first, but let's break each each part. Firstly let's look at the pattern:
1. ``'type'``: This denotes that any type definition has to begin with the ``type`` keyword.
2. ``val:String``: A single capture group is expected for the name that is to be associated with the type e.g. MyType
3. ``( ... )?``: An optional capture group for the class parameters
4. ``'(' ( val:String ','? )+? ')'``: A pair of brackets surrounding an optional token group containing one or more
String values separated by commas. Since this is being written for a typeless language, we are only expecting a name
to be provided rather than a typed value. If you are defining a typed language then you could point the parameter 
implementation using a grammar reference if you've defined one. For example, if I had a Token called TypedVariableToken
with a name defined as typedVariable, you could use ``'(' ( [ typedVariable ] ','? )+? ')'``. For our original typeless 
case, an example of this would be ``(a,b,c)``. For a typed variant an example would be ``(int a, String b, double c)``.
5. ``( '<-' val:String )?``: An optional token group expecting a ``<-`` fixed value with a String identifying the
type that is the parent. 
6. ``[ multiLine ]``: Finally we define the body of the type which we suppose would contain one or more lines found 
between two delimiters or keywords e.g. ``{ line1; line2; ... }``.
A full example for the above pattern would be:
```java
type MyType(a,b,c) {
    //Other tokens...
}
```
This is similar to the ``record`` in Java where you can define a class and it's values using the list of parameters.
Next let's look at the ``process`` method. The majority of it is dedicated to the validation of the token groups and their
content. For example, the first checks to see if any type parameters have been passed, but if a constructor has also been
defined then an error will be thrown stating that you can't use both constructors and type parameters. The second check
just ensures that a name has been specified for the type. The following two lines are crucial:
```java
        String typeName = getTokenGroups().get(0).getFlatTokens().get(0).getValue().toString();

        context.set(typeName, this, VariableType.PROTOTYPE);
```
The first retrieves the name of the type stored in the first token group e.g. MyType. This is used as the unique identifier
for this type in context. It is also registered as a ``VariableType.PROTOTYPE`` which means there can only ever be one. From
this other versions can be cloned, but a prototype is essentially the blueprint for the type as defined in the code.

In addition to the standard Token methods, there are several new methods that our new TypeToken class must implement:
- **createInstance**: Gets called by another token when a request to create a new object is triggered. The class from
which this is triggered will typically be a token that uses a keyword to trigger off this action e.g. 
``new CustomObject(...);``. This will be described in a later [section](instances.md#invoking-creation-from-a-defined-type) on this page.
- **process**: An overloaded variant of the process method which accepts a target and list of parameters. This can be 
used when targetting a specific child resource on the object instance e.g. a method.
- **getTypeName**: Returns the unique identifier of the current object to store in context
- **getDependencies**: Provides a list of references to other type instances which this class extends / inherits.

### Creating a Typed Object
Now that we've got the shell of our type token defined, the next thing we'll want is a way to create an instance of that
type in our language. This is typically done with a keyword and for this example will be copying the Java ``new`` keyword.
For this, we'll create a new CreateTypeToken class with the following definition:
```java
public class CreateTypeToken extends Token<Token<?>> {

    public CreateTypeToken() {
        super("createType", null);
    }

    @Override
    public Token<Token<?>> createToken(String value) {
        return cloneDefaultProperties(new CreateTypeToken());
    }

    @Override
    public PatternType getPatternType() {
        return PatternType.GRAMMAR;
    }

    @Override
    public String getPattern() {
        return "'new' val:String '(' ( expr ',' )+ ')'";
    }

    @Override
    public Optional<String> getGuidance(String token, List<Integer> groupsCount) {
        if (token.equalsIgnoreCase("("))
            return Optional.of("A new keyword requires an open bracket to be defined for the parameter list " +
                    "e.g. new MyType (<-- a, b, c )");
        if (token.equalsIgnoreCase(")"))
            return Optional.of("A new keyword requires a closing bracket to be defined for the parameter list " +
                    "e.g. new MyType ( a, b, c )<--");
        return Optional.empty();
    }    

    @Override
    protected List<Token<?>> process(LARFParser parser, LARFContext context, LARFConfig config) { }
}
```
Given the pattern of our new Token, this means you can create new instances for a given type using ``new CustomType(...)``. If you're
not that familiar with grammar though, let's break it down to explain what is happening:
1. ``'new'``: A fixed ``new`` keyword to uniquely identify this token
2. ``val:String``: A single token capture group which is of String type. This means we're expecting a name to be specified and it will
throw an error if another Token or statement is provided.
3. ``'('``: A fixed open bracket to denote the start of the list of parameters that is passed to the constructor of the type being 
targetted. This could differ depending on your type implementation.
4. ``( expr ',' )+``: A repeatable group containing a capture group for one or more tokens separated by commas. This would allow us to
invoke the Token with ``new MyType(1 + 1,5,6)``. If you used only val (single capture group) then only single value parameters would be
allowed.
5. ``')'``: A fixed closing brace for the end of the parameter list passed to the constructor of the type.
Another point to note in the CreateTypeToken implementation is the ``getGuidance`` method. This is catching two scenarios where they have
defined a new token but are missing either the start or end of the brackets for the list of parameters.