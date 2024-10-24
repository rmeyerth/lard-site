---
sidebar_position: 2
---
# Functions
![Functions](/img/functions.jpg)
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
- **Part 3**: We extract the function name from the token group and concatenate it with the number of parmeters and set the 
current token in context against that name. This is so we can fetch it later on when that name is referenced in other tokens. As
it is, because we're adhering to it being truly typeless we can only have one version of a method with the same number of
parameters.
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
we're going to use another token called InvocationToken. This allows us to make calls to the function we've created and pass it
values. Let's look at this tokens implementation:
```java
public class InvocationToken extends Token<Void> {

    public InvocationToken(TokenValue value) {
        super("Function", null);
        getTokenGroups().add(new TokenGroup(Collections.singletonList(value)));
    }

    @Override
    public Token<Void> createToken(String value) {
        return cloneDefaultProperties(new InvocationToken(new TokenValue(value)));
    }

    @Override
    public PatternType getPatternType() {
        return PatternType.GRAMMAR;
    }

    @Override
    public String getPattern() {
        return "val:String '(' ( expr ','? )+ ')'";
    }

    @Override
    public Optional<String> getGuidance(String token, List<Integer> groupsCount) {
        if (token.equalsIgnoreCase(")"))
            return Optional.of("A function definition requires parameters to be wrapped in a pair of braces " +
                    "e.g. FUNC( 1,2,3 )<--");
        return Optional.empty();
    }

    @Override
    public List<Token<?>> process(LARFParser parser, LARFContext context, LARFConfig config) {
        ...
    }
}
```
:::tip Grammar Help

For more help on understanding and defining grammar, please see the [Grammar](./grammar.md) section.

:::
The sole purpose of this token is to call a function by name and pass it parameters. As we're using a typeless language, it only
expects a name (``val:String``) along with ` list of one or more parameters found between a pair of brackets (``'(' ( expr ','? )+ ')'``).
As we have a single capture group for the name and a capture group for the parameters, this means we have two token groups to
which these values will be written to. For example, if we had the following expresion ``myMethod(1,2,3)``, this would be mapped to:
```
[0] TokenGroup
    [0] StringValue("myMethod")
[1] TokenGroup
    [0] TokenGroup *
        [0] IntegerToken(1)
    [1] TokenGroup
        [0] IntegerToken(2)
    [2] TokenGroup
        [0] IntegerToken(3)
```
\* When a group is defined in the grammar i.e. ``(...)``, the lexer creates a child group for each token passed in that
group. This is because the group can contain one or more tokens. For example, the method call may be ``myMehod(1 + 2,3 - 4,5)``. This
would result in:
```
[0] TokenGroup
    [0] StringValue("myMethod")
[1] TokenGroup
    [0] TokenGroup
        [0] IntegerToken(1)
        [1] OperatorToken("+")
        [2] IntegerToken(2)
    [1] TokenGroup
        [0] IntegerToken(3)
        [1] OperatorToken("-")
        [2] IntegerToken(4)
    [2] TokenGroup
        [0] IntegerToken(3)
```
Let's now look at the InvocationToken's ``process`` method:
```java
@Override
public List<Token<?>> process(LARFParser parser, LARFContext context, LARFConfig config) {
    //Part 1
    if (getTokenGroups().isEmpty() || getTokenGroups().get(0).getTokens().isEmpty()) {
        throw new ParserException("Function has no name or parameters");
    }
    //Part 2
    String methodName = getTokenGroups().get(0).getTokens().get(0).getValue(String.class);
    List<Token<?>> params = getTokenGroups().size() > 1 ?
            getTokenGroups().get(1).processTokens(parser, context) : new ArrayList<>();
    //Part 3
    Object definedFunction = context.getContextObject(methodName.concat(Integer.toString(params.size())));
    if (!(definedFunction instanceof FunctionToken)) {
        throw new ParserException(String.format("Found user defined function %s in the context but was not a FunctionToken",
                methodName));
    }
    //Part 4
    Token<?> token = (Token<?>)definedFunction;
    return token.processWithParams(this, parser, context, config, params);
}
```
Let's break down the implementation:
- **Part 1**: Performs some validation on the tokens to ensure that a name has been provided
- **Part 2**: Fetches the method name and parameter list from Token Groups 0 and 1 respectively
- **Part 3**: Concatenates the name with the size of the parameter list to fetch the FunctionToken from context. It then 
performs a validation check to ensure that the name is indeed a function token.
- **Part 4**: As tokens that are stored into context are returned as Objects, we cast it to a Token before calling the 
FunctionTokens ``processWithParams`` method along with the list of parameters declared. This then calls that method
found within our FunctionToken class which we've already covered above. The result of this is returned from the Invocation
token back to the parser which is propagated up the stack.