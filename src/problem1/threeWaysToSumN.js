const sumNByFormular = (n) => {
    return n * (n + 1) / 2;
}

const sumByUsingLoop = (n) => {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
}

const sumByUsingWhileLoop = (n) => {
    let sum = 0;
    let i = 1;
    while (i <= n) {
        sum += i;
        i++
    }

    return sum
}