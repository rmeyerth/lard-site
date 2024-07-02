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
    protected List<Token<?>> process(LARFParser parser, LARFContext context, LARFConfig config) {
        while (getTokenGroups().size() < 4) getTokenGroups().add(new TokenGroup());
        if (getTokenGroups().get(0).getFlatTokens().size() != 1) {
            throw new ParserException(String.format("Expected a single TokenValue for the function name " + 
                    "but found %d tokens provided", getTokenGroups().get(0).getTokenPosition()));
        }
        String typeName = getTokenGroups().get(0).getFlatTokens().get(0).getValue().toString();

        context.set(typeName, this, VariableType.PROTOTYPE);
        return Collections.singletonList(new NullToken());
    }    

    //Will define the below later...

    @Override
    public Token<?> createInstance(LARFParser parser, LARFContext context, LARFConfig config, 
                                   String typeName) { ... }                                     

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
Next let's look at the ``process`` method. The first part is dedicated to the validation of the token groups and their
content. It just checks to ensure that a name has been specified for the type. The next two lines are key:
```java
String typeName = getTokenGroups().get(0).getFlatTokens().get(0).getValue().toString();

context.set(typeName, this, VariableType.PROTOTYPE);
```
The first retrieves the name of the type found in the first capture group e.g. MyType. This is used as the unique identifier
for this type in context. It is also registered as a ``VariableType.PROTOTYPE`` which means there can only ever be one. From
this other versions can be cloned, but a prototype is essentially the blueprint for the type as defined in the code.

In addition to the standard Token methods, there are several new methods that our new TypeToken class must implement. An
example of each will be defined later but for now I'll briefly describe what these methods do:
- **createInstance**: Gets called by another token to invoke an instance of this type in the language. The token class from
which this is triggered will typically use a keyword e.g. ``new`` to trigger off this action. This will be described in a 
later [section](instances.md#invoking-creation-from-a-defined-type) on this page.
- **process**: An overloaded variant of the process method which accepts a target and list of parameters. This can be 
used when targetting a specific child resource on the object instance e.g. a method.
- **getTypeName**: Returns the unique identifier of the current object to store in context
- **getDependencies**: Provides a list of references to other type instances which this class extends / inherits.

### Triggering Token Creation
Now that we've got the shell of our type token defined, the next thing we'll want is a way to create an instance of that
type in our language. For this example we'll be copying Java's implementation and using the ``new`` keyword. For this, we'll 
create a new CreateTypeToken class with the following definition:
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

Now that we have both tokens to create an instance of a type and the token class used to represent the type itself, it's time to start
linking them up together. Let's start with writing the ``process`` method on the CreateTypeToken. I'll break this into multiple sections
as there are a few things we need to do:
```java
@Override
protected List<Token<?>> process(LARFParser parser, LARFContext context, LARFConfig config) {
    //Validate values found in capture groups    
    String name = getTokenGroups().get(0).getFlatTokens().get(0).getValue(String.class);
    if (!context.getPrototypes().contains(name)) {
        throw new ParserException("No registered type found with the name " + name);
    }
    Token<?> result = (Token<?>) context.getContextObject(name);
    if (Objects.isNull(result) || !(result instanceof MyTypeToken)) {
        throw new ParserException(String.format("Target type '%s' is null or not a MyTypeToken!",
                result.getClass().getSimpleName()));
    }
    Token<?> clonedToken = ((TypeToken)result).createInstance(parser, context, config, name);
    //...
}
```
The first step is to verify the values we find in the capture group. First we'll verify that the first capture group (type name) is a String. 
This should be enforced by the Lexer, but it never hurts to put in your own validation. Next, we'll retrieve our type from context. We did
this earlier on with the ``context.set(typeName, this, VariableType.PROTOTYPE);``. The next check simply verifies that it is not null and is
the same type as our type token class. Finally, we invoke the ``createInstance`` method on our type token class and whose responsibility it 
is to create a new instance of itself. If you wish to see the implementation of that method, please see the [Creating an Instance](instances.md#creating-a-clone).

Let's now take a look at the second part to the ``process`` method:
```java
protected List<Token<?>> process(LARFParser parser, LARFContext context, LARFConfig config) {
    //...
    try {
        //Part 1        
        parser.tokenStart(clonedToken);
        if (getTokenGroups().size() > 1 && !getTokenGroups().get(1).getTokens().isEmpty()) {
            //Part 2
            List<Token<?>> actualParams = getTokenGroups().get(1).getTokens().stream()
                    .map(tg -> {
                        if (tg instanceof TokenGroup)
                            return parser.processExpression(((TokenGroup)tg).getTokens(), context);
                        return tg;
                    }).collect(Collectors.toList());
            List<Token<?>> expectedParams = result.getTokenGroups().get(1).getFlatTokens();
            //Part 3
            if (actualParams.size() != expectedParams.size()) {
                throw new ParserException(String.format("Could not invoke default type constructor as " +
                                "parameter requirement not met. Found %d instead of expected %d", 
                        getTokenGroups().get(1).getTokens().size(),
                        result.getTokenGroups().get(1).getTokens().size()));
            }
            //Part 4
            for (int i = 0; i < expectedParams.size(); i++) {
                context.set(expectedParams.get(i).getValue(String.class), actualParams.get(i).getValue());
            }
        }
    } finally {
        parser.tokenEnd(clonedToken, false);
    }
    //Part 5
    clonedToken.setVariableType(VariableType.INSTANCE);
    return Collections.singletonList(clonedToken);
}
```
There is quite a lot going on here in this second section. I've broken in down into parts (see comments) and will describe it below:
- **Part 1**: Firstly we wrap the entire next stage in a ``try...finally`` with a ``parser.startToken(clonedToken);`` and matching ``parse.tokenEnd(clonedToken, false);``.
This part is important as this tells the parser to keep the instance and it's resources in scope. These are invoked traditionally by the
parser itself to manage scope and cleanup resources of tokens after completion. Here though we're artificially calling it to ensure 
that the instance is added and kept part of the runtime stack. The ``tokenEnd(..., false);`` informs the parser not to clean up associated
resources upon completion. The next if block only executes the main code-block if parameters are present.
- **Part 2**: This fetches not only the parameter values passed to our CreateTypeToken e.g. ``new MyType(1,2,3)`` but also the expected
parameters from our original type definition e.g. ``type MyType(a,b,c) { ... }``. From this we'll have both our parameters ``[1,2,3]``
and the expected ``[a,b,c]``.
- **Part 3**: This verifies that the expected and provided parameters match. If not then we throw a runtime error as the parameter
requirement was not met.
- **Part 4**: We loop through the expected parameters and add each into context. Each of these will be associated with our new instance.
- **Part 5**: Finally we set the type of token to ``VariableType.INSTANCE`` and return it.

### Creating a Clone
Let's look at the implementation of the ``createInstance`` method in our MyTypeToken class now:
```java

```