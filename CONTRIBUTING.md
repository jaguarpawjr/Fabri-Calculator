# Contributing to FABRI Calculator

Thank you for your interest in contributing to the FABRI Calculator project! This document provides guidelines and instructions for contributing.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Submitting Changes](#submitting-changes)
6. [Bug Reports](#bug-reports)
7. [Feature Requests](#feature-requests)
8. [Documentation](#documentation)
9. [Community](#community)

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm 6.x or higher
- Git

### Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/jaguarpawjr/Fabri-Calculator.git
   cd Fabri-Calculator
   ```
3. Add the original repository as an upstream remote:
   ```bash
   git remote add upstream https://github.com/jaguarpawjr/Fabri-Calculator.git
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## Development Workflow

1. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bugfix-name
   ```

2. Make your changes, following the [coding standards](#coding-standards)

3. Test your changes thoroughly:
   - Manual testing of the calculator functionality
   - Verify that existing features still work
   - Check for any visual regressions

4. Commit your changes with clear, descriptive commit messages:
   ```bash
   git commit -m "Add feature: description of your feature"
   # or
   git commit -m "Fix: description of the bug you fixed"
   ```

5. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

6. Create a Pull Request from your fork to the main repository

## Coding Standards

### JavaScript

- Use ES6+ features where appropriate
- Follow camelCase naming convention for variables and functions
- Use meaningful variable and function names
- Add comments for complex logic
- Avoid global variables
- Use strict equality (`===`) instead of loose equality (`==`)
- Handle errors appropriately

Example:
```javascript
// Good
function calculateSquareRoot(number) {
  if (number < 0) {
    return NaN; // Handle negative numbers
  }
  return Math.sqrt(number);
}

// Bad
function sqrt(n) {
  return Math.sqrt(n);
}
```

### CSS

- Use CSS variables for theming and consistent values
- Follow kebab-case naming convention for classes and IDs
- Organize CSS by component
- Use comments to separate sections
- Avoid !important unless absolutely necessary
- Consider responsive design

Example:
```css
/* Good */
.calculator-display {
  background-color: var(--display-bg);
  color: var(--display-text);
  padding: 1rem;
}

/* Bad */
.calc-disp {
  background-color: #000;
  color: #0f0;
  padding: 16px;
}
```

### HTML

- Use semantic HTML elements
- Include appropriate ARIA attributes for accessibility
- Keep the DOM structure clean and logical
- Use data attributes for JavaScript hooks instead of classes or IDs

Example:
```html
<!-- Good -->
<button class="button number" data-value="7" aria-label="Seven">
  <span class="btn-text">7</span>
</button>

<!-- Bad -->
<div class="btn" onclick="handleClick(7)">7</div>
```

## Submitting Changes

1. Ensure your code follows the project's coding standards
2. Update documentation if necessary
3. Include tests for new features
4. Make sure all tests pass
5. Create a Pull Request with a clear title and description
6. Link any related issues in your Pull Request description

## Bug Reports

When reporting bugs, please include:

1. A clear, descriptive title
2. Steps to reproduce the bug
3. Expected behavior
4. Actual behavior
5. Screenshots if applicable
6. Browser and operating system information
7. Any relevant console errors

## Feature Requests

Feature requests are welcome! When submitting a feature request, please:

1. Check if the feature has already been requested
2. Provide a clear description of the feature
3. Explain why this feature would be useful
4. Suggest an implementation approach if possible
5. Include mockups or examples if relevant

## Documentation

Documentation is crucial for the project. When contributing:

1. Update the README.md if your changes affect the project overview
2. Update DOCUMENTATION.md for technical changes
3. Add JSDoc comments to new functions
4. Update inline comments for complex logic
5. Consider creating examples for new features

## Community

Join our community channels to discuss the project:

- GitHub Discussions: [FABRI Calculator Discussions](https://github.com/jaguarpawjr/Fabri-Calculator/discussions)
- Discord: [Join our Discord server](#)

---

Thank you for contributing to FABRI Calculator! Your efforts help make this project better for everyone.