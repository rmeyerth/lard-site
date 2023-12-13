---
sidebar_position: 8
---
# Operators
Operators can be broken down into 5 distinct types:
1. Arithmetic (Add, Subtract, Multiply, Divide, Modulo etc)
2. Assignment (Assign, Subtract Equals, Add Equals, Multiply Equals etc)
3. Bitwise - (AND, OR, XOR, NOT, Left Shift, Right Shift)
4. Comparison - (Greater Than, Less Than, Equal, Not Equal etc)
5. Logical - (And, Or)

To add these to your language there is an equivalent template class for each type defined within LARF. Using Arithmetic
operators as an example, if we wanted to define our operator set we would create a new class e.g. MyArithmeticOperators 
and extend that class by ArithmeticOperator. This would require us to define several methods:
```java
public class SLOPArithmeticOperator extends ArithmeticOperator {

    public SLOPArithmeticOperator(String value) {
        super(value);
    }

    @Override
    public Token<String> createToken(String value) {
        return new SLOPArithmeticOperator(value);
    }

    @Override
    public String getPattern() {
        return "^(\\+\\+|--|\\+|-|\\*|\\/|%)";
    }

    @Override
    protected void initOperators() {
        addOperator("+", ArithmeticOperatorType.ADD);
        addOperator("-", ArithmeticOperatorType.SUBTRACT);
        addOperator("*", ArithmeticOperatorType.MULTIPLY);
        addOperator("/", ArithmeticOperatorType.DIVIDE);
        addOperator("%", ArithmeticOperatorType.MODULO);
        addOperator("++", ArithmeticOperatorType.INCREMENT);
        addOperator("--", ArithmeticOperatorType.INCREMENT);
    }

    @Override
    public String[][] getOperatorOrder() {
        return new String[][] {
                {"++", "--"},
                {"*", "/", "%"},
                {"+", "-"}
        };
    }
}
```
This class is used to match and store each operator as it is found in code. The pattern is a regular expression used to
make the initial match and is then stored as a value via the createToken method / constructor. This class also defines
the supported operator types as well as what their String equivalent should be. These are defined in the ``initOperators``
method using the ``addOperator(..)`` method. For an arithmetic operator, we define each type by using the 
ArithmeticOperatorType enum.

:::danger Ensure correct regex order

Please ensure that you've declared your regular expression pattern correctly. Otherwise this could lead to an operator
never being matched if another one matches less characters that precedes it. For example, placing ``+`` before ``++`` 
would cause this scenario. This is because an increment would be matched as two add operators. As such, when defining
your pattern, ensure you place the longer match before the shorter one e.g. ``^(\\+\\+|\\+)``

:::

Operator classes for the most part use a similar naming style, but for completeness please the full table is below:

| Operator Type | Template Class   | Type Enum              |
|---------------|------------------|------------------------|
| Arithmetic    | ArithmeticOperator | ArithmeticOperatorType |
| Assignment    | AssignmentOperator | AssignmentOperatorType |
| Bitwise       | BitwiseOperator  | BitwiseOperatorType    |
| Comparison    | ComparisonOperator | ComparisonOperatorType |
| Logical       | LogicOperator    | LogicalOperatorType    |


### Custom Operators
You are not restricted to using those common operators. If you'd like to define them all yourself or just a single set, 
you can follow the following steps:
1. Create a new enum class that represents your custom operators
   ```java
   public enum MyCustomOperators {
       SQUARE,
       SQUARE_ROOT
   }
   ```
2. Define a concrete class for your Operators e.g. CustomOperators and extend the OperatorHandler class while passing 
   in your enum as a generic type:
   ```java
   public class CustomOperatoes extends OperatorHandler<MyCustomOperators> {
       protected ArithmeticOperator(String value) {
           super("Arithmetic Operator", value);
       }

       @Override
       public PatternType getPatternType() {
           return PatternType.REGEX;
       }

       @Override
       public Optional<String> getGuidance(String token, List<Integer> groupsCount) {
           return Optional.empty();
       }

       @Override
       public List<Token<?>> process(LARFParser parser, LARFContext context, LARFConfig config) {
           return Collections.singletonList(this);
       }
   
       @Override
       public String getPattern() {
           return "^(^|_/)";
       }

       @Override
       protected void initOperators() {
           addOperator("^", MyCustomOperators.SQUARE);        // 4 ^ 2 (16)
           addOperator("_/", MyCustomOperators.SQUARE_ROOT);  // _/4   (2)
       }

       @Override
       public String[][] getOperatorOrder() {
           return new String[][] {
                {"^", "_/"}
           };
       };

       @Override
       public int getHandlerOrder() {
           return 1;
       }
   }
   ```