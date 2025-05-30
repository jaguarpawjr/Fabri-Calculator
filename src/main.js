// FABRI Calculator - Main JavaScript
import { FabriMath, FabriFinance, FabriAI } from './counter.js';

// Calculator state
const calculatorState = {
  currentInput: '0',
  previousInput: '',
  operation: null,
  memory: 0,
  lastAnswer: 0,
  waitingForSecondOperand: false,
  displayTheme: 'matrix',
  history: [],
  shiftMode: false,
  alphaMode: false,
  aiMode: false,
  turboMode: false,
  displayFormat: '0', // Tryna store the formatted display with function symbols
  pendingFunction: null, // will actually store any pending function (like sin, cos, etc.)
  scrollDirection: 'left' // Direction of display scrolling (left or right)
};

// DOM Elements
const displayCurrent = document.querySelector('.display-current');
const displayHistory = document.querySelector('.display-history');
const aiSuggestion = document.querySelector('.ai-text');
const themeDots = document.querySelectorAll('.theme-dot');
const aiModal = document.getElementById('aiModal');
const closeModal = document.querySelector('.close-modal');
const stepsContainer = document.querySelector('.steps-container');
const suggestionsContainer = document.querySelector('.suggestions-container');
const clockTime = document.querySelector('.clock-time');
const clockPeriod = document.querySelector('.clock-period');

// Initialize the calculator
function initCalculator() {
  // Initialize AI mode based on AI suggestion visibility
  const aiSuggestionHidden = localStorage.getItem('aiSuggestionHidden') === 'true';
  calculatorState.aiMode = !aiSuggestionHidden;

  // Add event listeners to all buttons
  document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', () => handleButtonClick(button));

    // Add hover sound effect
    button.addEventListener('mouseenter', () => {
      playSound('hover');
    });
  });

  // Theme selector
  themeDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const theme = dot.getAttribute('data-theme');
      setDisplayTheme(theme);

      // Update active theme dot
      themeDots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
    });
  });

  // Modal close button
  if (closeModal) {
    closeModal.addEventListener('click', () => {
      aiModal.style.display = 'none';
    });
  }

  // Close modal when clicking outside
  window.addEventListener('click', (event) => {
    if (event.target === aiModal) {
      aiModal.style.display = 'none';
    }
  });

  // Keyboard support
  document.addEventListener('keydown', handleKeyboardInput);

  // Initial display update
  updateDisplay();

  // Initialize the display format
  calculatorState.displayFormat = '0';

  // Initialize the arrow button
  const arrowButton = document.querySelector('.button[data-value="arrow"] .btn-text');
  if (arrowButton) arrowButton.innerHTML = '→';

  // Welcome message
  showAiSuggestion('Welcome to FABRI PRO CALC. How can I assist you today?');

  // Initialize and start the clock
  updateClock();
  setInterval(updateClock, 1000);

  // Add particle effect
  createParticleEffect();
}

// Handle button clicks
function handleButtonClick(button) {
  const buttonType = button.className.split(' ')[1]; // Get the second class (button type)
  const value = button.getAttribute('data-value');

  playSound('click');

  // Add button press animation
  button.classList.add('pressed');
  setTimeout(() => {
    button.classList.remove('pressed');
  }, 150);

  switch (buttonType) {
    case 'number':
      handleNumberInput(value);
      break;
    case 'operation':
      handleOperation(value);
      break;
    case 'function':
      handleFunction(value);
      break;
    case 'math':
      handleMathFunction(value);
      break;
    case 'constant':
      handleConstant(value);
      break;
    case 'memory':
      handleMemory(value);
      break;
    case 'action':
      handleAction(value);
      break;
    case 'brand':
      handleBrandAction(value);
      break;
    default:
      console.log('Unknown button type:', buttonType);
  }

  // Update the display after any button press
  updateDisplay();
}

// Handle number input
function handleNumberInput(value) {
  // If there's a pending function, append the number to the function
  if (calculatorState.pendingFunction) {
    // If this is the first digit after the function
    if (calculatorState.waitingForSecondOperand) {
      calculatorState.currentInput = value;
      calculatorState.waitingForSecondOperand = false;
    } else {
      // Append to the current input
      calculatorState.currentInput = calculatorState.currentInput === '0' ?
        value : calculatorState.currentInput + value;
    }

    // Update the display format based on function type
    const funcName = calculatorState.pendingFunction.name;

    // Special case for power function with exponent
    if (funcName === 'pow_exp') {
      const base = calculatorState.pendingFunction.base;
      calculatorState.displayFormat = `${base}^${calculatorState.currentInput}`;
    } else {
      // Normal function display
      calculatorState.displayFormat = `${funcName}(${calculatorState.currentInput}`;
    }
    return;
  }

  if (calculatorState.waitingForSecondOperand) {
    calculatorState.currentInput = value;
    calculatorState.waitingForSecondOperand = false;

    // If we're entering the second operand for a power operation
    if (calculatorState.operation === 'power') {
      calculatorState.displayFormat = `${calculatorState.previousInput}^${value}`;
    } else {
      calculatorState.displayFormat = value;
    }
  } else {
    // If current input is '0', replace it, otherwise append
    calculatorState.currentInput = calculatorState.currentInput === '0' ? value : calculatorState.currentInput + value;

    // Update the display format
    calculatorState.displayFormat = calculatorState.currentInput;
  }

  // Provide AI suggestion for complex numbers
  if (calculatorState.currentInput.length > 5) {
    showAiSuggestion('Working with a complex number. Need help?');
  }
}

// Handle operations (+, -, *, /)
function handleOperation(value) {
  // If we already have a pending operation, calculate the result first
  if (calculatorState.operation && !calculatorState.waitingForSecondOperand) {
    calculate();
  }

  calculatorState.previousInput = calculatorState.currentInput;
  calculatorState.operation = value;
  calculatorState.waitingForSecondOperand = true;

  // Update history display
  updateHistoryDisplay();
}

// Handle function buttons (shift, alpha, mode, etc.)
function handleFunction(value) {
  switch (value) {
    case 'shift':
      calculatorState.shiftMode = !calculatorState.shiftMode;
      showAiSuggestion(calculatorState.shiftMode ? 'Shift mode activated' : 'Shift mode deactivated');
      break;
    case 'alpha':
      calculatorState.alphaMode = !calculatorState.alphaMode;
      showAiSuggestion(calculatorState.alphaMode ? 'Alpha mode activated' : 'Alpha mode deactivated');
      break;
    case 'mode':
      // Toggle between different calculator modes (scientific, programming, etc.)
      showAiSuggestion('Mode selection available in full version');
      break;
    case 'on':
      // Clear everything
      resetCalculator();
      showAiSuggestion('Calculator reset. Ready for new calculations.');
      break;
    case 'ai':
      calculatorState.aiMode = !calculatorState.aiMode;

      // Toggle AI suggestion visibility when AI mode is toggled
      const aiSuggestionBox = document.getElementById('aiSuggestion');
      const aiButton = document.querySelector('.button.ai');

      if (aiSuggestionBox) {
        if (calculatorState.aiMode) {
          // Show AI suggestion when AI mode is activated
          aiSuggestionBox.classList.remove('hidden');
          localStorage.setItem('aiSuggestionHidden', 'false');

          // Update AI button appearance
          if (aiButton) {
            aiButton.classList.remove('suggestions-hidden');
          }
        } else {
          // Hide AI suggestion when AI mode is deactivated
          aiSuggestionBox.classList.add('hidden');
          localStorage.setItem('aiSuggestionHidden', 'true');

          // Update AI button appearance
          if (aiButton) {
            aiButton.classList.add('suggestions-hidden');
          }
        }
      }

      showAiSuggestion(calculatorState.aiMode ? 'AI Assistant activated' : 'AI Assistant deactivated');
      break;
    case 'turbo':
      calculatorState.turboMode = !calculatorState.turboMode;
      showAiSuggestion(calculatorState.turboMode ? 'Turbo mode activated - maximum precision' : 'Turbo mode deactivated');
      break;
  }
}

// Handle mathematical functions
function handleMathFunction(value) {
  // Function to prepare for input with mathematical symbols ( )
  const prepareFunction = (funcName) => {
    // Store the current state before starting a new function
    calculatorState.previousInput = calculatorState.currentInput;

    // Set up the pending function
    calculatorState.pendingFunction = { name: funcName };

    // Update display to show function waiting for input ( )
    calculatorState.displayFormat = `${funcName}(`;

    // Clear current input to prepare for new input
    calculatorState.currentInput = '';

    // Set waiting state
    calculatorState.waitingForSecondOperand = true;
  };

  // Function to calculate result immediately for functions that don't need input
  const calculateImmediately = (funcName, calculation) => {
    const currentNumber = parseFloat(calculatorState.currentInput);
    let result;

    try {
      result = calculation();
    } catch (error) {
      result = "Error";
    }

    // Format the display
    calculatorState.displayFormat = `${funcName}(${currentNumber}) = ${result}`;
    calculatorState.currentInput = String(result);
  };

  switch (value) {
    case 'x^2':
      // Square function -  
      prepareFunction('sqr');
      showAiSuggestion(`Enter a number to square`);
      break;

    case 'sqrt':
      // Square root -  
      prepareFunction('√');
      showAiSuggestion(`Enter a number for square root`);
      break;

    case 'x^3':
      // Cube function -  
      prepareFunction('cube');
      showAiSuggestion(`Enter a number to cube`);
      break;

    case 'cbrt':
      // Cube root -  
      prepareFunction('∛');
      break;

    case 'x^y':
      // Power function -  
      prepareFunction('pow');
      showAiSuggestion(`Enter base number for power function`);
      break;

    case 'log':
      // Logarithm base 10 -  
      prepareFunction('log');
      break;

    case 'ln':
      // Natural logarithm -  
      prepareFunction('ln');
      break;

    case 'sin':
      // Sine function -  
      prepareFunction('sin');
      break;

    case 'cos':
      // Cosine function -  
      prepareFunction('cos');
      break;

    case 'tan':
      // Tangent function -  
      prepareFunction('tan');
      break;

    case 'x^-1':
      // Reciprocal -  
      prepareFunction('1/');
      showAiSuggestion(`Enter a number for reciprocal (1/x)`);
      break;
    case '(':
      if (calculatorState.currentInput === '0') {
        calculatorState.currentInput = '(';
      } else {
        calculatorState.currentInput += '(';
      }
      break;
    case ')':
      // If there's a pending function, calculate the result
      if (!calculatePendingFunction()) {
        // Normal behavior for closing parenthesis
        calculatorState.currentInput += ')';
        calculatorState.displayFormat = calculatorState.currentInput;
      }
      break;
    case ',':
      calculatorState.currentInput += ',';
      break;
    case 'plusminus':
      calculatorState.currentInput = String(-parseFloat(calculatorState.currentInput));
      break;

    case 'arrow':
      // Toggle between left and right arrow for display navigation
      if (calculatorState.scrollDirection === 'left') {
        scrollDisplay('right');
      } else {
        scrollDisplay('left');
      }
      break;
    default:
      // For other math functions, show a message
      showAiSuggestion(`Function ${value} will be available in the next update`);
  }
}

// Handle constants (pi, e, etc.)
function handleConstant(value) {
  switch (value) {
    case 'pi':
      calculatorState.currentInput = String(Math.PI);
      calculatorState.displayFormat = 'π = ' + calculatorState.currentInput;
      break;
    case 'e':
      calculatorState.currentInput = String(Math.E);
      calculatorState.displayFormat = 'e = ' + calculatorState.currentInput;
      break;
    default:
      showAiSuggestion(`Constant ${value} will be available in the next update`);
  }
}

// Handle memory functions
function handleMemory(value) {
  switch (value) {
    case 'sto':
      calculatorState.memory = parseFloat(calculatorState.currentInput);
      showAiSuggestion(`Value stored in memory: ${calculatorState.memory}`);
      break;
    case 'rcl':
      calculatorState.currentInput = String(calculatorState.memory);
      showAiSuggestion(`Recalled from memory: ${calculatorState.memory}`);
      break;
    case 'm+':
      calculatorState.memory += parseFloat(calculatorState.currentInput);
      showAiSuggestion(`Added to memory. Memory now: ${calculatorState.memory}`);
      break;
    case 'm-':
      calculatorState.memory -= parseFloat(calculatorState.currentInput);
      showAiSuggestion(`Subtracted from memory. Memory now: ${calculatorState.memory}`);
      break;
    case 'ans':
      calculatorState.currentInput = String(calculatorState.lastAnswer);
      showAiSuggestion(`Last answer: ${calculatorState.lastAnswer}`);
      break;
  }
}

// Helper function to scroll the display
function scrollDisplay(direction) {
  const display = document.querySelector('.display-current');
  const scrollAmount = 50; // Adjust scroll amount as needed

  if (direction === 'left') {
    display.scrollLeft -= scrollAmount;
  } else if (direction === 'right') {
    display.scrollLeft += scrollAmount;
  }

  // Update the arrow button text
  const arrowButton = document.querySelector('.button[data-value="arrow"] .btn-text');
  if (arrowButton) {
    // If we're at the start of the display, show right arrow
    if (display.scrollLeft <= 0) {
      arrowButton.innerHTML = '→';
      calculatorState.scrollDirection = 'left';
    }
    // If we're at the end of the display, show left arrow
    else if (display.scrollLeft + display.clientWidth >= display.scrollWidth - 5) {
      arrowButton.innerHTML = '←';
      calculatorState.scrollDirection = 'right';
    }
    // Otherwise, show the opposite of the current direction
    else {
      arrowButton.innerHTML = calculatorState.scrollDirection === 'left' ? '→' : '←';
    }
  }
}

// Helper function to calculate pending function results
function calculatePendingFunction() {
  if (!calculatorState.pendingFunction) return false;

  const funcName = calculatorState.pendingFunction.name;
  const arg = parseFloat(calculatorState.currentInput);
  let result;

  // Calculate the result based on the function
  try {
    switch (funcName) {
      case '√':
        // Check for negative numbers
        if (arg < 0) {
          result = "Error: Invalid input";
        } else {
          result = FabriMath.evaluate(`sqrt(${arg})`);
        }
        break;
      case '∛':
        result = FabriMath.evaluate(`cbrt(${arg})`);
        break;
      case 'log':
        // Check for non-positive numbers
        if (arg <= 0) {
          result = "Error: Invalid input";
        } else {
          result = FabriMath.log(arg, 10);
        }
        break;
      case 'ln':
        // Check for non-positive numbers
        if (arg <= 0) {
          result = "Error: Invalid input";
        } else {
          result = FabriMath.ln(arg);
        }
        break;
      case 'sin':
        // Use our custom sinDeg function that handles degrees correctly
        result = FabriMath.sinDeg(arg);
        break;
      case 'cos':
        // Use our custom cosDeg function that handles degrees correctly
        result = FabriMath.cosDeg(arg);
        break;
      case 'tan':
        // Use our custom tanDeg function that handles degrees correctly
        result = FabriMath.tanDeg(arg);
        break;
      case '1/':
        // Check for division by zero
        if (arg === 0) {
          result = "Error: Division by zero";
        } else {
          result = FabriMath.evaluate(`1/${arg}`);
        }
        break;
      case 'sqr':
        result = FabriMath.evaluate(`${arg}^2`);
        break;
      case 'cube':
        result = FabriMath.evaluate(`${arg}^3`);
        break;
      case 'pow':
        // For power function, we need to ask for the exponent
        // Store the base in pendingFunction and change the function name
        calculatorState.pendingFunction = { name: 'pow_exp', base: arg };
        calculatorState.displayFormat = `${arg}^`;
        calculatorState.currentInput = '';
        calculatorState.waitingForSecondOperand = true;
        return true; // Return early without completing the calculation
        break;
      case 'pow_exp':
        // Now we have both the base and exponent
        const base = calculatorState.pendingFunction.base;
        const exponent = arg;

        try {
          // Check for special cases
          if (base === 0 && exponent <= 0) {
            result = "Error: Invalid operation";
          } else {
            result = FabriMath.evaluate(`${base}^${exponent}`);
          }
        } catch (error) {
          result = "Error: Invalid operation";
        }

        // Update display format to show the complete power expression
        calculatorState.displayFormat = `${base}^${exponent} = ${result}`;
        break;
      default:
        result = arg; // Default fallback
    }
  } catch (error) {
    result = "Error: Invalid calculation";
    // Show AI suggestion with error details
    showAiSuggestion(`Calculation error: ${error.message || 'Invalid operation'}`);
  }

  // Update the display and state
  if (String(result).startsWith("Error")) {
    // For errors, show a different format
    calculatorState.displayFormat = `${funcName}(${arg}) → ${result}`;
    calculatorState.currentInput = "0"; // Reset input on error

    // Show error in AI suggestion
    if (!result.includes("Invalid calculation")) { // Avoid duplicate messages
      showAiSuggestion(result);
    }
  } else {
    calculatorState.displayFormat = `${funcName}(${arg}) = ${result}`;
    calculatorState.currentInput = String(result);
  }
  calculatorState.pendingFunction = null;

  return true;
}

// Handle action buttons
function handleAction(value) {
  switch (value) {
    case 'del':
      // If there's a pending function with input, delete the last character of input
      if (calculatorState.pendingFunction && calculatorState.currentInput.length > 0) {
        if (calculatorState.currentInput.length > 1) {
          calculatorState.currentInput = calculatorState.currentInput.slice(0, -1);
          // Update the display format to show function(number
          const funcName = calculatorState.pendingFunction.name;
          calculatorState.displayFormat = `${funcName}(${calculatorState.currentInput}`;
        } else {
          // If only one digit left, clear the input but keep the function
          calculatorState.currentInput = '';
          const funcName = calculatorState.pendingFunction.name;
          calculatorState.displayFormat = `${funcName}(`;
        }
      }
      // If there's a pending function with no input, clear the function
      else if (calculatorState.pendingFunction) {
        calculatorState.pendingFunction = null;
        calculatorState.displayFormat = calculatorState.previousInput || '0';
        calculatorState.currentInput = calculatorState.previousInput || '0';
        calculatorState.waitingForSecondOperand = false;
      }
      // Normal delete behavior
      else {
        if (calculatorState.currentInput.length > 1) {
          calculatorState.currentInput = calculatorState.currentInput.slice(0, -1);
          calculatorState.displayFormat = calculatorState.currentInput;
        } else {
          calculatorState.currentInput = '0';
          calculatorState.displayFormat = '0';
        }
      }
      break;
    case 'ac':
      resetCalculator();
      break;
    case 'solve':
      if (calculatorState.aiMode) {
        showAiModal('Solving equation', [
          'Step 1: Analyzing the equation structure',
          'Step 2: Applying algebraic transformations',
          'Step 3: Solving for the unknown variable'
        ]);
      } else {
        showAiSuggestion('Enable AI mode to use the SOLVE function');
      }
      break;
    case 'exe':
      // If there's a pending function, calculate it, otherwise do normal calculation
      if (!calculatePendingFunction()) {
        calculate();
      }
      break;
    case 'equals':
      // If there's a pending function, calculate it, otherwise do normal calculation
      if (!calculatePendingFunction()) {
        calculate();
      }
      break;
    case 'target':
      showAiSuggestion('Precision targeting activated');
      break;
    case 'graph':
      showAiSuggestion('Graphing functionality will be available in the next update');
      break;
  }
}

// Handle brand-specific actions
function handleBrandAction(value) {
  if (value === 'fabri') {
    showAiModal('FABRI AI Assistant', [
      'Welcome to FABRI PRO CALC - The Ultimate Calculator Experience',
      'This calculator combines cutting-edge AI with premium design',
      'Explore the various functions and enjoy the premium experience'
    ]);
  }
}

// Calculate the result
function calculate() {
  let result;
  const prev = parseFloat(calculatorState.previousInput);
  const current = parseFloat(calculatorState.currentInput);

  if (isNaN(prev) || isNaN(current)) return;

  // Create a formatted display of the calculation
  let operationSymbol = '';
  let mathOperation = '';

  switch (calculatorState.operation) {
    case 'add':
      operationSymbol = '+';
      mathOperation = 'add';
      try {
        result = FabriMath.evaluate(`${prev} + ${current}`);
      } catch (error) {
        result = prev + current;
      }
      break;
    case 'subtract':
      operationSymbol = '-';
      mathOperation = 'subtract';
      try {
        result = FabriMath.evaluate(`${prev} - ${current}`);
      } catch (error) {
        result = prev - current;
      }
      break;
    case 'multiply':
      operationSymbol = '×';
      mathOperation = 'multiply';
      try {
        result = FabriMath.evaluate(`${prev} * ${current}`);
      } catch (error) {
        result = prev * current;
      }
      break;
    case 'divide':
      operationSymbol = '÷';
      mathOperation = 'divide';
      try {
        result = FabriMath.evaluate(`${prev} / ${current}`);
      } catch (error) {
        result = prev / current;
      }
      break;
    case 'power':
      operationSymbol = '^';
      mathOperation = 'power';
      try {
        result = FabriMath.evaluate(`${prev} ^ ${current}`);
      } catch (error) {
        result = Math.pow(prev, current);
      }
      break;
    default:
      return;
  }

  // Format the result
  result = formatResult(result);

  // Update the display format to show the calculation
  calculatorState.displayFormat = `${prev} ${operationSymbol} ${current} = ${result}`;

  // Store the result
  calculatorState.currentInput = String(result);
  calculatorState.lastAnswer = result;
  calculatorState.operation = null;
  calculatorState.waitingForSecondOperand = false;

  // Add to history
  addToHistory(`${prev} ${getOperationSymbol(calculatorState.operation)} ${current} = ${result}`);

  // Clear history display
  displayHistory.textContent = '';

  // Show AI suggestion for the result
  if (calculatorState.aiMode) {
    provideAiInsight(result);
  }
}

// Format the result to avoid extremely long numbers
function formatResult(number) {
  // If the number is very large or small, use scientific notation
  if (Math.abs(number) > 1e10 || (Math.abs(number) < 1e-10 && number !== 0)) {
    return number.toExponential(5);
  }

  // Otherwise, limit to 10 digits total
  const numberStr = number.toString();
  if (numberStr.length > 10) {
    if (numberStr.includes('.')) {
      const integerPart = numberStr.split('.')[0];
      const decimalPlaces = Math.max(0, 10 - integerPart.length - 1);
      return number.toFixed(decimalPlaces);
    } else {
      return number.toExponential(5);
    }
  }

  return number;
}

// Get the symbol for an operation
function getOperationSymbol(operation) {
  switch (operation) {
    case 'add': return '+';
    case 'subtract': return '-';
    case 'multiply': return '×';
    case 'divide': return '÷';
    case 'power': return '^';
    default: return '';
  }
}

// Update the display
function updateDisplay() {
  // Store previous content to check if it changed
  const previousContent = displayCurrent.innerHTML;

  // Use the formatted display if available, otherwise use the current input
  const newContent = calculatorState.displayFormat || calculatorState.currentInput;
  displayCurrent.innerHTML = newContent;

  // Check if the content contains an error message
  const hasError = newContent.includes("Error");

  // Apply the current theme
  displayCurrent.className = 'display-current ' + calculatorState.displayTheme;

  // Set data attribute for error styling
  if (hasError) {
    displayCurrent.setAttribute('data-error', 'true');
  } else {
    displayCurrent.removeAttribute('data-error');
  }

  // Add updating animation if content changed
  if (previousContent !== newContent) {
    displayCurrent.classList.add('updating');

    // Remove the class after animation completes
    setTimeout(() => {
      displayCurrent.classList.remove('updating');
    }, 200);
  }

  // Auto-scroll to the end of the display when content changes
  // Use setTimeout to ensure this happens after the DOM update
  setTimeout(() => {
    displayCurrent.scrollLeft = displayCurrent.scrollWidth;
  }, 0);

  // Update mode indicators
  document.querySelectorAll('.button.function').forEach(button => {
    const value = button.getAttribute('data-value');
    if (value === 'shift') {
      button.classList.toggle('active', calculatorState.shiftMode);
    } else if (value === 'alpha') {
      button.classList.toggle('active', calculatorState.alphaMode);
    } else if (value === 'ai') {
      button.classList.toggle('active', calculatorState.aiMode);
    } else if (value === 'turbo') {
      button.classList.toggle('active', calculatorState.turboMode);
    }
  });
}

// Update the history display
function updateHistoryDisplay() {
  if (calculatorState.operation) {
    const operationSymbol = getOperationSymbol(calculatorState.operation);
    displayHistory.textContent = `${calculatorState.previousInput} ${operationSymbol}`;
  }
}

// Add to calculation history
function addToHistory(entry) {
  calculatorState.history.push(entry);
  if (calculatorState.history.length > 10) {
    calculatorState.history.shift(); // Keep only the last 10 entries
  }
}

// Reset the calculator
function resetCalculator() {
  calculatorState.currentInput = '0';
  calculatorState.previousInput = '';
  calculatorState.operation = null;
  calculatorState.waitingForSecondOperand = false;
  calculatorState.displayFormat = '0';
  calculatorState.pendingFunction = null;
  displayHistory.textContent = '';

  // Clear any error state
  displayCurrent.removeAttribute('data-error');
}

// Set the display theme
function setDisplayTheme(theme) {
  calculatorState.displayTheme = theme;
  displayCurrent.className = 'display-current ' + theme;

  // Play theme change sound
  playSound('theme');

  showAiSuggestion(`Display theme changed to ${theme}`);
}

// Show AI suggestion
// Variable to track if speech is enabled
let speechEnabled = true;

function showAiSuggestion(text) {
  aiSuggestion.textContent = text;

  // Get the AI suggestion box
  const aiSuggestionBox = document.getElementById('aiSuggestion');

  // If the suggestion is hidden and this is not a system message, show it temporarily
  const isHidden = aiSuggestionBox && aiSuggestionBox.classList.contains('hidden');
  const isSystemMessage = text.includes('mode activated') ||
    text.includes('mode deactivated') ||
    text.includes('Voice feedback');

  // Temporarily show the suggestion if it's hidden and not a system message
  if (isHidden && !isSystemMessage) {
    aiSuggestionBox.classList.remove('hidden');

    // Hide it again after 5 seconds
    setTimeout(() => {
      if (localStorage.getItem('aiSuggestionHidden') === 'true') {
        aiSuggestionBox.classList.add('hidden');
      }
    }, 5000);
  }

  // Animate the suggestion
  aiSuggestion.style.animation = 'none';
  setTimeout(() => {
    aiSuggestion.style.animation = 'fadeIn 0.5s ease';
  }, 10);

  // Speak the suggestion if speech is enabled
  if (speechEnabled && 'speechSynthesis' in window) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Create a new speech utterance
    const utterance = new SpeechSynthesisUtterance(text);

    // Configure the voice
    utterance.volume = 0.8;  // 0 to 1
    utterance.rate = 1.0;    // 0.1 to 10
    utterance.pitch = 1.1;   // 0 to 2

    // Get available voices and set a good one if available
    const voices = window.speechSynthesis.getVoices();

    // Try to find a good voice - prefer female voices for AI assistant
    setTimeout(() => {
      const voices = window.speechSynthesis.getVoices();
      let voice = voices.find(voice => voice.name.includes('Female') || voice.name.includes('Google') || voice.name.includes('Microsoft'));

      // If no preferred voice found, use the first available
      if (!voice && voices.length > 0) {
        voice = voices[0];
      }

      if (voice) {
        utterance.voice = voice;
      }

      // Play a subtle notification sound before speaking
      playNotificationSound();

      // Add speaking animation
      const aiIcon = document.querySelector('.ai-icon i');
      const aiSuggestionBox = document.querySelector('.ai-suggestion');

      aiIcon.classList.add('speaking');
      aiSuggestionBox.classList.add('speaking');

      // Remove speaking animation when done
      utterance.onend = () => {
        aiIcon.classList.remove('speaking');
        aiSuggestionBox.classList.remove('speaking');
      };

      // Speak the text
      window.speechSynthesis.speak(utterance);
    }, 100);
  }
}

// Function to play a notification sound
function playNotificationSound() {
  // Create a subtle notification sound using the Web Audio API
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // Create an oscillator for a short beep
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  // Configure the sound
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(1200, audioContext.currentTime); // Higher frequency for AI sound
  oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1); // Sweep down

  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime); // Low volume
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1); // Fade out

  // Connect and start
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.1);
}

// Provide AI insight based on the result
function provideAiInsight(result) {
  // Check if the result is interesting in some way
  if (result === 42) {
    showAiSuggestion('The answer to the ultimate question of life, the universe, and everything!');
  } else if (Number.isInteger(result) && isPrime(result)) {
    showAiSuggestion(`${result} is a prime number`);
  } else if (result === Math.PI) {
    showAiSuggestion('π - The ratio of a circle\'s circumference to its diameter');
  } else if (result === Math.E) {
    showAiSuggestion('e - The base of the natural logarithm');
  } else if (result === 0) {
    showAiSuggestion('Zero - Neither positive nor negative');
  } else if (result === Infinity || result === -Infinity) {
    showAiSuggestion('Infinity reached - beyond numerical representation');
  } else {
    // Generic insights
    const insights = [
      'Calculation complete. Need further analysis?',
      'Result computed with high precision',
      'Would you like to store this result in memory?',
      'Tap FABRI button for more insights on this result'
    ];
    showAiSuggestion(insights[Math.floor(Math.random() * insights.length)]);
  }
}

// Check if a number is prime
function isPrime(num) {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  let i = 5;
  while (i * i <= num) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
    i += 6;
  }
  return true;
}

// Show AI modal with explanation
function showAiModal(title, steps) {
  // Set modal title
  document.querySelector('.modal-header h2').innerHTML = `<i class="fas fa-brain"></i> ${title}`;

  // Clear previous content
  stepsContainer.innerHTML = '';
  suggestionsContainer.innerHTML = '';

  // Add steps
  steps.forEach((step, index) => {
    const stepElement = document.createElement('div');
    stepElement.className = 'step';
    stepElement.innerHTML = `<p><span class="step-number">${index + 1}.</span> ${step}</p>`;
    stepsContainer.appendChild(stepElement);
  });

  // Add suggestions
  const suggestions = [
    'Try using the memory function to store this result',
    'Explore related calculations with the FABRI AI',
    'Use Turbo mode for even more precision'
  ];

  suggestions.forEach(suggestion => {
    const suggestionElement = document.createElement('div');
    suggestionElement.className = 'suggestion';
    suggestionElement.innerHTML = `<p><i class="fas fa-lightbulb"></i> ${suggestion}</p>`;
    suggestionsContainer.appendChild(suggestionElement);
  });

  // Show the modal
  aiModal.style.display = 'block';

  // Play modal sound
  playSound('modal');
}

// Handle keyboard input
function handleKeyboardInput(event) {
  // Prevent default behavior for calculator keys
  if (/[\d+\-*/.=]/.test(event.key) || ['ArrowLeft', 'ArrowRight'].includes(event.key)) {
    event.preventDefault();
  }

  // Handle arrow keys for display navigation
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    if (event.key === 'ArrowLeft') {
      scrollDisplay('left');
    } else if (event.key === 'ArrowRight') {
      scrollDisplay('right');
    }

    return; // Exit early after handling arrow keys
  }

  // Map keyboard keys to calculator buttons
  switch (event.key) {
    case '0':
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
      handleNumberInput(event.key);
      break;
    case '+':
      handleOperation('add');
      break;
    case '-':
      handleOperation('subtract');
      break;
    case '*':
      handleOperation('multiply');
      break;
    case '/':
      handleOperation('divide');
      break;
    case '.':
      handleNumberInput('.');
      break;
    case 'Enter':
    case '=':
      // If there's a pending function, calculate it, otherwise do normal calculation
      if (!calculatePendingFunction()) {
        calculate();
      }
      break;
    case 'Backspace':
      handleAction('del');
      break;
    case 'Escape':
      handleAction('ac');
      break;
    case 'p':
      handleConstant('pi');
      break;
    case 'e':
      handleConstant('e');
      break;
    case 's':
      handleMathFunction('sin');
      break;
    case 'c':
      handleMathFunction('cos');
      break;
    case 't':
      handleMathFunction('tan');
      break;
    case 'l':
      handleMathFunction('log');
      break;
    case 'n':
      handleMathFunction('ln');
      break;
    case '(':
      handleMathFunction('(');
      break;
    case ')':
      handleMathFunction(')');
      break;
  }

  // Update the display after any key press
  updateDisplay();
}

// Play sound effects
function playSound(type) {
  // In a real implementation, we would play actual sounds
  // For this demo, we'll just log the sound type
  console.log(`Playing sound: ${type}`);
}

// Create particle effect
function createParticleEffect() {
  // This would create a canvas with particle animations
  // For this demo, we'll just log that it's been created
  console.log('Particle effect created');
}

// Update the clock display
function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';

  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  // Add animation class
  clockTime.classList.add('updating');

  // Update the clock display
  setTimeout(() => {
    clockTime.textContent = `${hours}:${minutes}:${seconds}`;
    clockPeriod.textContent = period;

    // Remove animation class
    setTimeout(() => {
      clockTime.classList.remove('updating');
    }, 300);
  }, 100);
}

// 3D Tilting Effect
function init3DTiltEffect() {
  const calculator = document.querySelector('.calculator');
  const calculatorContainer = document.querySelector('.calculator-container');

  // Variables to control the tilt effect
  const maxTiltX = 10; // Maximum rotation on X axis (degrees)
  const maxTiltY = 15; // Maximum rotation on Y axis (degrees)
  let isHoveringOnCalculator = false;
  let tiltModeActive = false; // Flag to track if tilt mode is active

  // Add event listeners for mouse movement
  calculatorContainer.addEventListener('mousemove', handleMouseMove);
  calculatorContainer.addEventListener('mouseenter', () => {
    isHoveringOnCalculator = true;
    if (tiltModeActive) {
      calculator.classList.add('tilting');
    }
  });
  calculatorContainer.addEventListener('mouseleave', () => {
    isHoveringOnCalculator = false;
    resetTilt();
  });

  // Get the tilt mode indicator
  const tiltModeIndicator = document.getElementById('tiltModeIndicator');

  // Add keyboard shortcut listener (CTRL+ALT+T)
  document.addEventListener('keydown', (e) => {
    // Check for CTRL+ALT+T
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 't') {
      tiltModeActive = !tiltModeActive;

      if (tiltModeActive) {
        showAiSuggestion('3D Tilt Mode activated - Move your mouse over the calculator to see the effect');
        tiltModeIndicator.classList.add('active');
        if (isHoveringOnCalculator) {
          calculator.classList.add('tilting');
        }
      } else {
        showAiSuggestion('3D Tilt Mode deactivated');
        tiltModeIndicator.classList.remove('active');
        resetTilt();
      }
    }
  });

  // Handle mouse movement to create tilt effect
  function handleMouseMove(e) {
    // Only apply tilt effect if hovering on the calculator case, not on buttons
    // AND tilt mode is active
    if (!isHoveringOnCalculator || !tiltModeActive) return;

    // Get the target element under the cursor
    const target = e.target;

    // If hovering over a button, don't apply the tilt effect
    if (target.classList.contains('button') ||
      target.closest('.button') ||
      target.classList.contains('display') ||
      target.closest('.display')) {
      return;
    }

    // Get the bounding rectangle of the calculator
    const rect = calculator.getBoundingClientRect();

    // Calculate the mouse position relative to the center of the calculator
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate the percentage of mouse position from the center (-1 to 1)
    const percentX = (e.clientX - centerX) / (rect.width / 2);
    const percentY = (e.clientY - centerY) / (rect.height / 2);

    // Calculate the tilt angle based on mouse position
    const tiltX = -percentY * maxTiltX; // Invert Y axis for natural tilt
    const tiltY = percentX * maxTiltY;

    // Apply the tilt effect
    calculator.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

    // Dynamic shadow based on tilt
    const shadowX = -tiltY / 2; // Shadow moves opposite to tilt
    const shadowY = tiltX / 2;
    const shadowBlur = 20 + Math.abs(tiltX) + Math.abs(tiltY);
    calculator.style.boxShadow = `
      ${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, 0.5),
      0 10px 25px rgba(0, 195, 255, 0.2)
    `;

    // Update reflection effect based on tilt
    // Calculate reflection angle based on tilt
    const reflectionX = 50 + (percentX * 20); // Move reflection horizontally
    const reflectionY = 50 + (percentY * 20); // Move reflection vertically

    // Apply dynamic reflection gradient
    calculator.style.setProperty('--reflection-position', `${reflectionX}% ${reflectionY}%`);
    calculator.style.setProperty('--reflection-opacity', `${0.05 + Math.abs(percentX) * 0.05 + Math.abs(percentY) * 0.05}`);
  }

  // Reset the tilt when mouse leaves
  function resetTilt() {
    calculator.style.transform = 'rotateX(0deg) rotateY(0deg)';
    calculator.style.boxShadow = 'var(--premium-shadow)';
    calculator.style.setProperty('--reflection-position', '50% 50%');
    calculator.style.setProperty('--reflection-opacity', '0.05');
    calculator.classList.remove('tilting');
  }
}

// Initialize the calculator when the DOM is loaded
// Initialize speech toggle functionality
function initSpeechToggle() {
  const speechToggle = document.getElementById('speechToggle');

  // Set initial state
  speechToggle.classList.add('active');

  // Function to toggle speech
  function toggleSpeech() {
    speechEnabled = !speechEnabled;

    if (speechEnabled) {
      speechToggle.classList.remove('muted');
      showAiSuggestion('Voice feedback enabled');
    } else {
      speechToggle.classList.add('muted');
      // Don't speak this message since speech is now disabled
      aiSuggestion.textContent = 'Voice feedback disabled';

      // Animate the suggestion without speaking
      aiSuggestion.style.animation = 'none';
      setTimeout(() => {
        aiSuggestion.style.animation = 'fadeIn 0.5s ease';
      }, 10);

      // Cancel any ongoing speech
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  }

  // Add click event listener
  speechToggle.addEventListener('click', toggleSpeech);

  // Add keyboard shortcut (CTRL+ALT+S)
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 's') {
      toggleSpeech();
    }
  });
}

// Initialize speech synthesis
function initSpeechSynthesis() {
  // Some browsers need a manual trigger to load voices
  if ('speechSynthesis' in window) {
    // Firefox and some other browsers need this to load voices
    window.speechSynthesis.getVoices();

    // Chrome needs this event listener
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  } else {
    // Speech synthesis not supported
    speechEnabled = false;
    const speechToggle = document.getElementById('speechToggle');
    if (speechToggle) {
      speechToggle.classList.add('muted');
      speechToggle.title = "Speech synthesis not supported in this browser";
    }
  }
}

// Initialize AI suggestion toggle
function initAiSuggestionToggle() {
  const aiToggle = document.getElementById('aiToggle');
  const aiSuggestionBox = document.getElementById('aiSuggestion');
  const aiButton = document.querySelector('.button.ai');

  // Check if the AI suggestion was previously hidden
  const aiSuggestionHidden = localStorage.getItem('aiSuggestionHidden') === 'true';

  // Apply the initial state
  if (aiSuggestionHidden) {
    aiSuggestionBox.classList.add('hidden');
    if (aiButton) {
      aiButton.classList.add('suggestions-hidden');
    }
  }

  // Toggle function
  function toggleAiSuggestion() {
    const isHidden = aiSuggestionBox.classList.toggle('hidden');

    // Update AI button appearance
    if (aiButton) {
      if (isHidden) {
        aiButton.classList.add('suggestions-hidden');
      } else {
        aiButton.classList.remove('suggestions-hidden');
      }
    }

    // Store the preference
    localStorage.setItem('aiSuggestionHidden', isHidden);

    // Play a subtle toggle sound
    playToggleSound(isHidden);
  }

  // Add click event listener to the toggle button
  if (aiToggle) {
    aiToggle.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent default button behavior
      toggleAiSuggestion();
    });
  }

  // Add keyboard shortcut (CTRL+ALT+A)
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'a') {
      toggleAiSuggestion();
    }
  });
}

// Play a subtle toggle sound
function playToggleSound(isHiding) {
  // Create a subtle sound using the Web Audio API
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // Create an oscillator for a short beep
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  // Configure the sound based on whether we're hiding or showing
  if (isHiding) {
    // Lower pitch for hiding
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.1);
  } else {
    // Higher pitch for showing
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
  }

  gainNode.gain.setValueAtTime(0.05, audioContext.currentTime); // Very low volume
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1); // Fade out

  // Connect and start
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.1);
}

document.addEventListener('DOMContentLoaded', () => {
  initCalculator();
  init3DTiltEffect();
  initSpeechToggle();
  initSpeechSynthesis();
  initAiSuggestionToggle();
});
