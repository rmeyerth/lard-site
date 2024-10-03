---
sidebar_position: 5
---
# My Assembly Language (MAL)
This project was a proof of concept for an assembly language interpreter in LARF. The scope of this project 
was limited to the following code sample, but could be expanded further in the future.
```asm
section .data
    counter db 1
    sum     db 0

section .text
    global _start

_start:
    ; loop from 1 to 5
    loop:
        ADD [sum], [counter] ; add counter to sum
        inc byte [counter]   ; increment counter
        cmp [counter], 5     ; compare counter with 5
        jle loop             ; if counter <= 5, jump to loop

    ; exit with sum as status code
    movzx eax, byte [sum]   ; zero-extend sum to 32 bits
    int 0x80                ; call kernel
```
Whilst I could use existing features for the majority, there were one or two missing features I needed to 
make this possible. These were jump and label support which, up until then was not possible. I added new 
parser flags with support for this behaviour into the Parser. A pre-scan for labels is undertaken prior 
to execution. This allows the program to jump to that point (both forwards and backwards) without any 
additional effort by the developer. Jumping is disabled by default but can be enabled, along with several
other properties. This is how MAL is currently configured:
```java
setProperty(DefaultProperty.FORWARD_JUMPING, true);
setProperty(DefaultProperty.GLOBAL_SCOPE, true);
setProperty(DefaultProperty.CASE_SENSITIVE, false);
setProperty(DefaultProperty.JUMP_SUPPORT, true);
```
Global scope ensures that declared variables are accessible within the programme. Forward jumping has also
been enabled, but this is typically not a feature of most languages. The project uses the context to store
values in each operation under the associated register names.
### Compiling the project
To compile the project run the following command in the main projects folder:
```bash
gradle clean shadowJar
```
### Running the project
Once the project has been built, to run runner class type the following:
```bash
java -jar ./build/libs/mal-0.1-all.jar
```
You will then be presented with the following:
```
My Assembly Language Test Utility
=================================
[Multi-line enabled] Please add <newline> + '.' + <return> to the end of a finished expression to evaluate the result.

```
