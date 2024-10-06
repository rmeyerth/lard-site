---
sidebar_position: 3
---
# Indent: Typed, Whitespace
Repository: [https://www.gitlab.com/tronied/indent](https://www.gitlab.com/tronied/indent)

This project shows off both typed and whitespace support for languages using LARF. The language shows off features
such as constants, type checking, variables and indentation validation. The scope of the language feature-set is
limited as it is there purely to demonstrate it working rather than matching the functionality of a language like Python.

# Building the project
:::tip Standalone
This project uses a 3rd party tool (Shadow JAR) to ensure that the Jar can be independently run.
:::
To build the project ensure you have gradle and at least Java 8+ installed. Run the command:
```bash
gradle clean shadowJar
```
### Using the Languages Runner
Once the project has been built, to run the runner class type the following:
```bash
java -jar ./build/libs/mal-0.1-all.jar
```
You will then be presented with the following:
```
Indent Language Test Utility
============================
[Multi-line enabled] Please add <newline> + '.' + <return> to the end of a finished expression to evaluate the result.

```
### Running Examples
The language currently has limited functionality, but does support the use of if statements:
```
int i = 1
int j = 2
if i == 1 then
    i = j
    j += 2
    if i == 2 then
        i = j
        j += 2
        if i == 4 then
            return i + j
.
Result: 10 (Type: Integer, Time taken: 71ms)
```
We can test out the indentation validation by using the following:
```
int i = 1
if i == 1 then
    i =
 2
     if i == 2 then
        i = 3
        if i == 3 then
            int j
return i
.
Error: Invalid whitespace used on line 5. Ensure code is uniformly indented using 1 tab or 4 spaces
```
The above shows that line 5 is at fault and not line 4. Line 4 is in fact valid with assignments to variables able to
be set on new lines. Line 5 however does not adhere to the fixed whitespace indentation the language requires. This 
project uses a fixed whitespace indentation which as stated is either 1 tab or 4 spaces. This can be configured to
a different value by using the following via the config object:
```java
config.setProperty((DefaultProperty)DefaultProperty.WHITESPACE_VALUE, (Object)"\t|    ");
```
If you wish don't wish to specify a fixed whitespace value, LARF can identify the whitespace used and set that as the 
rule by which all subsequent code indentation is validated. To do this you can use:
```java
config.setProperty(DefaultProperty.CODE_BLOCK_STYLE, CodeBlockStyle.WHITESPACE_IDENTIFY);
```
To exit the runner, simply type ``exit``.