---
sidebar_position: 1
---
# Configuration
### Overview
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

### Properties
Properties can be set to change how your language operates and behaves. Properties can be set either on
the object itself e.g. ``myLanguageConfig.setProperty(DefaultProperty.DEBUG_MODE, true);`` or within the
constructor:
```java
public class MyLanguageConfig extends LARFConfig {

    public IndentConfig() {
        super("My Language", 0.5);
        setProperty(DefaultProperty.DEBUG_MODE, true);
    }

    //...
}
```
Common properties can be found in the DefaultProperty enum class and are listed below:

| Value              | Type         | Description                                                                                                                                                                                                                     |
|--------------------|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| DATE_FORMAT        | String | This default date pattern used by the in-built DATE function e.g. ``setProperty(DefaultProperty.DATE_FORMAT, "dd-MM-yyyy")`` would support specifying ``DATE(23-05-1999)``. A second argument can be provided to the date function with a custom pattern.
| DEBUG_MODE         | Boolean | This enabled in-depth logging of all parser and token operations e.g. ``setProperty(DefaultProperty.DEBUG_MODE, true)``. This is useful when debugging your own tokens / statements.
| SAFE_OPERATIONS    | Boolean | This can be used as a flag in your language to enable / disable certain features. For example, if you defined a Token that used reflection to import Java objects into your language, you may want to restrict method invocations to avoid unwanted code being run (code injection attacks if running on a server).
| STRICT_SYNTAX      | Boolean | If this option is enabled then all values in an expression must have a matching Token to be written to. If this is enabled and no [Reference Token](tokens/references.md) is used then all names of variables, functions and types will throw an lexing error. Using a Reference Token along with this option being enabled is the recommended approach to ensure correct syntax checking. However, there are exceptions where you may not want to use this.
| NOTATION_TYPE      | ExpressionNotationType | This determines the order in which operators and values are evaluated. There are three types which are [PREFIX, INFIX and POSTFIX](parser/prefix-infix-postfix.md).
| CODE_BLOCK_STYLE   | CodeBlockStyle | 
| WHITESPACE_VALUE   | String |
| STRICT_WHITESPACE  | Boolean | 
| LANGUAGE_TYPED     | LanguageTyped | 
| FLAG_NATIVE_ERRORS | Boolean |
| JVM_TRACE_LIMIT    | Integer |
| JUMP_SUPPORT       | Boolean |
| FORWARD_JUMPING    | Boolean | 
| GLOBAL_SCOPE       | Boolean |
| CASE_SENSITIVE     | Boolean |

#### Custom Properties