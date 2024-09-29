---
sidebar_position: 3
---
# Context
The context object is used primarily as storage and is accessible from any token via the ``process`` method.
. The first of these are those that are stored prior to
evaluation of an expression or segment of code. These values can be referenced directly within the code e.g.
```java
public static void main(String[] args) {
    SLOPConfig config = new SLOPConfig();
    LARFContext context = new LARFContext();
    context.set("acme", sampleCompany());
    LARFProcessor processor = new LARFProcessor(config);
    System.out.println(processor.process("acme.employees[0].name", context).getValue(String.class));
}
```
Support for this is up to the developer and requires them to add support through tokens implemented in their
language. These can then access these stored values in context to resolve values or perform additional functions.
It automatically manages state and scope and provides additional features such as recursion without the need
from any additional configuration from the developer.