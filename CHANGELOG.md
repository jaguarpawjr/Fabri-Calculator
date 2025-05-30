# Changelog

All notable changes to the FABRI Calculator project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] - 2024-06-03

### Fixed
- Fixed trigonometric functions (sin, cos, tan) to correctly handle degree inputs
- Added special case handling for common angles (0°, 90°, 180°, 270°, 360°)
- Improved precision for trigonometric calculations
- Added dedicated sinDeg, cosDeg, and tanDeg functions to FabriMath module
- Fixed potential "undefined" results for tan(90°) and similar angles

