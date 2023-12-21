---
sidebar_position: 7
---
# System Functions
System functions provide the ability to include functionality in their language that would not be easy to implement 
within the language itself. It does this by deferring calls to the underlying language (Java). Let's look at an example 
of a default function provided in the LARF framework to print to the console:
```java
public class PrintFunction implements SystemFunction {
    @Override
    public boolean isMatch(String name) {
        return name.equalsIgnoreCase("PRINT");
    }

    @Override
    public Token<?> execute(LARFConfig config, List<Token<?>> values) {
        if (values.size() == 2) {
            throw new ParserException("PRINT expects 1 or 3 or more parameters. Either a value to print e.g. PRINT('test') " +
                    "or with the delimiter used to join values as the firs parameter e.g. PRINT(' ','hello','world'");
        }
        if (values.size() == 1) {
            System.out.println(values.get(0).toSimpleString());
        } else {
            String formatted = values.subList(1,values.size()).stream()
                    .map(Token::getValue)
                    .map(Object::toString)
                    .collect(Collectors.joining(values.get(0).getValue(String.class)));
            System.out.println(formatted);
        }
        return new NullToken();
    }
}
```
We can see that the PrintFunction extends a class called ``SystemFunction``. This interface defines two methods which
are ``isMatch`` and ``execute``. The first is used to associate a name with the code so that it can be called from
within the language. When calling in the language, we preface our function name with ``sys:``, so for the above we 
would use ``sys:print`` or ``sys:PRINT`` as it is case insensitive.

The second method is where the logic will go which gets executed when that function is called. You'll notice that
the config and a list of values are called. These values are the parameters that were passed to the function in the 
language. As such, if we wrote ``sys:print('hello world')``, there would only be a simple String token value in the 
list of values. The above method has two modes which are to accept a single value to print out to the console, or
alternatively accept multiple where the first parameter becomes a delimiter. For example, ``sys:print(',','bob','mary')``
would print out to the console in the language ``bob,mary``.

You can return values from our function, but in the above situation we are not and instead return a null. As this is
an in-built function, it is already configured and available to use. Here are some examples of this in the language runner:
```
Language Test Utility
=====================
sys:print('hello world')
'hello world'
Result: null (Type: Null, Time taken: 11ms)
sys:print(',','mary','bob')
mary,bob
Result: null (Type: Null, Time taken: 1ms)
sys:print(' ','the','sheep','jumped','over','the','moon')
the sheep jumped over the moon
Result: null (Type: Null, Time taken: 1ms)
```
System functions provide a bridge between the LARF language and LARF's native language (Java). Because they support 
returning values, it means we can use the result of that code within our own languages.

:::tip Not to be confused...

System functions should not be confused with functions that you can add support for in your own languages. Functions
are a fairly advanced feature though, so system functions are there to provide system-level functionality or to be 
used as a stand-in until your language has progressed.

:::
### Custom Function
Let's take a look at creating a function to create random numbers:

```java
public class RandomFunction implements Function {

    @Override
    public String getName() {
        return "rand";
    }

    @Override
    public Token<?> execute(SLOPConfig config, List<Token<?>> values) {
        Random random = new Random();
        if (values.size() < 1 || values.size() > 2) {
            throw new ParserException("Expected two arguments e.g. 'RAND('integer', 1000)'");
        }
        if (!(values.get(0).getValue() instanceof String)) {
            throw new ParserException("Expected random type (param 0) to be a String value. " +
                    "Valid values are: 'integer', 'double', 'float', 'long', 'boolean'");
        }
        String type = values.get(0).getValue(String.class);
        if (values.size() == 2) {
            if (!type.equalsIgnoreCase("integer")) {
                throw new ParserException("Bound only supported when using the integer type");
            }
            if (values.get(1).getValue() instanceof Integer) {
                throw new ParserException("The bound parameter must be specified as an integer");
            }
        }
        switch (type) {
            case "integer": return new TokenValue(values.size() == 1 ? random.nextInt() :
                random.nextInt(values.get(1).getValue(Integer.class)));
            case "float": return new TokenValue(random.nextFloat());
            case "double": return new TokenValue(random.nextDouble());
            case "boolean": return new TokenValue(random.nextBoolean());
            case "long": return new TokenValue(random.nextLong());
        }
        throw new ParserException(
                String.format("Unexpected type provided in random function '%s'", type));
    }
}
```
Functions are simple from a code standpoint as they require to only implement the Function interface and methods.
The above will provide the ability to create random numbers using a type parameter to be used in an expression.
It is important when creating functions to check and throw errors if the parameter list is not in the expected
format. The code itself is fairly self-explanatory and will allow it to be called by using the ``rand`` name and two
parameters (the second being restricted on the type). Next we need to add it to our config:
```java
@Override
protected void initFunctions() {
    addFunction(new RandomFunction());
}
```
Finally we are ready to test it out. It can be useful to test any SLOP changes by using the SLOPRunner class in the
test package. This allows expressions to typed in and evaluated after the enter key is pressed. Here is some output
for our new function:
```bash
> rand("integer")
Result: 13788106 (Time taken: 3ms)
> rand("integer",1000)
Result: 730 (Time taken: 5ms)
> rand("integer",100)
Result: 55 (Time taken: 2ms)
> rand("boolean")
Result: true (Time taken: 2ms)
> rand("boolean")
Result: false (Time taken: 2ms)
> rand("float")
Result: 0.5708346 (Time taken: 2ms)
> rand("long")
Result: -7999691372481956837 (Time taken: 1ms)
```
Functions can then be used in conjunction with other values to trigger an action or resolve a value:
```
> 3.1459 * rand("float")
Result: 0.20246804 (Time taken: 1ms)
```
Although this is just an example, it shows that we can leverage the underlying native language to fulfill either
shortfalls in what is possible with the included literals and statements or to avoid overly complex expressions.
Imagine a banking application where we have customers stored on a database. We could setup a custom notification
stored on a record that is associated with a specific customer which is triggered each day or whenever a change
is made to their account. The following will notify them if their main account falls below £250 and it's still
less than or equal to the 15th of each month:
```
customer.mainAccount.total < 250.00 and DAY("LTE", 15) ? EMAIL_WARNING(customer) : null
```