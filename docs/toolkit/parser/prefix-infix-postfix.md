---
sidebar_position: 3
---
# Prefix, Infix and Postfix
The majority of programming languages follow the standard left-to-right (Infix) execution of values 
and operators. LARF however offers support for alternatives including Prefix and Postfix which are 
more commonly used in mathematical notation. To change the expression notation type, a method on the
configuration class called ``config.setNotationType()`` can be used which accepts a ExpressionNotationType
argument. An example of running a language with prefix notation would be:
```java
public class PrefixRunner extends LARFRunner {
    public static void main(String[] args) {
        PrefixConfig config = new PrefixConfig();
        //ExpressionNotationType: INFIX [Default], PREFIX, POSTFIX
        config.setNotationType(ExpressionNotationType.PREFIX);
        LARFProcessor processor = new LARFProcessor(config);
        run("My Prefix Language", processor);
    }
}
```
### Infix Notation
This is enabled by default and follows the typical pattern where an operator is placed between two
values. For example, ``1 + 2`` moves from left to right by first taking the 1, then adding the
result to the value on the right-side. This can differ dependent on the operator order defined in
the operator handler classes (see [getOperatorOrder](/docs/toolkit/operators.md)). For example,
given the default BODMAS operator order, with the following ``1 + 2 * 3`` the multiplication calculation
will be performed before the addition. There is a way to influence the order of this using braces e.g.
``(1 + 2) * 3`` which would evaluate the contents of the brackets during the execution operation (see
[Making a Statement](/docs/tutorial/make-a-statement.md)).
### Prefix Notation
Prefix notation works by placing the operators before each pair of values. For example, using the
above example of adding 1 and 2, this would be ``+ 1 2``. Operator order is not needed for Prefix
and Postfix notation because the order in which the operations are defined tell the parser how
to execute it. Using the above example of addition and multiplication, this would now become
``+ 1 * 2 3``. Going from right to left, we can see our first pair of numbers are 2 and 3. We then
read our first operator which is multiply which gives 6. We then come across another number (1) and
the final operator (1 add 6) to give 7.
```
Prefix Language Test Utility
============================
+ 1 * 2 3
Result: 7 (Type: Integer, Time taken: 5ms)
```
### Postfix Notation
Postfix notation scans for an operator from left-to-right. If we take the example ``1 2 +``, we scan
until we find the ``+`` then take the two operands to the left to execute. If we expand that to include
a multiplication where 2 is multiplied by 3, this would become ``1 2 3 * +``. Like Prefix, operator order
is defined by the layout, so scanning from left-to-right again, the first operation we come to is ``2 3 *``.
Once we evaluate that and get the result 6, we then move to the next operator which is ``+`` and now have
``1 6 +`` which results in 7.
```
Postfix Language Test Utility
============================
1 2 3 * +
Result: 7 (Type: Integer, Time taken: 5ms)
```