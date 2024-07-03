---
sidebar_position: 2
---
# Instances
:::tip Type System Suggestion

This section covers the implementation of one possible route for a type system created using LARF. Type support was purposefully
left ambigious to prevent the authors ideas of how types should operate and interfere with your own type ambitions. As such
although the following represents one approach, this is not the only way you can approach it and is merely here as a 
guide for you to get started.

:::
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
        return "'type' val:String ( '(' ( val:String ','? )+? ')' )? ( '<-' val:String )? "+
                    "[ multiLine ]";
    }      

    @Override
    protected List<Token<?>> process(LARFParser parser, LARFContext context, LARFConfig config) {
        while (getTokenGroups().size() < 4) getTokenGroups().add(new TokenGroup());
        if (getTokenGroups().get(0).getFlatTokens().size() != 1) {
            throw new ParserException(String.format("Expected a single TokenValue for the " +
                    "function name but found %d tokens provided", 
                    getTokenGroups().get(0).getTokenPosition()));
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
    public List<Token<?>> process(Token<?> source, LARFParser parser, LARFContext context, 
                                  LARFConfig config, String target, List<Token<?>> params) 
                                  { ... }

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
            return Optional.of("A new keyword requires an open bracket to be defined for the " +
                    "parameter list e.g. new MyType (<-- a, b, c )");
        if (token.equalsIgnoreCase(")"))
            return Optional.of("A new keyword requires a closing bracket to be defined for " +
                    "the parameter list e.g. new MyType ( a, b, c )<--");
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
linking them up together. Let's start with writing the ``process`` method on the CreateTypeToken. I'll break this into two sections
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
                throw new ParserException(String.format("Could not invoke default type " +
                                " constructor as parameter requirement not met. Found " + 
                                "%d instead of expected %d", 
                        getTokenGroups().get(1).getTokens().size(),
                        result.getTokenGroups().get(1).getTokens().size()));
            }
            //Part 4
            for (int i = 0; i < expectedParams.size(); i++) {
                context.set(expectedParams.get(i).getValue(String.class), 
                    actualParams.get(i).getValue());
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
Before we dive in, let's remind ourselves about the token groups and what they represent in the pattern:
```
'type' val:String ( '(' ( val:String ','? )+? ')' )? ( '<-' val:String )? [ multiLine ]
```
Token Groups (0-indexed):

0. ``val:String`` = The name of the type
1. ``( '(' ( val:String ','? )+? ')' )?`` = An optional bracketed list of parameters passed to the type
2. ``( '<-' val:String )?`` = An optional ``<-`` notation used for extending other types e.g. ``type MyType <- ParentType``.
3. ``[ multiLine ]`` = A multi-line code block

Using this, let's look at the implementation of the ``createInstance`` method in our MyTypeToken class called from the CreateTypeToken 
``process`` method. This is the longest of our methods and as such I'll split the description into three sections. This is because we first 
need to identify type dependencies (for inheritance), copy across those resources to a temporary body group and then set the correct scope 
and modifiers before storing to context. Let's look at the first part:
```java
@Override
public Token<?> createInstance(LARFParser parser, LARFContext context, LARFConfig config) {
    //Part 1
    TypeToken clonedToken = (TypeToken) clone();
    List<Token<?>> dependencies = new ArrayList<>();
    for (String dependency : clonedToken.getDependencies()) {
        //Part 3
        config.getErrorHandlers().stream()
                .filter(eh -> eh.canHandle(dependency))
                .findFirst()
                .ifPresent(l -> 
                    clonedToken.setValue(getTokenGroups().get(2).getFlatTokens().get(0)));
        //Part 4
        if (Objects.isNull(clonedToken.getValue())) {
            Object found = context.getContextObject(dependency);
            if (Objects.isNull(found)) {
                throw new ParserException(String.format("Unknown parent object '%s' declared " +
                        "for type '%s'", dependency, getTypeName()));
            }
            dependencies.add((Token<?>) found);
        }
    }
    //Part 5
    if (dependencies.stream().anyMatch(d -> d instanceof ErrorInstance)) {
        //If any of the parents are an error then set error parser flag
        addParserFlag(ParserFlag.ERROR);
    }        
    //...
}

@Override
public String getTypeName() {
    return getTokenGroups().get(0).getFlatTokens().get(0).getValue(String.class);
}

@Override
public List<String> getDependencies() {
    //Part 2
    List<Token<?>> parents = getTokenGroups().get(2).getFlatTokens();
    return parents.stream()
            .map(Token::getValue)
            .filter(Objects::nonNull)
            .map(Object::toString)
            .collect(Collectors.toList());
}
```
Let's look at each part as it would be executed:
- **Part 1**: The current type token is cloned and a dependency list is created. This will be used to store all upstream dependencies which
have directly (or indirectly) declared.
- **Part 2**: This is another of the methods we implemented from the TokenInstance class. This simply maps the list of types declared in 
our inheritance list. For our case you can only declare a single type, but it returns a list should interface equivalents also be included
or... multiple inheritance. I would not recommend the latter, but new languages are there to push boundaries and established norms.
- **Part 3**: This part dives into Error Handling and what happens if a defined type extends either a checked or unchecked error within the 
language. We first try and find a match for the type of error we're inheriting from which will dictate how the parser handle it. To do this
we attempt to find a matching error handler against the name and set it as the value. You'll notice that when we defined our type token 
(``public class MyTypeToken extends Token<Token<?>>``) it used a generic type of ``Token<?>``. This was solely done to store this error handler. 
This is done so that when the error is thrown, this error handler instance can be used to create the associated error type using the contained
properties. For more information, please see [Error Handling](./../error-handling.md).
- **Part 4**: The final part in this section checks to see whether an error handler has been found and set. If not then the current dependency
is searched for in context. If not found then an error is thrown, but otherwise is added to the list of dependencies for use later.
- **Part 5**: Related to Part 2, if this type inherits from a mapped error then we set the parser flag against this token. This tells the
parser to handle this token in a special way. For more information on parser flags, please see [Parser Flags](./../parser/parser-flags.md).

Let's look at the next part which deals processing those dependencies:
```java
@Override
public Token<?> createInstance(LARFParser parser, LARFContext context, LARFConfig config, 
                               String typeName) {
    //...
    //Part 1
    TokenGroup bodyGroup = new TokenGroup();
    if (getTokenGroups().get(3).getTokens().size() == 1) {
        Token<?> found = clonedToken.getTokenGroups().get(3).getTokens().get(0);
        if (!found.getTokenGroups().isEmpty()) {
            bodyGroup.getTokens().addAll(found.getTokenGroups().get(0).getFlatTokens());
        }
    } else {
        throw new ParserException(String.format("Expected single token which is either a " +
                        "MultiLine or SingleLine token! Instead found %d being [%s]", 
                        getTokenGroups().get(3).getTokens().size(),
                        Stream.of(getTokenGroups().get(3).getTokens()).map(o ->
                                o.getClass().getSimpleName()).collect(Collectors.joining(","))));
    }
    //Part 2
    bodyGroup.getTokens().forEach(t -> t.setOriginalParent(typeName));
    for (Token<?> dependency : dependencies) {
        if (!(dependency instanceof TokenInstance)) {
            throw new ParserException(String.format("Expected parent to be of type 'TokenInstance'" +
                    " but instead found '%s'", dependency.getClass().getSimpleName()));
        }
        TokenInstance parentType = (TokenInstance) dependency;
        //Part 3
        verifyParentGroupParameters(parentType);
        TokenGroup parentTokenGroup = parentType.getBodyGroup();
        if (!parentTokenGroup.getTokens().isEmpty()) {
            Token<?> body = parentTokenGroup.getTokens().get(0);
            if (!(body instanceof MultiLineToken)) {
                throw new ParserException(String.format("Expected type to have a body section of " +
                        "type 'MultiLineToken' but instead found '%s'", 
                        body.getClass().getSimpleName()));
            }
            TokenGroup parentTokens = parentTokenGroup.findGroupWithTokens(true)
                    .orElse(new TokenGroup());
            parentTokens.getTokens().forEach(t -> t.setOriginalParent(parentType.getTypeName()));
            bodyGroup.getTokens().addAll(parentTokens.getTokens());
        }
    }
    //...
}
```
There are three main parts to this section:
- **Part 1**: This creates the body group, to which all resources from the current type and it's parents (direct or indirect) are
added. If no body is provided then an error is thrown.
- **Part 2**: Loops through all child resources in the body of the current type (not inherited) and sets the original parent value. 
This is used for tracability for error handling. We then start a loop of the dependencies to which this type inherits from and 
performs a check to verify that they are token instances (types). If so, we then store the current dependency to a TokenInstance
variable called parentType.
- **Part 3**: The final part firstly validates the parameters passed to this type match any parent type requirements if they exist. 
For example, if we have a ``ParentType`` which declares a parameter ``d``, we expect a ``ChildType`` to reflect that in its own 
parameters e.g. ``type ChildType(a,b,c,d) <- ParentType { ... }`` I won't provide the full code for this here, but but this can be 
found in [this](./../../examples/slop.md) example project. The next part is fetches the parent tokens body tokens, associates the
correct parent to them and adds them to the current body group. This ensures accessibility of parent type resources from our current
type. 

Resource scoping will happen in the final part which we'll look at now:
```java
@Override
public Token<?> createInstance(LARFParser parser, LARFContext context, LARFConfig config, 
                               String typeName) {
    //...
    try {
        parser.tokenStart(clonedToken);
        for (Token<?> token : bodyGroup.getTokens()) {
            if (!token.isExpression() && token.getVariableName().isPresent()) {
                List<TokenModifier> modifiers = new ArrayList<>();
                String dataType = null;
                if (token instanceof TypedReference) {
                    modifiers = token.getModifiers(config);
                    dataType = ((TypedReference) token).getDataType();
                }
                context.set(token.getVariableName().get(), token, dataType, modifiers);
            } else {
                parser.processExpression(Collections.singletonList(token), context);
            }
        }
    } finally {
        parser.tokenEnd(clonedToken, false);
    }
    return clonedToken;
}
```
The final part of this method is relatively simple. Similar to what we did with our CreateTypeToken, we also use the ``try...finally``
to manually set the current scope of the clonedToken to be active. This is so that when a value is set to context, it is assigned
to the correct token (in our case the TypeToken instance). It loops through each body token and if it can be identified as a variable
associated with our type, we fetch the modifiers and data type to store it into context. Alternatively, for everything which is
not a variable, constant or attribute we defer execution to the parser.

### Handling Type Interactions
As with most type interactions, they require other tokens to work. In most languages you can call a type's resources using an object
orientatd approach. Typically this is using the names of the object and sub-level resources using a delimiter. For example:
```
myObject.aMethod();
myObject.a
```
We will mimic this functionality by introducing three new tokens being FieldToken, InvocationToken and FunctionToken. I won't take 
you through the full implementation, but will provide a brief overview of each:
```java
public class FieldToken extends Token<Void> {
    //...
    @Override
    public String getPattern() {
        return "( val '.'? )+";
    }
    //...
}
```
The FieldToken places all captured values into a single token group that is repeatable. These values are separated by an optional 
``.`` character. The next token we'll need is the InvocationToken which will be reponsible for invoking methods:
```java
public class InvocationToken extends Token<Void> {
    //...
    @Override
    public String getPattern() {
        return "val:String '(' ( expr ','? )+ ')'";
    }
    //...
}
```
This captures the name of the method to invoke and captures a list of parameters. The final token is a FunctionToken which uses a
special interface called TokenParameters:
```java
public class FunctionToken extends Token<Void> implements TokenParameters {
    //...
    @Override
    public String getPattern() {
        return "'func' val '(' ( val ','? )+ ')' ( [ throws ] )? [ singleLine, multiLine ]";
    }

    public List<Token<?>> process(LARFParser parser, LARFContext context, LARFConfig config, 
                                  List<Token<?>> providedParams) { ... }
    //...
}    
```
The function token starts with a ``func`` keyword and then uses a single capture group for the name. It then captures a group
of single value parameters. This is because it's a typeless language, but if you were opting for Typed then you'd simply use
``'(' ( [ typedVariable ] ','? )+ ')'`` with ``typedVariable`` being the name of your Typed value token. Moving on in the 
pattern it then defined a single capture group for a ``throws`` token which will be used to capture thrown errors. Finally it
will use a grammar branch where you can define either single or multi-line body implementation.

You'll also notice that as part of the TokenParameters, there is a new ``process`` method which contains an additional set of
parameters. This will be called from the InvocationToken to pass the parameter values to the FunctionToken. For more information
on creating Functions along with the InvocationToken and TokenParameters interface, please see [here](functions.md). With these 
and everything we've written up until now, the following can now be processed:
```
type MyType(a,b,c) {
    func aMethod() {
        return a + b + c;
    }
}

anObject = new MyType(1,2,3);
anObject.aMethod();
```
The FieldToken will work in parallel with the InvocationToken to handle the ``anObject.aMethod();`` call. Hierachically, these values would 
be captured in the FieldToken as the following:
```
0: TokenGroup
  - ReferenceToken("anObject")
  - InvocationToken("aMethod")
      0: TokenGroup
        (Empty Parameter Group)
```
When the FieldToken's ``process`` is excuted, it would fetch from context the value of first token value (``"anObject"``) from context. 
Since that is found to be a TokenInstance, we'll store that as context for the next value which is the InvocationToken. This token is
solely there to handle function invocations. 