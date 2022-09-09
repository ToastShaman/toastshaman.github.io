---
title: "Testing With Fake Data"
date: 2022-09-09T10:00:00+01:00
tags: ['programming', 'testing', 'tdd', 'kotlin']
---

I've recently come to the conclusion that maintaining test data is in most cases not helpful in conveying the intention of a unit test.
Even worse, if the test data is not kept up-to-date with changing requirements, which will only add to the confusion as to what a particular unit test is trying to achieve.
The approach I have been using recently is to randomly generate test data in my unit tests and only overwrite specific values if they are necessary for the test I am writing.

## How

Libraries such as [Java Faker][1], [Datafaker][2] and [fabrikate4k][3] provide everything you need to get started.
A nice pattern to follow is to write an [extension function][4] for your data classes called `random` which will generate a new instance with random values.
You can use the `copy()` function on [data classes][5] to copy an object, allowing you to alter some of its properties while keeping the rest unchanged.

```kotlin
data class Person(
        val name: String,
        val age: Int,
        val address: Address
    ) {
        companion object
    }

    data class Address(val zip: String) {
        companion object
    }

    private fun Person.Companion.random(random: Random = Random) =
        Faker(Locale.UK, random.asJavaRandom()).run {
            Person(
                name = name().fullName(),
                age = number().numberBetween(1, 100),
                address = Address.random(random)
            )
        }

    private fun Address.Companion.random(random: Random = Random) =
        Faker(Locale.UK, random.asJavaRandom())
            .run { Address(zip = address().zipCode()) }

    private val isOfVotingAge: (Person) -> Boolean = { it.age >= 18 }

    @Test
    fun `is person of voting age`() {
        val person = Person.random().copy(age = 18)
        expectThat(isOfVotingAge(person)).isTrue()
    }
}
```

In the above example you can see that our test is very concise and only sets up the necessary data to determine whether a person is of voting age.

## Repeatability

Occasionally you might find yourself in a situation where you want to generate the data randomly but still have the ability to assert the generated values.
This can be easily achieved by supplying a pre-determined seed to the random function which will ensure that the values are generated deterministically.

```kotlin
@Test
fun `has valid address`() {
    val person = Person.random(Random(1111))
    expectThat(person)
        .get(Person::address)
        .get(Address::zip)
        .isEqualTo("ZS8M 3AH")
}
```

As you can see in the above snippet we're asserting that the ZIP code is equal to `ZS8M 3AH`.
No matter how many times we'll run this test, the ZIP code will always be the same.
This is because we initialised the random number generator with a seed of `1111`.

## Conclusion

Testing using fake/randomly generated data helps to reduce the amount of boilerplate and setup in your unit tests.
Additionally, it'll make the tests more concise, easier to maintain and generally improve them to communicate their intent.

[1]: https://github.com/DiUS/java-faker
[2]: https://www.datafaker.net/
[3]: https://github.com/fork-handles/forkhandles/tree/trunk/fabrikate4k
[4]: https://kotlinlang.org/docs/extensions.html
[5]: https://kotlinlang.org/docs/data-classes.html
