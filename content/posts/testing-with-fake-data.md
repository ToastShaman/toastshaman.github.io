---
title: "Testing With Fake Data"
date: 2022-08-29T17:54:17+01:00
tags: ['programming', 'testing', 'tdd']
draft: true
---

I've recently come to the conclusion that setting-up and maintaining test data is in most cases not helpful in conveying the intention of a unit test.

```kotlin
data class User(
        val lastName: String,
        val firstName: String,
        val address: String,
        val age: Int
    ) {
        companion object
    }

private fun User.Companion.random(random: Random = Random) =
    Faker(Locale.UK, random.asJavaRandom())
        .run {
            User(
                name().lastName(),
                name().firstName(),
                address().fullAddress(),
                number().numberBetween(18, 99)
            )
        }

@Test
fun dd() {
    println(User.random())
}
```

[datafaker](https://github.com/datafaker-net/datafaker/)

// User(lastName=Casper, firstName=Randall, address=Apt. 183 92333 Jacobson Dam, South Pat, MI WR24 0JZ, age=37)