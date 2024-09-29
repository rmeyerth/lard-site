---
sidebar_position: 2
---
# Aardvark Tutorial Language
URL: [https://gitlab.com/tronied/aardvark](https://gitlab.com/tronied/aardvark)

This language was created to take a developer through a step-by-step guide along the process of creating a new language
from scratch using LARF. This project will be modified as more steps are added.

### Build Project
:::tip Standalone
This project uses a 3rd party tool (Shadow JAR) to ensure that the Jar can be independently run.
:::
To build the project ensure you have gradle and at least Java 8+ installed. Run the command:
```bash
gradle clean shadowJar
```

### Using the Languages Runner
Each language created with LARF has the option to use a runner tool. This allows the language to have commands be run
from the command line in the created language. This project has been configured to launch the runner from the Jar. To
do this simply run the command:
```bash
java -jar ./build/libs/aardvark-0.2-all.jar
```
You will then be presented with the following:
```bash
Aardvark Language Test Utility
==============================

```
You can then run expressions to be executed in the language:
```bash
Aardvark Language Test Utility
==============================
'hello' + 1
Result: hello1 (Type: String, Time taken: 23ms)
1.5 / 3
Result: 0.5 (Type: Double, Time taken: 5ms)
1.5 / 4
Result: 0.375 (Type: Double, Time taken: 2ms)
10 / 3
Result: 3.333333 (Type: Double, Time taken: 2ms)
exit
```

### Further notes
Please feel free to modify this project or use it as the base for your own creations. If you have any problems
building or running this project, please get in contact by sending an email to rmeyer@hotmail.co.uk