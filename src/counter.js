// FABRI Calculator - Additional Utilities
import * as math from 'mathjs';

// Mathematical functions using math.js library
export const FabriMath = {
  // Factorial function
  factorial: function (n) {
    try {
      return math.factorial(n);
    } catch (error) {
      return NaN;
    }
  },

  // Greatest common divisor
  gcd: function (a, b) {
    try {
      return math.gcd(a, b);
    } catch (error) {
      return NaN;
    }
  },

  // Least common multiple
  lcm: function (a, b) {
    try {
      return math.lcm(a, b);
    } catch (error) {
      return NaN;
    }
  },

  // Check if a number is prime
  isPrime: function (n) {
    if (!Number.isInteger(n) || n <= 1) return false;

    // Use math.js isPrime if available, otherwise use our implementation
    if (math.isPrime) {
      return math.isPrime(n);
    } else {
      if (n <= 3) return true;
      if (n % 2 === 0 || n % 3 === 0) return false;
      let i = 5;
      while (i * i <= n) {
        if (n % i === 0 || n % (i + 2) === 0) return false;
        i += 6;
      }
      return true;
    }
  },

  // Generate Fibonacci sequence up to n terms
  fibonacci: function (n) {
    try {
      // Create a sequence of n terms
      const sequence = [];
      for (let i = 0; i < n; i++) {
        // Use math.js fibonacci function
        sequence.push(math.fibonacci(i));
      }
      return sequence;
    } catch (error) {
      // Fallback to our implementation if math.js doesn't support it
      const sequence = [0, 1];
      for (let i = 2; i < n; i++) {
        sequence.push(sequence[i - 1] + sequence[i - 2]);
      }
      return sequence;
    }
  },

  // Convert between degrees and radians
  degToRad: function (degrees) {
    return degrees * Math.PI / 180;
  },

  radToDeg: function (radians) {
    return radians * 180 / Math.PI;
  },

  // Trigonometric functions that work with degrees
  sinDeg: function (degrees) {
    // Convert degrees to radians and calculate sine
    let result = Math.sin(degrees * Math.PI / 180);
    // Round to 15 decimal places to handle floating point precision issues
    result = parseFloat(result.toFixed(15));
    // Special case for sin(90) which should be exactly 1
    if (degrees % 180 === 90) result = 1;
    // Special case for sin(270) which should be exactly -1
    if (degrees % 360 === 270) result = -1;
    // Special case for sin(0), sin(180), etc. which should be exactly 0
    if (degrees % 180 === 0) result = 0;
    return result;
  },

  cosDeg: function (degrees) {
    // Convert degrees to radians and calculate cosine
    let result = Math.cos(degrees * Math.PI / 180);
    // Round to 15 decimal places to handle floating point precision issues
    result = parseFloat(result.toFixed(15));
    // Special case for cos(0), cos(360), etc. which should be exactly 1
    if (degrees % 360 === 0) result = 1;
    // Special case for cos(180), cos(540), etc. which should be exactly -1
    if (degrees % 360 === 180) result = -1;
    // Special case for cos(90), cos(270), etc. which should be exactly 0
    if (degrees % 180 === 90) result = 0;
    return result;
  },

  tanDeg: function (degrees) {
    // Special case for tan(90), tan(270), etc. which should return "Undefined"
    if (degrees % 180 === 90) {
      return "Undefined";
    }
    // Convert degrees to radians and calculate tangent
    let result = Math.tan(degrees * Math.PI / 180);
    // Round to 15 decimal places to handle floating point precision issues
    result = parseFloat(result.toFixed(15));
    // Special case for tan(0), tan(180), etc. which should be exactly 0
    if (degrees % 180 === 0) result = 0;
    return result;
  },

  // Statistical functions
  mean: function (array) {
    return math.mean(array);
  },

  median: function (array) {
    return math.median(array);
  },

  // Standard deviation
  standardDeviation: function (array) {
    return math.std(array);
  },

  // Permutations: nPr
  permutations: function (n, r) {
    // Use math.js permutations function
    try {
      return math.permutations(n, r);
    } catch (error) {
      // Fallback to our implementation
      return this.factorial(n) / this.factorial(n - r);
    }
  },

  // Combinations: nCr
  combinations: function (n, r) {
    // Use math.js combinations function
    try {
      return math.combinations(n, r);
    } catch (error) {
      // Fallback to our implementation
      return this.factorial(n) / (this.factorial(r) * this.factorial(n - r));
    }
  },


  // Logarithm with custom base
  log: function (value, base) {
    try {
      return math.log(value, base);
    } catch (error) {
      return Math.log(value) / Math.log(base);
    }
  },

  // Natural logarithm
  ln: function (value) {
    try {
      return math.log(value);
    } catch (error) {
      return Math.log(value);
    }
  },

  // Hyperbolic functions
  sinh: function (value) {
    try {
      return math.sinh(value);
    } catch (error) {
      return Math.sinh(value);
    }
  },

  cosh: function (value) {
    try {
      return math.cosh(value);
    } catch (error) {
      return Math.cosh(value);
    }
  },

  tanh: function (value) {
    try {
      return math.tanh(value);
    } catch (error) {
      return Math.tanh(value);
    }
  },

  // Matrix operations
  createMatrix: function (rows, cols, values) {
    try {
      return math.matrix(values);
    } catch (error) {
      return null;
    }
  },

  determinant: function (matrix) {
    try {
      return math.det(matrix);
    } catch (error) {
      return null;
    }
  },

  // Derivative (symbolic)
  derivative: function (expression, variable) {
    try {
      return math.derivative(expression, variable).toString();
    } catch (error) {
      return null;
    }
  },

  // Evaluate mathematical expressions
  evaluate: function (expression) {
    try {
      return math.evaluate(expression);
    } catch (error) {
      return null;
    }
  },

  // Simplify expressions
  simplify: function (expression) {
    try {
      return math.simplify(expression).toString();
    } catch (error) {
      return null;
    }
  }
};

// Unit conversion utilities
export const FabriUnits = {
  // Length conversions
  length: {
    meterToFeet: m => m * 3.28084,
    feetToMeter: ft => ft / 3.28084,
    kmToMiles: km => km * 0.621371,
    milesToKm: mi => mi / 0.621371,
    inchToCm: inch => inch * 2.54,
    cmToInch: cm => cm / 2.54
  },

  // Weight conversions
  weight: {
    kgToLbs: kg => kg * 2.20462,
    lbsToKg: lbs => lbs / 2.20462,
    gramToOz: g => g * 0.035274,
    ozToGram: oz => oz / 0.035274
  },

  // Temperature conversions
  temperature: {
    celsiusToFahrenheit: c => (c * 9 / 5) + 32,
    fahrenheitToCelsius: f => (f - 32) * 5 / 9,
    celsiusToKelvin: c => c + 273.15,
    kelvinToCelsius: k => k - 273.15
  },

  // Volume conversions
  volume: {
    literToGallon: l => l * 0.264172,
    gallonToLiter: gal => gal / 0.264172,
    mlToCup: ml => ml * 0.00423,
    cupToMl: cup => cup / 0.00423
  },

  // Area conversions
  area: {
    sqMeterToSqFeet: m2 => m2 * 10.7639,
    sqFeetToSqMeter: ft2 => ft2 / 10.7639,
    hectareToAcre: ha => ha * 2.47105,
    acreToHectare: acre => acre / 2.47105
  },

  // Speed conversions
  speed: {
    kphToMph: kph => kph * 0.621371,
    mphToKph: mph => mph / 0.621371,
    mpsToKph: mps => mps * 3.6,
    kphToMps: kph => kph / 3.6
  }
};

// Financial calculations using math.js
export const FabriFinance = {
  // Simple interest calculation
  simpleInterest: function (principal, rate, time) {
    try {
      // Convert rate to decimal (from percentage)
      const rateDecimal = math.divide(rate, 100);
      return math.multiply(principal, rateDecimal, time);
    } catch (error) {
      // Fallback to our implementation
      return principal * rate * time / 100;
    }
  },

  // Compound interest calculation
  compoundInterest: function (principal, rate, time, n = 1) {
    try {
      // Convert rate to decimal (from percentage)
      const rateDecimal = math.divide(rate, 100);
      // Calculate compound interest
      const futureValue = math.multiply(
        principal,
        math.pow(
          math.add(1, math.divide(rateDecimal, n)),
          math.multiply(n, time)
        )
      );
      return math.subtract(futureValue, principal);
    } catch (error) {
      // Fallback to our implementation
      return principal * Math.pow(1 + (rate / 100) / n, n * time) - principal;
    }
  },

  // Future value calculation
  futureValue: function (principal, rate, time, n = 1) {
    try {
      // Convert rate to decimal (from percentage)
      const rateDecimal = math.divide(rate, 100);
      // Calculate future value
      return math.multiply(
        principal,
        math.pow(
          math.add(1, math.divide(rateDecimal, n)),
          math.multiply(n, time)
        )
      );
    } catch (error) {
      // Fallback to our implementation
      return principal * Math.pow(1 + (rate / 100) / n, n * time);
    }
  },

  // Loan payment calculation (PMT)
  loanPayment: function (principal, rate, time) {
    try {
      // Convert rate to monthly decimal rate
      const monthlyRate = math.divide(math.divide(rate, 100), 12);
      const months = math.multiply(time, 12);

      // Calculate loan payment
      const numerator = math.multiply(
        principal,
        monthlyRate,
        math.pow(math.add(1, monthlyRate), months)
      );

      const denominator = math.subtract(
        math.pow(math.add(1, monthlyRate), months),
        1
      );

      return math.divide(numerator, denominator);
    } catch (error) {
      // Fallback to our implementation
      const monthlyRate = (rate / 100) / 12;
      const months = time * 12;
      return principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    }
  },

  // Present value calculation
  presentValue: function (futureValue, rate, time) {
    try {
      // Convert rate to decimal (from percentage)
      const rateDecimal = math.divide(rate, 100);

      // Calculate present value
      return math.divide(
        futureValue,
        math.pow(math.add(1, rateDecimal), time)
      );
    } catch (error) {
      // Fallback to our implementation
      return futureValue / Math.pow(1 + rate / 100, time);
    }
  },

  // Return on investment
  roi: function (gain, cost) {
    try {
      // Calculate ROI
      return math.multiply(
        math.divide(math.subtract(gain, cost), cost),
        100
      );
    } catch (error) {
      // Fallback to our implementation
      return (gain - cost) / cost * 100;
    }
  }
};

// AI helper functions
export const FabriAI = {
  // Detect problem type based on input
  detectProblemType: function (input) {
    const patterns = {
      algebraic: /[a-z]=|solve|equation|unknown|variable/i,
      calculus: /derivative|integral|limit|differentiate|integrate/i,
      trigonometry: /sin|cos|tan|angle|triangle|radian|degree/i,
      statistics: /mean|median|average|deviation|variance|probability/i,
      financial: /interest|loan|mortgage|payment|investment|compound/i,
      physics: /force|velocity|acceleration|energy|power|mass|gravity/i
    };

    for (const [type, pattern] of Object.entries(patterns)) {
      if (pattern.test(input)) {
        return type;
      }
    }

    return 'general';
  },

  // Generate step-by-step solution for basic operations using math.js
  generateSteps: function (a, b, operation) {
    const steps = [];
    let result;

    try {
      switch (operation) {
        case 'add':
          result = math.add(a, b);
          steps.push(`Start with the first number: ${a}`);
          steps.push(`Add the second number: ${a} + ${b}`);
          steps.push(`Calculate the sum: ${result}`);
          break;
        case 'subtract':
          result = math.subtract(a, b);
          steps.push(`Start with the first number: ${a}`);
          steps.push(`Subtract the second number: ${a} - ${b}`);
          steps.push(`Calculate the difference: ${result}`);
          break;
        case 'multiply':
          result = math.multiply(a, b);
          steps.push(`Start with the first number: ${a}`);
          steps.push(`Multiply by the second number: ${a} × ${b}`);
          steps.push(`Calculate the product: ${result}`);
          break;
        case 'divide':
          result = math.divide(a, b);
          steps.push(`Start with the first number: ${a}`);
          steps.push(`Divide by the second number: ${a} ÷ ${b}`);
          steps.push(`Calculate the quotient: ${result}`);
          break;
        case 'power':
          result = math.pow(a, b);
          steps.push(`Start with the base: ${a}`);
          steps.push(`Raise to the power of ${b}: ${a}^${b}`);
          steps.push(`Calculate the result: ${result}`);
          break;
      }
    } catch (error) {
      // Fallback to standard JavaScript operations if math.js fails
      switch (operation) {
        case 'add':
          result = a + b;
          steps.push(`Start with the first number: ${a}`);
          steps.push(`Add the second number: ${a} + ${b}`);
          steps.push(`Calculate the sum: ${result}`);
          break;
        case 'subtract':
          result = a - b;
          steps.push(`Start with the first number: ${a}`);
          steps.push(`Subtract the second number: ${a} - ${b}`);
          steps.push(`Calculate the difference: ${result}`);
          break;
        case 'multiply':
          result = a * b;
          steps.push(`Start with the first number: ${a}`);
          steps.push(`Multiply by the second number: ${a} × ${b}`);
          steps.push(`Calculate the product: ${result}`);
          break;
        case 'divide':
          result = a / b;
          steps.push(`Start with the first number: ${a}`);
          steps.push(`Divide by the second number: ${a} ÷ ${b}`);
          steps.push(`Calculate the quotient: ${result}`);
          break;
        case 'power':
          result = Math.pow(a, b);
          steps.push(`Start with the base: ${a}`);
          steps.push(`Raise to the power of ${b}: ${a}^${b}`);
          steps.push(`Calculate the result: ${result}`);
          break;
      }
    }

    return {
      steps,
      result
    };
  },

  // Generate learning suggestions based on calculation
  generateSuggestions: function (calculation) {
    const suggestions = [];

    if (calculation.includes('+') || calculation.includes('-')) {
      suggestions.push('Try exploring order of operations (PEMDAS) for more complex expressions');
    }

    if (calculation.includes('×') || calculation.includes('÷')) {
      suggestions.push('Learn about factoring and algebraic expressions');
    }

    if (calculation.includes('^') || calculation.includes('√')) {
      suggestions.push('Explore logarithms and exponential functions');
    }

    if (calculation.includes('sin') || calculation.includes('cos') || calculation.includes('tan')) {
      suggestions.push('Discover the unit circle and trigonometric identities');
    }

    // Add a default suggestion if none were generated
    if (suggestions.length === 0) {
      suggestions.push('Explore the FABRI AI assistant for more calculations');
    }

    return suggestions;
  }
};

// Export a setup function for backward compatibility
export function setupCounter(element) {
  let counter = 0;
  const setCounter = (count) => {
    counter = count;
    element.innerHTML = `FABRI count: ${counter}`;
  };
  element.addEventListener('click', () => setCounter(counter + 1));
  setCounter(0);
}
