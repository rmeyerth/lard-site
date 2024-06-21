---
sidebar_position: 1
---
# Configuration
At the basic level, the configuration class is used to define which tokens are to be used in your language. 
When you first create the class and extend the ``LARFConfig`` class, several methods are required to be
implemented:
```java
public class MyLanguageConfig extends LARFConfig {

    public IndentConfig() {
        super("My Language", 0.5);
    }

    @Override
    protected void initFunctions() { }

    @Override
    protected void initTokenHandlers() { }

    @Override
    public Optional<TokenModifier> getDefaultModifier() {
        return Optional.empty();
    }

    @Override
    protected TypeOperation initTypeOperations() { return null; }

    @Override
    protected void initOperators() { }

    @Override
    protected void initParserFormatters() { }

    @Override
    protected void initErrorHandlers() { }
}
```
Firstly, a call to the superclass constructor method can be used to set the name and version of the 
language. This is used so that when code is loaded, a check is made to ensure that versions support
backwards compatibility, but will throw an error if the language is not correct or that the version 
contained in the file is greater than the version running. This ensures that issues don't occur with
missing tokens. The same checks are implemented on most languages. In Java this looks like the following:
```
java.lang.UnsupportedClassVersionError: Unsupported major.minor version 51.0
    at java.lang.ClassLoader.defineClass1(Native Method)
    at java.lang.ClassLoader.defineClassCond(Unknown Source)
```
The constructor can also be used to set properties which affect how your language operates. The other 
methods are used for the following:
1. ``initFunctions``: Used to define any system functions to provide functionality from the underlying
language (Java). For an example, please see the [System Functions](/docs/toolkit/system-functions.md)
section for more details.
2. ``initTokenHandlers``: Used to define all literals and statement tokens. Your tokens may require an
argument for the value when creating a new instance e.g. ``addTokenHandler(new MyToken(null))``, but 
passing null in this instance is fine as it is used for pattern matching and the creation of new
instances once a match is made. See [Token Class](/docs/toolkit/tokens/token-class.md).
3. ``getDefaultModifier``: If a variable or object is defined without using a modifier, this method 
determines which modifier will be used to enforce encapsulation rules. If none is specified (Optional.empty), 
then the default will be to lock down access to only be accessible from within the object it resides i.e. 
private.
4. ``initTypeOperations``: This is used to define type operations that handle interactions between
tokens and operators. The method requires that a token handler be returned which is used as a default
handler for basic operations. For example, you might define a simple equals / not equals handler for
the any token values. Please see the [Type Operations](/docs/toolkit/type-operations.md) for more details.
5. ``initOperators``: Defines operators using either one of the inbuilt templates or a custom set (see 
[Operators](/docs/toolkit/operators.md))
6. ``initParserFormatters``: Data structures like collections and maps may store their contents using
tokens depending on their implementation. Formatters are used to map their token structure used in the 
Parser back to their Java equivalents if required. Please see [Formatters](/docs/toolkit/parser/formatters.md).
7. ``initErrorHandlers``: Allows handlers to be defined for in-language errors. This could be as simple
as checked / unchecked or handling thrown Java exceptions for null or Arithmetic events. 
See [Error Handling](/error-handling.md) for more details.