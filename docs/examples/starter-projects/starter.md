---
sidebar_position: 1
---
# Starter: Basic Literals / Operations
![Starter](/img/starter.jpg)
Repository: [https://www.gitlab.com/tronied/larf-starter](https://www.gitlab.com/tronied/larf-starter)

This is a starter project for Language Architect and Runtime Framework (LAF). It contains a basic set of
configured types as well as a runner and gradle project in order to get started quickly. This can then
be used as a base for how you'd like to configure your project, whether that's typed or typeless, use 
code-blocks or whitespace indentation or have an alternative notation type.

# Building the project
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
Starter Language Test Utility
=============================

```
### Verifying the basic types
The basic set of literal types can be found in the tokens/literal package. These are configured in the StarterConfig
which is found in the config package. To test that the basic types are loaded, we can do the following:
```
Starter Language Test Utility
=============================
1.5
Result: 1.5 (Type: BigDecimal, Time taken: 14ms)
1.5F
Result: 1.5 (Type: Float, Time taken: 2ms)
123456789L
Result: 123456789 (Type: Long, Time taken: 5ms)
12
Result: 12 (Type: Integer, Time taken: 1ms)
true
Result: true (Type: Boolean, Time taken: 2ms)
'hello'
Result: hello (Type: String, Time taken: 1ms)
"hello"
Result: hello (Type: String, Time taken: 1ms)
```
To exit the runner, simply type ``exit``.