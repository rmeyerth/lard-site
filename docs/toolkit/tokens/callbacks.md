---
sidebar_position: 3
---
# Callbacks
A token callback is used when two tokens must work together in order to achieve a goal. Let's take the ``for``
loop example where we defer the loop and body portions to other token classes. For example, here is the pattern
for a ForToken:
```java
@Override
public String getPattern() {
    return "'for' '(' [ fixedLoop, variableLoop ] ')' [ singleLine, multiLine ]";
}
```
You'll notice that we have two grammar references which defer execution to different tokens for both the loop
and body portion. Let's now take a look in the ``process`` method of the ForToken class:
```java
@Override
public List<Token<?>> process(LARFParser parser, LARFContext context, LARFConfig config) {
    if (getTokenGroups().size() != 2) {
        String foundTokens = getTokenGroups().stream()
                .flatMap(tg -> tg.getFlatTokens().stream())
                .map(t -> t.getClass().getSimpleName())
                .collect(Collectors.joining(", "));
        throw new ParserException("For token expects two tokens being the looping portion and the body. Instead got "
                + foundTokens);
    }
    Token<?> loopToken = getTokenGroups().get(0).getFlatTokens().get(0);
    Token<?> bodyToken = getTokenGroups().get(1).getFlatTokens().get(0);
    return loopToken.processWithCallback(parser, context, config, () -> {
        List<Token<?>> result = bodyToken.processNoParams(parser, context, config);
        if (result.size() == 1 && result.get(0) instanceof ReturnToken) {
            return Optional.of(result.get(0));
        }
        return Optional.empty();
    });
}
```
In the first portion we are just validating that we are expecting two token groups. The first representing the 
loop token reference with the second being the body. Next we simply assign these to suitably named token variables.
The next portion sees us call ``loopToken.processWithCallback`` which accepts a lambda call. Let's now
take a look at the VariableLoopToken to see when this lambda is being used:
```java
public class VariableLoopToken extends Token<Void> implements TokenCallback {
    
    //...
    
    @Override
    public List<Token<?>> process(LARFParser parser, LARFContext context, LARFConfig config, ReferenceCallback callback) {
        List<Token<?>> arrayResult = new ArrayList<>();
        if (getTokenGroups().size() < 2) {
            throw new ParserException("Expected a variable and a collection provided in the for each iterator statement");
        }
        Token<?> varArg = getTokenGroups().get(0).getFlatTokens().get(0);
        //Resolve the variable name to be used to store the iterated object in context
        String variableName = (varArg instanceof TokenGroup) ?
                ((TokenGroup)varArg).getFlatTokens().get(0).getValue(String.class) :
                varArg.getValue(String.class);
        List<Token<?>> collectionArgs = getTokenGroups().get(1).getFlatTokens();
        Collection<?> collection;
        //Resolve the collection object
        if (collectionArgs.size() == 1 && collectionArgs.get(0) instanceof TokenValue) {
            String collectionRef = collectionArgs.get(0).getValue(String.class);
            Object suspectedCollection = context.getContextObject(collectionRef);
            if (!(suspectedCollection instanceof Collection)) {
                throw new ParserException(String.format("The reference used in the for each loop (%s) did not result " +
                        "in a collection. Instead found '%s'", collectionRef, suspectedCollection.getClass().getSimpleName()));
            }
            collection = (Collection<?>)suspectedCollection;
        } else {
            collection = parser.processExpression(collectionArgs, context).getValue(Collection.class);
        }
        for (Object current : collection) {
            //Set the current object to the defined variable
            context.set(variableName, current);
            Optional<Token<?>> result = callback.call();
            if (result.isPresent()) {
                if (result.get().getParserFlags().contains(ParserFlag.RETURN_GROUP)) {
                    arrayResult.add((Token<?>) result.get().getValue());
                } else if (result.get().getParserFlags().contains(ParserFlag.RETURN)) {
                    return Collections.singletonList((Token<?>) result.get().getValue());
                }
            }
        }
        return Collections.singletonList(new ArrayToken(arrayResult));
    }
}
```
Firstly you'll notice that the VariableLoopToken (just like the equivalent FixedLoopToken) implements the TokenCallback
interface. This requires us to implement the process method with the extra ReferenceCallback parameter. Looking at the
implementation of the code this look complicated, but let's break it down and see where that ``ReferenceCallback`` is used.

First we ensure that we have the valid number of arguments otherwise an error is thrown. We next extract the
variable name portion of the loop e.g. ``for (emp : employees)`` and assign it to a ``variableName`` String 
variable. Next we use the value found in the second token group and retrieve the suspected collection from context
and assign it to the ``collection`` variable. Following this, we simply do a for loop on the collection,
set the current object into context using the variable name and then call ``Optional<Token<?>> result = callback.call();``.
In simply term, for each iteration that occurs in our loop call the callback lambda. Let's return to the
ForToken again and look more closely at the lambda call:
```java
return loopToken.processWithCallback(parser, context, config, () -> {
    List<Token<?>> result = bodyToken.processNoParams(parser, context, config);
    if (result.size() == 1 && result.get(0) instanceof ReturnToken) {
        return Optional.of(result.get(0));
    }
    return Optional.empty();
});
```
So for each iteration, we are calling the ``bodyToken.processNoParams`` method. If the body token returns a
ReturnToken (token to return a value instantly), then we return that token or else we return an empty Optional.
Let's now look back at the remaining code in the VariableLoopToken after the callback call:
```java
//...
Optional<Token<?>> result = callback.call();
if (result.isPresent()) {
    if (result.get().getParserFlags().contains(ParserFlag.RETURN_GROUP)) {
        arrayResult.add((Token<?>) result.get().getValue());
    } else if (result.get().getParserFlags().contains(ParserFlag.RETURN)) {
        return Collections.singletonList((Token<?>) result.get().getValue());
    }
}
```
If the result from the body contains a RETURN_GROUP parser flag then we add it to the list of results and continue.
Alternatively if we come across the ParserFlat.RETURN parser flag then we return immediately and break out of the
remaining loop iterations. If you'd like to learn more about parser flags and how they are used, please see 
[Parser Flags](../parser/parser-flags.md).

If it's not clear what is happening from the code, let's use a step list to show when each token gets called:
1. **ForToken**: Calls VariableLoopToken using ``processWithCallback``.
2. **VariableLoopToken**: Resolves the name and collection into variables. Loops through each object in the collection
and sets the current object to a variable using the name ref in context. A call is then made to the lambda method reference.
3. **ForToken**: The lambda we defined in the ``processWithCallback`` is called. This makes a call to the body token
4. **SingleLineToken** / **MultiLineToken**: Dependent on how the body was defined, it will execute the code found within
and return a result in the form of a token back to the lambda in the ForToken.
5. **ForToken**: Once a result has been received from the body, it is checked to see if a valid token result has been 
received and if so is returned in an Optional.
6. **VariableLoopToken**: The token result from the callback is read and if it contains a RETURN* parser flag is
handled accordingly.
7. **ForToken**: Once all iterations of the loop have completed or have been terminated prematurely due to a parser
flag, the result is then returned.

The ForToken then sits in the middle and determines what will happen when the callback occurs. In this case a callback
will occur after each loop iteration. At which point the ForLoop in the lambda calls the body token to execute. Once
finished it will then return control back to the Looping token to either continue the loop or exit dependant on the result
from the body.
