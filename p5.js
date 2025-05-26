// Function to get prime factors of a number
function getPrimeFactors(n) {
  const factors = [];

  // Extract the factor 2 until n is odd
  while (n % 2 === 0) {
    factors.push(2);
    n /= 2;
  }

  // Check for odd factors up to sqrt(n)
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    while (n % i === 0) {
      factors.push(i);
      n /= i;
    }
  }

  // If n is still greater than 2, it's a prime
  if (n > 2) {
    factors.push(n);
  }

  return factors;
}

// Event listener for button click
document.getElementById('calculateBtn').addEventListener('click', () => {
  const input = document.getElementById('numberInput');
  const res = document.getElementById('result');
  const number = parseInt(input.value);

  res.textContent = ''; // Clear previous output

  if (isNaN(number) || number < 1) {
    res.textContent = 'Please enter a valid positive integer';
    return;
  }

  const factors = getPrimeFactors(number);
  res.textContent = `Prime factors of ${number}: ${factors.join(' × ')}`;
});
