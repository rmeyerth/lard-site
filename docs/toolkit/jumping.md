---
sidebar_position: 10
---
# Jumping
![Jumping](/img/jumping.jpg)
Jumping (alternatively goto) is an old concept where you can skip to a certain point in the code identified by a label.
This was traditionally used in Assembly, Fortran, COBOL and C to name a few. There are several reasons why modern
languages abandoned the concept:
- Spaghetti Code: Using jumps or goto statements can lead to what is known as "spaghetti code," where the flow of the 
program becomes tangled and difficult to follow. This makes the code hard to read, maintain, and debug.
- Structured Programming: The rise of structured programming paradigms in the 1970s and 1980s emphasized the use of 
control structures like loops (for, while) and conditionals (if, else) instead of jumps. This approach promotes clearer 
and more maintainable code.
- Error-Prone: Jumps can easily lead to logical errors and bugs, especially in large and complex programs. They can 
cause unexpected behavior if not managed carefully.
- Modern Alternatives: Modern programming languages provide more robust and safer alternatives to jumps, such as 
functions, methods, and exception handling mechanisms. These constructs help manage the flow of the program in a 
more controlled and predictable manner.
- Best Practices: Over time, best practices in software development have evolved to discourage the use of jumps. Code 
readability, maintainability, and reliability are prioritized, and structured programming techniques are preferred.

So, afer I've explained why languages no longer use them why has jump support been added to LARF? This is purely
for backwards compatibility purposes. Working on one of the examples during the development phase ([My Assembly Language](../examples/mal)),
I found I was missing this basic feature and decided to implement it. Whether you choose to use it or not is your
choice, but below describes the approach as to how you'd do this.
