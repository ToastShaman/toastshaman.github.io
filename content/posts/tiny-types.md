---
title: "Tiny Types: Avoid stringly-typed systems"
date: 2022-08-27T13:30:10+01:00
---

I am a big fan of **tiny types** also known as **micro types** or **value types**.
The idea is simple - all primitives and strings in your code are wrapped by a class, which means you'll never pass any primitives around.

The problem which we are trying to solve is to avoid illegal values entering into our system.
*For this, it is best to use strongly typed values, which allow us to both lean on the compiler and improve the developer experience by engaging with IDE tooling.*

Take the following `sendEmail` method for example.
You can't distinguish between the recipient's email address, subject or body because they are all strings.
The only way to know how to call the method correctly is by paying close attention to the argument names and their position.

```java
public void sendEmail(String recipient, String subject, String body) {
    // ...
}
```

Having to deal with non type-safe methods can easily lead to confusion and is a common source of bugs in my experience.
For example, the `sendEmail` method expects the second argument to be a string containing the subject of the email.
It would be an easy mistake to make to swap the subject with the body of the email.
Additionally, the `sendEmail` method will need to check whether the provided arguments are valid.
For example, can the body or the subject be an empty or blank string?

```java
// compiles without errors
sendEmail(
    "alice@example.com", 
    "Hello Alice, I hope ...", // body - should be the last argument!
    "Reminder: Please RSVP" // subject - should be the second argument!
);
```

Depending on your setup you might not be able to find this bug quickly.
We can achieve [type-safety][1] by applying the concept of tiny types to the `sendEmail` method.

```java
public void sendEmail(Recipient recipient, Subject subject, Body body) {
    // ...
}
```

Once applied, the compiler will fail to compile the code if we're trying to invoke the `sendEmail` method with arguments in the wrong position.

```java
// fails to compile: expected Recipient got Subject
sendEmail(
    Subject.of("Reminder: Please RSVP"),
    Recipient.of("alice@example.com"), 
    Body.of("Hello Alice")
);

// compiles without errors
sendEmail(
    Recipient.of("alice@example.com"),
    Subject.of("Reminder: Please RSVP"),
    Body.of("Hello Alice")
);
```

## How to implement tiny types?

The examples are in Java/Kotlin but can be applied to other strictly typed programming languages.

A simple and ad-hoc approach is to use [Java's record classes][2] to create your domain objects including **validation** at the point of creation!

```java
import static java.util.Objects.requireNonNull;

public record Subject(String value) {
    public Subject {
        if (requireNonNull(value).isBlank()) throw new IllegalArgumentException("must not be blank");
    }

    public static Subject of(String value) {
        return new Subject(value);
    }
}
```

The [parse, don't validate][3] mantra is all about parsing/validating incoming data to a specific type or failing in a controlled manner if the validation fails.
It's about using trusted, safe and typed data structures inside your code and making sure all incoming data is handled at the very **edges** of your system.
**Don't pass incoming data deep into your code, parse it right away and fail fast if needed!**

Alternatively, you can use my [toastshaman/tiny-types][4] implementation with JSON support.

Another great library if you are using Kotlin is [forkhandles/values4k][5].

[1]: https://en.wikipedia.org/wiki/Type_safety
[2]: https://www.baeldung.com/java-record-keyword
[3]: https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/
[4]: https://github.com/ToastShaman/tiny-types
[5]: https://github.com/fork-handles/forkhandles/tree/trunk/values4k