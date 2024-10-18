---
sidebar_position: 3
---
# Parser Flags
Parser flags affect the behaviour of execution in the parser when it is resolving values from tokens. Let's look
at the flags that are available:
```java
public enum ParserFlag {
    BREAK,
    CONTINUE,
    RETURN,
    RETURN_GROUP,
    ERROR,
    JUMP,
    EXIT
}
```
A flag can be associated with a token by 