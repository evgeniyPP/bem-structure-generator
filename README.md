# BEM Structure Generator

A utility for creating a BEM file structure (nested).

## Requirements:

- Node.js >=14.17.0;
- NPM >=7.16.0;
- HTML file with default BEM class notation: `block-name__elem-name_mod-name_mod-val`.

## Install:

Not required. The library will be installed automatically after running the script.

## Usage:

`npx bem-structure-generator <path>`

where `<path>` is a path to your HTML file. `./index.html` by default.
It will not delete or rewrite any existing files.
