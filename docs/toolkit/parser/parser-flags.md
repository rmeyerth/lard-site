---
sidebar_position: 3
---
# Parser Flags
Regardless of which programming language you would have used, to mimic certain types of behaviour such as 
returning a value or using continue or break in a loop, to achieve this in LARF you'll need to use parser flags. 
This is because the parser needs to change the way it processes tokens in order to support this. For example, 
in the case of a return statement the parser meeds to stop what it's doing and avoid processing any further 
tokens. This may also involve moving many steps back up the call stack in order to reach the level where it 
can be handled. In this section we'll take a look at some parser flags and how they're used.

### Loop-based flags
:::tip Familiarity
I would suggest familiarising yourself with writing loops before looking at this section. There is an example 
of one loop implementation that can be found [here](../tokens/callbacks.md).
:::
With most loops there is some basic functionality that every language is expected to have. This includes the
ability to break out of the loop and also the ability to skip to the next iteration using defined keywords.
For most languages these would be ``break`` and ``continue`` respectively. Although the implementation of these
tokens may at first appear trivial, there is some behaviour required beyond the bounds of the token class itself.
For example, if you had the following loop implementation:
```
ageCount = 0;
for (employee : company) {
    if (employee.getName().startsWith("S"))
        continue;
    ageCount += employee.getAge();
}
```
You would not want to continue executing the ``ageCount += ...`` line if the continue condition is triggered.
This is where we need to let the parser know that this is to be handled as a special case. In this case it would 
be to skip any remaining tokens being processed and move directly to the next iteration. Let's see how these
parser flags can be utilised by looking at the VariableLoopToken:
```java
public class VariableLoopToken extends Token<Void> implements TokenCallback {
    //...

    @Override
    public List<Token<?>> process(LARFParser parser, LARFContext context, LARFConfig config, 
                                  ReferenceCallback callback) {
        List<Token<?>> arrayResult = new ArrayList<>();
        if (getTokenGroups().size() < 2) {
            throw new ParserException("Expected a variable and a collection provided in the for each " + 
                    "iterator statement");
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
                throw new ParserException(String.format("The reference used in the for each loop (%s) " + 
                        "did not result in a collection. Instead found '%s'", collectionRef, 
                        suspectedCollection.getClass().getSimpleName()));
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
                } else if (result.get().getParserFlags().contains(ParserFlag.BREAK)) {
                    return Collections.singletonList(config.getNullToken());
                } else if (result.get().getParserFlags().contains(ParserFlag.CONTINUE)) {
                    //Ignore as we skip to next iteration anyway
                }
            }
        }
        return Collections.singletonList(new ArrayToken(arrayResult));
    }

    //...
}
```
The crucial part here is when we perform a call to the callback implementation in our main ForLoopToken. Let's
take a look at that now to see how this is implemented:
```java
public class ForToken extends Token<Void> {
    //...

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
            if (result.size() == 1 &&
                    result.get(0) instanceof ReturnToken ||
                    result.get(0) instanceof BreakToken ||
                    result.get(0) instanceof ContinueToken) {
                return Optional.of(result.get(0));
            }
            return Optional.empty();
        });
    }

    //...    
}
```
The callback here is the lambda implementation in which the body token (either a SingleLineToken or MultiLineToken) is
processed and a result is returned. Because loop iterations don't typically return a result, the default for this would
be to return an ``Optional.empty()``, however in the case that either ReturnToken, BreakToken or ContinueToken is 
returned then we return that back to the implementating loop class. In our case this is our VariableLoopToken.
Going back to our VariableLoopToken ``process`` method implementation, we can see this section:
```java
Optional<Token<?>> result = callback.call();
if (result.isPresent()) {
    if (result.get().getParserFlags().contains(ParserFlag.RETURN_GROUP)) {
        arrayResult.add((Token<?>) result.get().getValue());
    } else if (result.get().getParserFlags().contains(ParserFlag.RETURN)) {
        return Collections.singletonList((Token<?>) result.get().getValue());
    } else if (result.get().getParserFlags().contains(ParserFlag.BREAK)) {
        return Collections.singletonList(config.getNullToken());
    } else if (result.get().getParserFlags().contains(ParserFlag.CONTINUE)) {
        //Ignore as we skip to next iteration anyway
    }
}
```
In this case we are handling several possible different scenarios with different parser flags. The first of these is a 
``ParserFlag.RETURN_GROUP`` which is not present in most languages. This option allows you to specify a return statement
within the loop with the addition of an ampersand character to return an explicit result from an iteration. If we were
looping our employee example from earlier, we could do the following:
```
func getNames() {
    for (employee : company) {
        return & employee.getName();
    }
}
```
This would result in a collection of employee names being returned. As can be seen, the result from the return in each
iteration bis added to a Collection and is returned when the loop has finished. This deviates from the traditional return
behaviour which immediately causes the loop to cease and return a single value. If we loop next to the ``ParserFlag.RETURN``,
this has the behaviour where it immediately returns the result back to the ForLoopToken so that it can be returned.
The ``ParserFlag.BREAK`` returns a null value which puts an immediate stop to the loop iterating, but unlike the return
provides no result. Finally the ``ParserFlag.CONTINUE`` does nothing as it is the last statement within the main loop
itself. If this wasn't the case then we could use Java's ``continue`` to perform the same behaviour.

### Special Flags
There are three other parser flags which impact execution in different ways. This behaviour is implemented directly within
the parser itself rather than being a collaborative effort between a token and parser. The first of these is the 
``ParserFlag.ERROR`` which is reserved for error handling. This is used in the ErrorHandler class within the default
LARF framework. If you'd like to learn more about error handling within LARF, please see the [Error Handling](../error-handling.md)
section for more details. The next flag is the ``ParserFlag.JUMP`` which is an implementation of an older method of flow
manipulation and control. This is generally avoided in most modern languages due to making the programs harder to being harder
to maintain and more complex. This is typically only implemented in rare cases like when duplicating an older languages
feature set, but if you would like your language to use jumps, please see the [Jumping](../jumping.md) section.

The final parser flag is the ``ParserFlag.EXIT`` which causes the program to immediately terminate without any further
processing being conducted. No results are returned and this is only used in very rare circumstances.