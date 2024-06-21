---
sidebar_position: 11
---
# Code Block Style
Languages typically use either a block-structured (Delimiter) or whitespace / indentation style of code blocks. LARF supports both of
these using ``config.setProperty(DefaultProperty.CODE_BLOCK_STYLE, ...)`` with the values:
- CodeBlockStyle.DELIMITER
- CodeBlockStyle.WHITESPACE_FIXED
- CodeBlockStyle.WHITESPACE_IDENTIFY

Python is an 
examples which uses the former:
```python
def greet(name):
    if name:
        greeting = "Hello, " + name + "!"
        print(greeting)
    else:
        print("Hello, there!")

greet("Alice")
```
By using fixed indents, it deterines which tokens are children of those at a higher-level. 