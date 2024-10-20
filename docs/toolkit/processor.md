---
sidebar_position: 6
---
# Processor
The processor class is primary class you'll be dealing with when executing code in your own language. By using the
overloaded constructors, it provides the ability to override any of the default components found within LARF if 
you so choose. 

```java
public LARFProcessor(LARFConfig config, Lexer<?> grammarLexer, Lexer<?> languageLexer, 
                     Parser languageParser) { ... }

public LARFProcessor(LARFConfig config, LARFContext context) { ... }

public LARFProcessor(LARFConfig config) { ... }
```
Like many other class implementations within LARF it hasn't been sealed, which means you can extend and implement
your own custom constructors if necessary. Let's look at a basic example:
```java
class MyLanguage {
    private final LARFProcessor processor;

    public MyLanguage() {
        LARFConfig config = new SLOPConfig();
        config.setProperty(DefaultProperty.SAFE_OPERATIONS, false);
        processor = new LARFProcessor(config);
    }

    public <T> T processResult(String code, Class<T> clazz) {
        return processor.process(code).getValue(clazz);
    }
}
```
In the above case we're setting up some basic properties in our language and initialising the processor with the
config object. We can then define a method to run the code against our language using the ``processor.process(...)``
method and cast it to the expected result class using ``.getValue(Class<?>)``. There are some overloaded variants
of this method which are the following:
```java
public ExpressionResult<?> process(String expression, LARFContext context) { ... }

public ExpressionResult<?> process(String expression, Object... contextObjects) { ... }

public ExpressionResult<?> process(List<String> expressions) { ... }
```
The first of these passes a context object that can contain one or more objects that can be referenced within the
code. The context can be passed in the constructor when creating the processor, but this adds some flexibility if
this context is likely to change between subsequent calls. If you'd like to know more about the context, please 
see the [context](./context.md) section. The next omits the context object and passes any objects referenced within 
the code directly in. For example, if I had a Java object and my language had support for referencing those objects
within the language, we could do the following:
```java
public <T> T processResult(String code, Class<T> clazz, Employee...employees) {
    LARFContext context = new LARFContext();
    context.addAll(List.of(employees));
    return processor.process(code).getValue(clazz);
}
```
The final method is one which can be used with separate, but related, code expressions. Results and context can be 
passed between them, but this has mostly been superceded by multi-line support which was added some time ago.

### File Handling
Having the ability to save code in source files is a mainstay of most languages. As such, LARF has several methods
to support this:
```java
public void tokenizeToFile(String sourcePath, String compiledPath) { ... }

public ExpressionResult<?> processFromFile(String filePath, LARFContext context) { ... }
```
The ``tokenizeToFile`` method takes two arguments which is the path to the source file, and the path to the intended
output file for the compiled version. The file types are completely open to please feel free to define your own
extensions associated with your project. This can then be used in conjunction with the ``processFromFile`` method
and accepts a path to the compiled file and a context object.