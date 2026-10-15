function abs() {
    if (arguments.length === 0) {
        return 0;
    }

    if (arguments.length === 1) {
        return Math.abs(arguments[0]);
    }

    var values = [];

    for (var i = 0; i < arguments.length; i++) {
        values.push(Math.abs(arguments[i]));
    }

    return values;
}

function ceil() {
    if (arguments.length === 0) {
        return 0;
    }

    if (arguments.length === 1) {
        return Math.ceil(arguments[0]);
    }

    var values = [];

    for (var i = 0; i < arguments.length; i++) {
        values.push(Math.ceil(arguments[i]));
    }

    return values;
}

function floor() {
    if (arguments.length === 0) {
        return 0;
    }

    if (arguments.length === 1) {
        return Math.floor(arguments[0]);
    }

    var values = [];

    for (var i = 0; i < arguments.length; i++) {
        values.push(Math.floor(arguments[i]));
    }

    return values;
}

console.log(abs(-4, 7, -2.5));
console.log(ceil(4.2, 5.8, -2.3));
console.log(floor(4.9, 5.1, -2.3));
