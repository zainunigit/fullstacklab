let givenNumber = 11;
let nextNumber = givenNumber + 1;
let isPrime = false;

while (true) {
    isPrime = true;

    for (let i = 2; i < nextNumber; i++) {
        if (nextNumber % i === 0) {
            isPrime = false;
            break;
        }
    }

    if (isPrime) {
        console.log("Next prime number: " + nextNumber);
        break;
    }

    nextNumber++;
}
