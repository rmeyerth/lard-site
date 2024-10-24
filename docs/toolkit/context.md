---
sidebar_position: 3
---
# Context
![Context](/img/context.jpg)
The context object is used primarily as storage and is accessible from any token via the ``process`` method.
It can be pre-populated with objects prior to expressions being evaluated or loaded dynamically. When setting
an object within the context, a unique name is specified which allows that reference to be used from within
your code. Here is an example of a simple language using standard object field notation against an object
which has been stored in context:
```java
public static void main(String[] args) {
    SLOPConfig config = new SLOPConfig();
    LARFContext context = new LARFContext();
    context.set("acme", sampleCompany());
    LARFProcessor processor = new LARFProcessor(config);
    System.out.println(processor.process("acme.employees[0].name", context).getValue(String.class));
}
```
When an object is stored dynamically from within a token, the context manages that objects state and scope
to ensure access is not permitted where it shouldn't. It also supports recursion out of the box and will
maintain the state for each copy of a value. This is transparent to the developer and happens automatically
using the get / set methods found within the context object.

Here is a more complex example of context use:
```java
/**
 * This is where the function is passed parameters by the InvocationToken which is being evaluated. That 
 * token retrieved this one from the heap using a concatenation between the function name and the number 
 * of parameters. The passed parameters are written into context and the contained tokens evaluated. The 
 * result is returned from the evaluation of these.
 * @param parser The parser used to resolve child token expressions
 * @param context The context for resolving object references
 * @param config The configuration for resolution of property values
 * @param providedParams The parameters from the calling InvocationToken
 * @return Returns the resulting value from the function execution
 */
public List<Token<?>> process(LARFParser parser, LARFContext context, LARFConfig config, 
                              List<Token<?>> providedParams) {
    String functionName = getTokenGroups().get(0).getFlatTokens().get(0).getValue().toString();
    List<Token<?>> paramVars = getTokenGroups().get(1).getFlatTokens();
    if (paramVars.size() != providedParams.size()) {
        throw new ParserException(String.format("Function %s expected %d parameters, but only called with %d",
                functionName, paramVars.size(), providedParams.size()));
    }
    for (int i = 0;i < paramVars.size();i++) {
        context.set(paramVars.get(i).getValue(String.class), providedParams.get(i), VariableType.PARAMETER);
    }
    Token<?> result = parser.processExpression(getTokenGroups().get(3).getFlatTokens(), context);
    if (!result.getParserFlags().isEmpty() && !result.getParserFlags().contains(ParserFlag.ERROR)) {
        //Unwrap result as we don't want to return token any further
        return Collections.singletonList(result.getValue() instanceof Token ?
                (Token<?>)result.getValue() : new TokenValue(result.getValue()));
    }
    return Collections.singletonList(result);
}
```
The above method is an example which may exists on a languages function token and is called from the equivalent 
InvocationToken (see [Functions](./tokens/functions.md) for more information). Because this token represents the
Function being invoked, it is called with the parameters used to call it. The expected parameters are compared
against the provided set - this is a typeless language so no need to check types - and if found to be a match,
each parameters is set in context using it's name (from the function) and the value passed to this method. The
call to execute this is then passed to the parser and a result is returned and handled.

The context can be used to share context values between tokens to facilitate their execution, or store context
objects to be used in the code being executed. It's an easy class to use with a simplified set of methods, but
removes the complexity necessary when dealing with state, scope and more advanced features such as recursion.