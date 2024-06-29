---
sidebar_position: 1
---

# Introduction
LARF is a tool that makes it easy to create interpreted programming languages. It does this by providing a high-level
API that allows you to focus on the building blocks of your language, called tokens. Tokens are matched from expressions
and represent operators, literals and statements. You can also customize other aspects of your language, such as its
core functions, expression notations, and precedence rules. This means that you can create a language that is tailored
to your specific needs without having to worry about the low-level details of lexing and parsing.

The default library gives you a clean slate to create your language from scratch. There are however several starter
projects and a tutorial to guide you through everything from defining literals and operations all the way up to custom
types. LARF can handle both typed and typeless languages, so let your imagination run wild and create that language
you've always dreamed of.

## Why should you use it?
Writing programming languages is difficult because it requires a deep understanding of computer science concepts,
such as logic, data structures, and algorithms. It also requires a strong understanding of the syntax and semantics of
the programming language being created. In addition, writing a programming language takes a long time because it is a
complex process that involves many different steps. These steps include:

- Defining the language's grammar and syntax
- Designing the language's data types and operators
- Implementing the language's runtime system
- Writing the language's standard library
- Testing the language's correctness and performance
- Documenting the language's features and usage

Even after all of these steps have been completed, the language may still need to be improved or updated over time.
This is because new features are constantly being developed, and the language needs to be able to adapt as new ideas 
are introduced. This is where LARF can help as it is built around the concept of adaptability and change. LARF 
provides the following:

- Simple to learn and use: The LARF API is well-documented and easy to understand. Even if you have no prior experience
  with language development, you should be able to get up and running quickly.
- Large number of features: Aside from the ability to customise nearly every aspect of LARF, the framework provides
  a lot of features included in the basic package. These include support for whitespace (inferred or fixed), expression 
  notation customisation (infix, prefix and postfix), custom operators, typed / types languages, error handling and much more.
- Fast development time: LARF takes care of the low-level details of lexing and parsing so that you can focus on the
  more important aspects of language development, such as syntax and semantics. This can save you a lot of time and effort.
- Powered by Java: LARF is written in Java, which is a multi-platform, secure, and a well-supported programming language.
  This means that your language will be able to run on a wide range of platforms, including Windows, macOS, and Linux and
  make use of a large number of underlying frameworks to enhance your language.
- Open source: LARF is open source meaning that it is free to use and modify. This can be a valuable benefit should you
  wish to customize LARF to meet your specific needs.
- Actively maintained: LARF has been two years in the making, is actively maintained and has a lot of planned features
  in the pipeline. You can be confident that LARF will continue to be supported and updated. If you do spot any issues,
  please do send an email or raise them on gitlab and these will be fixed ASAP.