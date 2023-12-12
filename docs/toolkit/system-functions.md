---
sidebar_position: 7
---
# System Functions
System functions provide the ability to include functionality in their language that would not be easy to implement 
within the language itself. It does this by deferring calls to the underlying language which, in this case is Java. 
Let's look at an example of a function to print to the console:
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

You can return values from our function, but in the above situation we are not and instead return a null. Here are some
examples of this in the language runner:
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
