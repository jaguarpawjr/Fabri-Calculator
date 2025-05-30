// FABRI Calculator - Trigonometric Function Tests
import { FabriMath } from './counter.js';

// Test cases for trigonometric functions
console.log('=== Trigonometric Function Tests ===');

// Test sinDeg function
console.log('\nTesting sinDeg function:');
console.log('sinDeg(0) =', FabriMath.sinDeg(0), '(Expected: 0)');
console.log('sinDeg(30) =', FabriMath.sinDeg(30), '(Expected: 0.5)');
console.log('sinDeg(45) =', FabriMath.sinDeg(45), '(Expected: 0.7071...)');
console.log('sinDeg(60) =', FabriMath.sinDeg(60), '(Expected: 0.866...)');
console.log('sinDeg(90) =', FabriMath.sinDeg(90), '(Expected: 1)');
console.log('sinDeg(180) =', FabriMath.sinDeg(180), '(Expected: 0)');
console.log('sinDeg(270) =', FabriMath.sinDeg(270), '(Expected: -1)');
console.log('sinDeg(360) =', FabriMath.sinDeg(360), '(Expected: 0)');

// Test cosDeg function
console.log('\nTesting cosDeg function:');
console.log('cosDeg(0) =', FabriMath.cosDeg(0), '(Expected: 1)');
console.log('cosDeg(30) =', FabriMath.cosDeg(30), '(Expected: 0.866...)');
console.log('cosDeg(45) =', FabriMath.cosDeg(45), '(Expected: 0.7071...)');
console.log('cosDeg(60) =', FabriMath.cosDeg(60), '(Expected: 0.5)');
console.log('cosDeg(90) =', FabriMath.cosDeg(90), '(Expected: 0)');
console.log('cosDeg(180) =', FabriMath.cosDeg(180), '(Expected: -1)');
console.log('cosDeg(270) =', FabriMath.cosDeg(270), '(Expected: 0)');
console.log('cosDeg(360) =', FabriMath.cosDeg(360), '(Expected: 1)');

// Test tanDeg function
console.log('\nTesting tanDeg function:');
console.log('tanDeg(0) =', FabriMath.tanDeg(0), '(Expected: 0)');
console.log('tanDeg(30) =', FabriMath.tanDeg(30), '(Expected: 0.5773...)');
console.log('tanDeg(45) =', FabriMath.tanDeg(45), '(Expected: 1)');
console.log('tanDeg(60) =', FabriMath.tanDeg(60), '(Expected: 1.7321...)');
console.log('tanDeg(90) =', FabriMath.tanDeg(90), '(Expected: "Undefined")');
console.log('tanDeg(180) =', FabriMath.tanDeg(180), '(Expected: 0)');
console.log('tanDeg(270) =', FabriMath.tanDeg(270), '(Expected: "Undefined")');
console.log('tanDeg(360) =', FabriMath.tanDeg(360), '(Expected: 0)');

// Test edge cases
console.log('\nTesting edge cases:');
console.log('sinDeg(450) =', FabriMath.sinDeg(450), '(Expected: 0.7071...)'); // Same as sin(90)
console.log('cosDeg(-90) =', FabriMath.cosDeg(-90), '(Expected: 0)'); // Same as cos(270)
console.log('tanDeg(810) =', FabriMath.tanDeg(810), '(Expected: "Undefined")'); // Same as tan(90)

console.log('\n=== End of Tests ===');