---
sidebar_position: 11
---
# Could you repeat that?
One of the mainstay features of any language are loops. They come in a number of varieties, but to get us started
we'll concentrate on the for and for-each loops. Up until recently, if you wanted to define either loop type you'd
create two separate token classes and implement the logic for both. As with following OO and re-usability, this has
been improved through the use of grammar references. Let's taken a look at examples of both types in Java:
```java
for (int i = 0;i < 10;i++) { }
```
```java
for (AnObject obj : objectList) { }
```
You'll notice that there are certain similarities between both. They both use the `for` keyword along with the
brackets surrounding the looping criteria. They also share the same body with either a single statement being
executed, or a code block surrounded by curly braces. As mentioned, up until now you'd have to declare two separate
token classes, but also they couldn't share the same token initiator syntax due to limitations with the lexer.
As such, using the older version you had to not just 