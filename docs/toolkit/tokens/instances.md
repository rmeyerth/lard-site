---
sidebar_position: 2
---
# Instances
### Introduction
Token instances provide a route to implement and represent types (custom objects) within your language. It is important
to understand that no strict type handling is written into LARF itself, instead it provides this interface to act as a 
guide when implementing your own type system. You are free to implement your own approach should you wish, but this guide 
will take you through the steps to make use of the TokenInstance interface.

### Adding Types to your Language
Firstly let's create a class which extends not only the standard Token class but also implements the TokenInstance 
interface. An example of this can be seen below:
```java
public class MyTypeToken extends Token<Token<?>> implements TokenInstance {

    //Standard Token Methods
    //...

    @Override
    public Token<?> createInstance(LARFParser parser, LARFContext context, LARFConfig config, 
                                   String typeName) { ... }    

    @Override
    public List<Token<?>> process(Token<?> source, LARFParser parser, LARFContext context, LARFConfig config, 
                                  String target, List<Token<?>> params) { ... }

    @Override
    public String getTypeName() { ... }    

    @Override
    public List<String> getDependencies() { ... }    

}
```
In addition to the standard Token methods, there are several new methods that our new TypeToken class must implement:
- **createInstance**: Gets called by another token when a request to create a new object is triggered. The class from
which this is triggered will typically be a token that uses a keyword to trigger off this action e.g. 
``new CustomObject(...);``. This will be described in a later [section](instances.md#invoking-creation-from-a-defined-type) on this page.
- **process**: An overloaded variant of the process method which accepts a target and list of parameters. This can be 
used when targetting a specific child resource on the object instance e.g. a method.
- **getTypeName**: Returns the unique identifier of the current object to store in context
- **getDependencies**: Provides a list of references to other type instances which this class extends / inherits.

### Invoking creation from a defined type