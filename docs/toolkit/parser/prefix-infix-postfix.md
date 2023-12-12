---
sidebar_position: 3
---
# Prefix, Infix and Postfix
The majority of programming languages follow the standard left-to-right (Infix) execution of values 
and operators. LARF however offers support for alternatives to this, commonly used in mathematical
notation called Prefix and Postfix.
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
```java
public class AardvarkRunner extends LARFRunner {
    public static void main(String[] args) {
        AardvarkConfig config = new AardvarkConfig();
        config.setNotationType(ExpressionNotationType.PREFIX);
        LARFProcessor processor = new LARFProcessor(config);
        run("Aardvark Language", processor);
    }
}
```
Prefix notation works by placing the operators before each pair of values. For example, using the
above example of adding 1 and 2, this would be ``+ 1 2``. Operator order is not needed for Prefix
and Postfix notation because the order in which the operations are defined tell the parser how
to execute it. Using the above example of addition and multiplication, this would now become
``+ 1 * 2 3``. Going from right to left, we can see our first pair of numbers are 2 and 3. We then
read our first operator which is multiply which gives 6. We then come across another number (1) and
the final operator (1 add 6) to give 7.
### Postfix Notation