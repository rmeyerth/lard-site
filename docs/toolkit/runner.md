---
sidebar_position: 12
---
# Runner
The runner is a test class used to quickly test the features of your language. To create a new runner
class simply create a new Class within your package and extend the ``LARFRunner`` class. Add a main
method and create a version of your languages config to pass to a new instance of the LARFProcessor. 
This is then passed to the inherited ``run(..)`` method.
```java
public class MyLanguageRunner extends LARFRunner {
    public static void main(String[] args) {
        MyLanguageConfig config = new IndentConfig();
        config.setProperty(DefaultProperty.LANGUAGE_TYPED, LanguageTyped.TYPED);
        config.setProperty(DefaultProperty.CODE_BLOCK_STYLE, CodeBlockStyle.INDENTATION_FIXED);
        LARFProcessor processor = new LARFProcessor(config, new LARFContext());
        run("My Language", processor);
    }
}
```
Typically you would add the properties within your configuration class, but during the early stages of 
development it can be useful to play around with these to determine the direction you wish to head with it.
There are two overloaded versions of the ``run`` method. The version above has two parameters which is the
name of your language and the processor. The alternative to this would be one with a third parameter which
is one or more characters to represent the end of code input. This can be useful if you want to enter 
multiple lines or when your language uses whitespace code indentation.

When you run your class in the IDE, you will be presented with the following in a terminal:
```
My Language Test Utility
========================

```
If you used the two parameter version of run, you will be able to type an expression, press enter and see
the result be returned on the next line:
```
1 + 2 / 5
Result: 1.4 (Type: Double, Time taken: 24ms)
```
Alternatively if you chose to specify an end input character sequence e.g.
```java
run("My Language", processor, ".");
```
then you can keep entering new lines
until that sequence is provided:
```
My Language Test Utility
========================
[Multi-line enabled] Please add <newline> + '.' + <return> to the end of a finished expression to 
                     evaluate the result.
int i = 1
if i == 1 then
    i = 2
    if i == 2 then
        i = 3
        if i == 3 then
            int j = 4
            return i * j
.
Result: 12 (Type: Integer, Time taken: 24ms)
```
You'll notice that when multi-line support is enabled, a message will appear stating how to correctly end
the expression. In this case you always need to specify the end sequence on a new line after the expression
has finished.

If you do get an error, these will be printed on the next line after evaluation instead of the result:
```
[Multi-line enabled] Please add <newline> + '.' + <return> to the end of a finished expression to 
                     evaluate the result.
int i = 1
if i == 1 then
    i = 2
    if i == 2 then
       i = 3
        if i == 3 then
            int j = 4
            return i * j
.
Error: Invalid whitespace used on line 5. Ensure code is uniformly indented using 1 tab or 4 spaces
```
Certain errors are handled so that only the error is shown in the terminal. These include lexer, parser,
indentation and unhandled operation exceptions. Anything outside of that will print the full stack trace
as it was not expected and could represent a bug. If you do wish to print the stack traces you can enable
this by setting the ``setEnableStackTrace(boolean)`` in your runner class:
```java
setEnableStackTrace(true);
run("Indent Language", processor, ".");
```
This will then print both the message and full stack trace:
```
dev.larf.exception.IndentationException: Invalid whitespace used on line 5. Ensure code is uniformly 
                                         indented using 1 tab or 4 spaces
	at dev.larf.lexer.LARFLexer.handleSpaceToken(LARFLexer.java:195)
	at dev.larf.lexer.LARFLexer.analysePatterns(LARFLexer.java:106)
	at dev.larf.lexer.LARFLexer.tokenize(LARFLexer.java:75)
	at dev.larf.lexer.Lexer.tokenize(Lexer.java:49)
	at dev.larf.processor.LARFProcessor.process(LARFProcessor.java:78)
	at dev.larf.runner.LARFRunner.run(LARFRunner.java:51)
	at dev.larf.runner.LARFRunner.run(LARFRunner.java:25)
	at dev.larf.languages.indent.src.IndentRunner.main(IndentRunner.java:22)
```
