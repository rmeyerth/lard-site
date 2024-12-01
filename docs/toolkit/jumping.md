---
sidebar_position: 10
---
# Jumping
![Jumping](/img/jumping.jpg)
Jumping (think goto) is an old concept where you can skip to a certain point in the code identified by a label.
This was traditionally used in Assembly, Fortran, COBOL and C to name a few. There are several reasons why modern
languages abandoned the concept:
- Spaghetti Code: Using jumps or goto statements can lead to what is known as "spaghetti code," where the flow of the 
program becomes tangled and difficult to follow. This makes the code hard to read, maintain, and debug.
- Structured Programming: The rise of structured programming paradigms in the 1970s and 1980s emphasized the use of 
control structures like loops (for, while) and conditionals (if, else) instead of jumps. This approach promotes clearer 
and more maintainable code.
- Error-Prone: Jumps can easily lead to logical errors and bugs, especially in large and complex programs. They can 
cause unexpected behavior if not managed carefully.
- Modern Alternatives: Modern programming languages provide more robust and safer alternatives to jumps, such as 
functions, methods, and exception handling mechanisms. These constructs help manage the flow of the program in a 
more controlled and predictable manner.
- Best Practices: Over time, best practices in software development have evolved to discourage the use of jumps. Code 
readability, maintainability, and reliability are prioritized, and structured programming techniques are preferred.

So, afer I've explained why languages no longer use them, why has jump support been added to LARF? This was originally
added for backwards compatibility purposes. Working on one of the examples during the development phase ([My Assembly Language](../examples/mal)),
I found I was missing this feature and decided to implement it. Whether you choose to use it or not is your
choice, but so long as you are aware of why most modern languages have moved away from using them and are still
happy to use them, you are at liberty to do so. The following describes a short summary of how to add jumps to 
your own language.

# Adding Jumps
There are three steps to adding junps into your own language. In this example we will see how it was implemented in
the MAL example. This was done by creating a class called the LabelToken. This extends a class called JumpPointToken
which is a special token picked up by the parser at runtime. The JumpPointToken has a method called ``getLabel`` which 
allows the user to define a jump reference. Given this, if the ``ParserFlags.JUMP`` is used and contains the reference
to that label then the point of execution will skip straight to that point. Let's see what the LabelToken looks like:
```java
public class LabelToken extends JumpPointToken<Void> {

    public LabelToken() {
        super("Label", null);
    }

    @Override
    public Token<Void> createToken(String value) {
        return cloneDefaultProperties(new LabelToken());
    }

    @Override
    public PatternType getPatternType() {
        return PatternType.GRAMMAR;
    }

    @Override
    public String getPattern() {
        return "val ':'";
    }

    @Override
    public Optional<String> getGuidance(String token, List<Integer> groupsCount) {
        return Optional.empty();
    }

    @Override
    protected List<Token<?>> process(LARFParser parser, LARFContext context, LARFConfig config) {
        return Collections.singletonList(config.getNullToken());
    }

    @Override
    public String toString() {
        return String.format("LabelToken{%s}", getTokenGroups().get(0).getFlatTokens().get(0).getValue(String.class));
    }

    @Override
    public String getLabel() {
        return getTokenGroups().get(0).getFlatTokens().get(0).getValue(String.class);
    }
}
```
As can be seen, we're defining the label in the ``getLabel`` method as the value that being captured. The next point 
is to look at the token which triggers the jump. In MAL's case we needed to define a JLE command where a jump is 
triggered if the CMP operation resulted in the first argument being less or equal to the second. Let's see how that
is defined:
```java
public class JleToken extends JumpToken<Void> {

    //...

    @Override
    protected List<Token<?>> process(LARFParser parser, LARFContext context, LARFConfig config) {
        Object found = context.getContextObject("cmpResult");
        clearParserFlags();
        if (Objects.isNull(found)) {
            throw new ParserException("Expected cmp result to be present but none found. Please use 'cmp' " +
                    "prior to calling jle!");
        }
        if (found instanceof IntegerToken) {
            if (((IntegerToken)found).getValue() <= 0) {
                addParserFlag(ParserFlag.JUMP);
            }
        } else {
            throw new ParserException("Expected cmp result to be in Integer format. Instead found" +
                    found.getClass().getSimpleName());
        }
        return Collections.singletonList(this);
    }

    @Override
    public String getLabel() {
        return getTokenGroups().get(0).getFlatTokens().get(0).getValue(String.class);
    }

    //...
}
```
In the above case I've only shown the pertinent methods relevant to the jump operation. As we can see we're first
fetching the cmpResult which is the value set to context from our CmpToken. Next we clear any pre-existing parser
flags against our token. This is good practise, but in our case it's necessary as in our example we're in a loop.
Let's look at the assembly language section of the example in question:
```
; loop from 1 to 5
loop:
    ADD [sum], [counter] ; add counter to sum
    inc byte [counter]   ; increment counter
    cmp [counter], 5     ; compare counter with 5
    jle loop             ; if counter <= 5, jump to loop
```
As can be seen, we've defined our jump point label (``loop:``) and the last two lines are the ``cmp`` which 
compares the counter against the value ``5``. If found that the comparison is <= 5 then we jump to back to
the ``loop`` label. On the next line of the JleToken ``process`` method, we determine whether we need to
trigger the jump by looking at the result of the ``Integer.compareTo``. If it's less than 0 then we set the
``ParserFlag.JUMP`` to the current token and return as normal.

Finally we need to configure our language to use Jumps. We can do this from our configuration object:
```java
public class MALConfig extends LARFConfig {

    public MALConfig(String languageId, double languageVersion) {
        super(languageId, languageVersion);
        initProperties();
    }

    protected MALConfig(String languageId, double languageVersion, String authorName, List<String> authorContact) {
        super(languageId, languageVersion, authorName, authorContact);
        initProperties();
    }

    private void initProperties() {
        setProperty(DefaultProperty.JUMP_SUPPORT, true);
        setProperty(DefaultProperty.FORWARD_JUMPING, true);
        setProperty(DefaultProperty.GLOBAL_SCOPE, true);
        setProperty(DefaultProperty.CASE_SENSITIVE, false);
    }

    //...
}
```
There are actually two properties here related to jumping. The first is to enable jump support by setting the
``DefaultProperty.JUMP_SUPPORT`` to true. The default behaviour of jumps is to only junp backwards of the current
point of execution. The second optional (``DefaultProperty.FORWARD_JUMPING``) flag allows execution to skip to
a point both behind and in front of the current line.
