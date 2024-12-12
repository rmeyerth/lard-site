---
sidebar_position: 9
---
# Type Operations
![Type Operations](/img/operations.jpg)
Whilst operators are used as an identifier to allow the developer to perform operations on two operands, a 
type operation is the class which defines the action that operator has and the types that are supported. Let's 
look at an example of a simple type operation class:
```java
public class BooleanOperation extends TypeOperation {

    public BooleanOperation() {
        super("BooleanOp");
    }

    /**
     * See {@link TypeOperation#canHandle(Token, OperatorHandler, Token) canHandle}
     */
    @Override
    public boolean canHandle(Token<?> first, OperatorHandler<?> operator, Token<?> second) {
        return first.is(Boolean.class) && second.is(Boolean.class);
    }

    /**
     * See {@link TypeOperation#process(LARFConfig, LARFContext, Token, OperatorHandler, Token, 
     * UnhandledEvent) process}
     */
    @Override
    public Token<?> process(LARFConfig config, LARFContext context, Token<?> first, 
                            OperatorHandler<?> operator, Token<?> second, 
                            UnhandledEvent unhandledEvent) {
        boolean result = false;
        if (operator instanceof ComparisonOperator) {
            switch (((ComparisonOperator)operator).getOpType()) {
                case EQUAL: result = first.getValue(Boolean.class).equals(
                                     second.getValue(Boolean.class)); 
                            break;
                case NOT_EQUAL: result = !first.getValue(Boolean.class).equals(
                                         second.getValue(Boolean.class)); 
                            break;
                default: return unhandledEvent.trigger();
            }
        } else if (operator instanceof AssignmentOperator) {
            switch (((AssignmentOperator)operator).getOpType()) {
                case ASSIGN: return first.set(context, second);
                default: return unhandledEvent.trigger();
            }
        }
        return new BooleanToken(result);
    }
}
```
This class represents all the operations that can happen with booleans. Breaking this down we can see that there 
are two required methods which are ``canHandle`` and ``process``. The former determines the type compatibility
we want to enforce against the two operands. In this case both have to be of type Boolean, but in other scenarios you 
may want to be more flexible. Let's take a closer look at the definition of the ``process`` method. It has six
parameters which are the following:
1. The configuration object
2. The context object
3. The first operand e.g. **&lt;operand&gt;** &lt;operator&gt; &lt;operand&gt; (**1** + 2)
4. The operator e.g. &lt;operand&gt; **&lt;operator&gt;** &lt;operand&gt; (1 **+** 2)
5. The second operand e.g. &lt;operand&gt; &lt;operator&gt; **&lt;operand&gt;** (1 + **2**)
6. A lambda method which is run when the operator / operand combination is not handled

Next we'll take a look at what the ``process`` method is doing in this situation. It is checking the type of the
operator against each of our defined operator types. There are several sets defined (for more information on this
and you can even create your own. For more information on this please see the [Operators](./operators.md)) section.
Let's take a closer look at one section:
```java
if (operator instanceof ComparisonOperator) {
    switch (((ComparisonOperator)operator).getOpType()) {
        case EQUAL: result = first.getValue(Boolean.class).equals(
                             second.getValue(Boolean.class)); 
                    break;
        case NOT_EQUAL: result = !first.getValue(Boolean.class).equals(
                                 second.getValue(Boolean.class)); 
                    break;
        default: return unhandledEvent.trigger();
    }
}
```
Here we are checking that the operator matches the type comparison. If it is then we compare the operators OpType 
against the enum value defined for each set of operators e.g. Arithmetic, Bitwise, Comparison etc. In each case
we'll perform the operation and set the result to a value. If no cases are matched then the default always calls
the standard ``unhandledEvent.trigger()`` method. For the cases, we could return the result directly in a BooleanToken,
but taking this approach is useful should we want to do logging or debugging.

To handle different sets of operators, it's simply a case of checking the operator against each set for a match. To
register this class, simply add it to the ``initTypeOperations`` methods in your configuration class implementation:
```java
    @Override
    protected TypeOperation initTypeOperations() {
        addTypeOperation(new DateOperation());
        addTypeOperation(new EnumOperation());
        addTypeOperation(new StringOperation());
        addTypeOperation(new NumericOperation());
        addTypeOperation(new BooleanOperation());
        addTypeOperation(new ArrayOperation());
        addTypeOperation(new MapOperation());
        addTypeOperation(new NullOperation());
        //Fallback
        return new ObjectOperation();
    }
```