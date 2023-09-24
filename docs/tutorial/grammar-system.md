---
sidebar_position: 10
---
# Grammar System
Before we go any further, it will be a good time to cover the grammar system. I call this the Least Effort Grammar
System (LEGS for short). This allows you to outline to the lexer the pattern it should look for when tokenizing an
expression. It also tells the lexer the groups to which individual tokens should be assigned so that they can be used
when it is processed by your code.

| Symbol | Example                | Description                                                                                                                                                                                                                                                                                                                   |
|--------|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| '...'  | ``'for'``              | A static syntax value                                                                                                                                                                                                                                                                                                         |
| expr   | ``expr``               | A capture group of one or more tokens                                                                                                                                                                                                                                                                                         |
| val    | ``val``                | A capture group of strictly one token                                                                                                                                                                                                                                                                                         |
| ?      | ``','?``               | Makes the preceding group or token optional                                                                                                                                                                                                                                                                                   |
| <?     | ``','<?``              | Stores the static syntax value to the group. This can be used as a flag so that if the value is used it can be used by the code during processing.                                                                                                                                                                            |
| (...)  | ``( expr )``           | Defines a token group so that you can dictate the structure of the tokens. This is useful if a group of tokens can happen multiple times for easy processing e.g. ``'switch' '(' ( expr ','? )+ ')'``. In this example the capture group and comma can be repeated multiple times and stored in separate nested token groups. |
| +      | ``( expr ',' )+``      | Flags that the previous token group can occur multiple times                                                                                                                                                                                                                                                                  |
| [...]  | ``[ ref1, ref2 ]``   | Grammar references defer responsibility to one or more other tokens to handle execution                                                                                                                                                                                                                      |
| :      | ``val:String``         | Used in conjunction with a single capture group. This forces a given value to adhere to the name of the token specified.                                                                                                                                                                                                      |

Using the above symbols, we can define almost all the possible combinations of statement. Take the following implementation
of a switch statement as an example:
```
'switch' '(' ( expr ','? )+ ')' '[' ( expr ':' expr '!'<? ';'? )+ ( 'default' ':' expr )? ']'
```
Although it seems quite complicated, let's break this down and see what it's doing:
1. First we have a ``switch`` syntax symbol
2. We then have an open bracket ``(`` syntax symbol
3. Next we have the token group ``( expr ','? )+``. This states that is is expecting multiple tokens with an optional ``,`` symbol to occur multiple times. The value ``1 + 1, 2 - 3, 'hello ' + 'fred'`` would match this pattern.
4. We then expect a closing ``)`` immediately followed by a ``[``.
5. We then define another token group ``( expr ':' expr '!'<? ';'? )+``. This declares that firstly the content of the group can occur multiple times. Secondly, the content contains two multi-token capture groups separated by a ``:`` character. An optional ``!`` character can be specified which is retained and added to the token group. An example of a valid occurrence of this would be ``< 1: 'Baby';< 3: 'Toddler'; < 12; 'Child';< 19: 'Teen';...``.
6. The next token group ``( 'default' ':' expr )?`` is singular and optional. It expects the ``default`` keyword as well as a result.
7. Finally we finish the statement with a closing ``]`` character.

Grammar reference are one of the more recent additions, but they overcome existing limitations by allowing branching
within the grammar. For example, let's take the following:
```
'if' '(' expr ')' [ singleLine, multiLine ] ( 'else' [ singleLine, multiLine ] )?
```
This grammar defines a standard ``if ... else ...`` statement. You'll notice that the bodies of both ``if`` and
``else`` have grammar references. These act as a branch in the normal flow of statement execution. Most statements
have either a single or multi-line code block in a statement. The latter is represented typically by a beginning and end
symbol or word, or in some cases indentation.

:::danger Indentation support

Unfortunately support for indentation with code blocks are currently not supported. It is however planned and on the roadmap
and will provide more updates soon.

:::

Grammar references provide the ability for a statement to handle multiple
variants of itself by deferring each scenario to another token class. In the above case we'd have two separate reference
token classes that would define a pattern and logic for single and multi-line code blocks. Once execution has finished,
it will return the result its result (if one exists) back to the parent so it can continue to execute. We'll see this
in action in the next section.