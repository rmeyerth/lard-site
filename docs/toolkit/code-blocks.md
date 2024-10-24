---
sidebar_position: 11
---
# Code Block Style
![Code Blocks](/img/code-block.jpg)
Languages typically use either a block-structured (Delimiter) or whitespace / indentation style of code blocks. LARF supports both of
these using ``config.setProperty(DefaultProperty.CODE_BLOCK_STYLE, CodeBlockStyle.*)`` with the possible values:
- CodeBlockStyle.DELIMITER
- CodeBlockStyle.WHITESPACE_FIXED
- CodeBlockStyle.WHITESPACE_IDENTIFY

### Delimiter
Delimiter-based code blocks are the most common with either a keyword or character representing the beginning of end. Here is an example
of a code block in C / C++ / Java:
```java
if (2 > 1) {
    //...
}
```
It uses an opening and closing curly brace to represent this. To show some other examples, here is Pascal:
```java
if 2 > 1 then
begin
    //...
end;
```
This is the default code-block style within LARF and needs no further configuration other than to set up your token.

### Whitespace
Whitespace based code-blocks is where the language uses indentation or "whitespace" characters (spaces / tabs) to identify blocks of code.
Python and Haskell are examples of languages that uses idententation. They allow a user to define their own indentation value, but it has
to be consistent. This would match the ``CodeBlockStyle.WHITESPACE_IDENTIFY`` value:
```python
def greet(name):
    if name:
        greeting = "Hello, " + name + "!"
        print(greeting)
    else:
        print("Hello, there!")

greet("Alice")
```
If you are not consistent with the indentation, like with Python LARF will throw an indentation error. For example, running the following:
```
int i = 1
if i == 1 then
    i = 2
     if i == 2 then
        i = 3
        if i == 3 then
            int j
return i
```
Will give the following error:
```
Invalid whitespace used on line 4. Ensure code is uniformly indented using 4 spaces
```
The ``4 spaces`` was the value taken from the initial indentation and was the rule that the following code must adhere to. If you wish to
use a predefined indentation instead of automatic identification, you can use the ``CodeBlockStyle.WHITESPACE_FIXED`` and customize the
whitespace value by using ``setProperty(DefaultProperty.WHITESPACE_VALUE, "\t|    ");``. The value may consist of one or more indentation
values separated by a ``|`` character.
