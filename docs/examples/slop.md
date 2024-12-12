---
sidebar_position: 4
---
# SLOP: Typeless, Codeblocks
![SLOP](/img/slop.jpg)
Repository: [https://www.gitlab.com/tronied/larf-slop](https://www.gitlab.com/tronied/larf-slop)

This is a project that started off as a proof of concept, grew and eventually inspired me to write a framework to 
create other interpreted languages (LARF). That project code now depends on that framework in order to operate and
is the most fully featured language I have created yet. As features were added to LARF during the development phase,
they were tested out on SLOP and added to the increasing suite of tests. This original version of this project was
published to Maven Central and has its own [website](https://www.slop.dev). The language itself uses code-blocks and is typeless.
If you'd like to learn more about the syntax then please checkout out the website. This variant of the project is 
more feature rich then the original and uses all the latest features added to LARF including error handling, 
type support and much more.

I am in the process of updating the existing documentation, however I would recommend looking at the LARF documentation 
or the unit tests for the latest features and functionality.
### Building the project
:::tip Standalone
This project uses a 3rd party tool (Shadow JAR) to ensure that the Jar can be independently run.
:::
To build the project ensure you have gradle and at least Java 8+ installed. Run the command:
```bash
gradle clean shadowJar
```
This will create the projects JAR within the ``./build/libs`` folder.

### Using the Languages Runner
Once the project has been built, to run the included runner class type the following:
```bash
java -jar ./build/libs/larf-starter-0.1-all.jar
```
You will then be presented with the following:
```
SLOP Language Test Utility
==========================
[Multi-line enabled] Please add <newline> + '.' + <return> to the end of a finished expression to evaluate the result.

```
### Running Examples:
Here are some examples from the tests. This demonstrates a function which calculates fibonacci to n places:
```
memMap = {};
func fastFib(n) {
    if (n <= 1) return n;
    first = memMap.get(n - 1);
    second = memMap.get(n - 2);
    result = (first == null ? fastFib(n - 1) : first) + (second == null ? fastFib(n - 2) : second);
    memMap += {n -> result};
    return result;
}
return fastFib(47);
.
Result: 2971215073 (Type: BigInteger, Time taken: 293ms)
```
Simple looping:
```
count = 0;
for (i++;0;<10) {
    if (i % 2 == 0) continue;
    count = count + 1;
}
return count;
.
Result: 5 (Type: Integer, Time taken: 15ms)
```
Error handling:
```
type ErrorTestChild <- ErrorTestParent {
   func errorNotHandled() {
       return throwsError();
   }
}

type ErrorTestParent() {
   func throwsError() {
       throw new CustomUncheckedError("hello world");
   }
}

type CustomUncheckedError <- RunError {
   this(message) {
       super(message);
   }
}

return new ErrorTestChild().errorNotHandled();
.
```
You will be presented with the following error:
```
Unhandled RunError: hello world
================================
Operation: None
SLOP Trace:
  at ErrorTestParent.throwsError(Expression:9)
  at ErrorTestChild.errorNotHandled(Expression:3)
  at Default.None(Expression:19)

 (Type: String, Time taken: 26ms)
```
The above demonstrates error handling where a RunError is thrown and propagated up through the call stack. If we 
changed this whereby CustomUncheckedError extends a checked ``Error``, we would get this error:
```
Unhandled Error: Checked error(s) CustomUncheckedError not caught or thrown on by Function throwsError
=======================================================================================================
Operation: Unknown
SLOP Trace:
  at ErrorTestParent.throwsError(Expression:8)
  at ErrorTestChild.errorNotHandled(Expression:3)
  at Default.None(Expression:19)

 (Type: String, Time taken: 8ms)
```
These are just a few examples of the feature set available in the latest version of LARF and SLOP. To exit
the runner, simply type ``exit`` and return.