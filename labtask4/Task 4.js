function roundMe() {
    if (arguments.length === 0) {
        return 0;
    }

    if (arguments.length === 1) {
        return Math.round(arguments[0]);
    }

    var roundedValues = [];

    for (var i = 0; i < arguments.length; i++) {
        roundedValues.push(Math.round(arguments[i]));
    }

    return roundedValues;
}

console.log(roundMe());
console.log(roundMe(4.7));
console.log(roundMe(4.7, 4.4));
