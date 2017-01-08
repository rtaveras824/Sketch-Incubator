function fibonacci (n) {
	if (n === 1) {
		return 1;
	} else if (n < 1) {
		return false;
	} else {
		var fib = [];
		var first = 1;
		var second = 1;

		fib.push(first);
		fib.push(second);

		for (var i = 0; i < n - 2; i++) {
			fib.push(fib[i] + fib[fib.length-1]);
		}

		return JSON.stringify(fib);
	}
}

console.log(fibonacci(5));
console.log(fibonacci(7));
console.log(fibonacci(3));