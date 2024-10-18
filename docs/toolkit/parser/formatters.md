---
sidebar_position: 2
---
# Formatters
:::tip Time and Place
You only need to start writing formatters once you start dealing with arrays, maps and custom structures that you'd
want to return from your language. They are easy to write but only come later once you've laid the basic types
and statements.
:::
Formatters allow the evaluated result to be converted into a native language variant. This is because all values within
the parser are processed in Token form. In order to convert them so that the are treated as simple Java primitives, 
collections or objects, you need to unwrap these back to their native forms. For an example, if you're dealing
with arrays or collections of values within your own language and want to return that result, you'll need to write
a formatter which converts it from it's token structure. This is easier than you may think so let's a look at an example:
```java
/**
 * Recursively scans all elements in the collection and converts the Token types into Java 
 * native types.
 */
public class CollectionFormatter extends Formatter<Collection<?>> {

    @Override
    public boolean isMatch(Object object) {
        return object instanceof Collection;
    }

    @Override
    public Optional<Collection<?>> format(Object object) {
        Collection<?> collection = ((Collection<?>)object);
        if (collection.stream().allMatch(v -> v instanceof Token<?>)) {
            return Optional.of(collection.stream()
                    .map(v -> ((Token<?>)v))
                    .map(this::recursiveUnwrap)
                    .collect(Collectors.toList()));
        }
        return Optional.empty();
    }
}
```
This class extends the base Formatter class and passes a generic type identifying the type that it is to handle. There is
a required ``isMatch`` method which compares the result object against the formatters type to determine whether it is a
match. The ``format`` method takes the object and maps it to the correct class so it can be handled. It then loops through
all items in the collection which are of type Token<?> and unwraps them using the in-built ``recursiveUnwrap`` method. The
collection is then returned via the processor with just the raw values.

Depending on what is returned from your language, you'll likely need to write one of these to convert the result. To do this 
you can create your own formatter by extending the ``Formatter<T>`` class in the same way above. To configure LARF to use your
formatter, you simply add the following into your config class:
```java
    @Override
    protected void initParserFormatters() {
        addParserFormatter(new CollectionFormatter());
    }
```
This new formatter will then be picked up and convert the results automatically. Here is another example of a formatter
which converts a Map<K,V> structure:
```java
/**
 * Recursively scans all elements in the map and converts both the Key / Value's from 
 * their Token types into Java native types.
 */
public class MapFormatter extends Formatter<Map<?,?>> {
    @Override
    public boolean isMatch(Object object) {
        return object instanceof Map;
    }

    @Override
    @SuppressWarnings("unchecked")
    public Optional<Map<?, ?>> format(Object object) {
        Map<?,?> collection = ((Map<?,?>)object);
        if (collection.entrySet().stream()
                .allMatch(e -> e.getKey() instanceof Token<?> && e.getValue() instanceof Token<?>)) {
            //Suppress warnings as it doesn't recognise the check we've made
            Map<Token<?>, Token<?>> tokenMap = (Map<Token<?>, Token<?>>)collection;
            return Optional.of(tokenMap.entrySet().stream()
                    .collect(Collectors.toMap(e -> e.getKey().getValue(), 
                        e -> e.getValue().getValue())));
        }
        return Optional.empty();
    }
}
```