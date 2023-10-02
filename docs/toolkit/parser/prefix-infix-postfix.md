---
sidebar_position: 3
---
# Prefix, Infix and Postfix
The majority of programming languages follow the standard left-to-right (Infix) execution of values 
and operators. LARD however offers support for alternatives to this, commonly used in mathematical
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
public class AardvarkRunner extends LARDRunner {
    public static void main(String[] args) {
        AardvarkConfig config = new AardvarkConfig();
        config.setNotationType(ExpressionNotationType.PREFIX);
        LARDProcessor processor = new LARDProcessor(config);
        run("Aardvark Language", processor);
    }
}
```