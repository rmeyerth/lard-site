---
sidebar_position: 1
---
# Overview
Where lexers transform code into a series of hierarchical tokens, the parser is responsible for executing those 
tokens and deriving results from them. It acts as a central pillar for all the literals, operators, handlers
and statements in your language and enable them to work cohesively together. Every token has access to the 
parser via the ``process`` method. This can be used when you need to evaluate the content of a token group
from your token. 

Let's look at an example from a ternary statement token. In this statement you would have 3 ``expr`` (token groups)
defined in your pattern. The first goup represents the condition, whereas the second and third are evaluated if
the condition results in true and false respectively. Let's look at how this is defined:
```java
public class ConditionalToken extends Token<Void> {

    //...

    @Override
    public String getPattern() {
        //condition ? trueResult : falseResult
        return "expr '?' expr ':' expr";
    }

    @Override
    public List<Token<?>> process(LARFParser parser, LARFContext context, LARFConfig config) {
        //Expect that there are 3 tokens groups representing the condition and true / false token groups
        if (getTokenGroups().size() < 3) {
            String found = getTokenGroups().stream().map(Token::toSimpleString).collect(Collectors.joining(","));
            throw new ParserException(String.format("Condition does not have required arguments to execute. Expecting " +
                    "3 groups being condition, trueResult and falseResult. Found: [%s]", found));
        }
        //Evaluate the condition using the tokens found in the first token group
        Token<?> conditionResult = parser.processExpression(getTokenGroups().get(0).getTokens(), context);
        //If the condition is not a Boolean then throw an error i.e. "1 + 2 ? 3 : 4"
        if (!(conditionResult instanceof BooleanToken)) {
            throw new ParserException(String.format("Expected a boolean result from condition '%s'. Possible invalid " +
                            "condition specified", getTokenGroups().get(0)));
        }
        //Execute the relevant set of tokens based on the condition result
        return Collections.singletonList((((BooleanToken) conditionResult).getValue()) ?
                parser.processExpression(getTokenGroups().get(1).getFlatTokens(), context) :
                parser.processExpression(getTokenGroups().get(2).getFlatTokens(), context));
    }

    //...
}
```
Above we perform some basic validation to verify that 3 token groups have been specified. In next line we make a call 
to the parser to evaluate the tokens in group 0 (condition). The current token should only be concerned with its own
logic and can defer resolution of tokens / groups to the parser using ``parser.processExpression(...)``.

Once a result has been returned, it is verified that it is indeed a Boolean if so proceeds to perform a Java ternary
operation to make a call to the parser to evaluate the relevant token group.