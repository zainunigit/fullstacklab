function formatPhoneNumber(numbers) {
    return "(" + numbers[0] + numbers[1] + numbers[2] + ") " +
        numbers[3] + numbers[4] + numbers[5] + "-" +
        numbers[6] + numbers[7] + numbers[8] + numbers[9];
}

var numbers = [2, 4, 1, 8, 2, 5, 7, 3, 6, 9];
console.log(formatPhoneNumber(numbers));
