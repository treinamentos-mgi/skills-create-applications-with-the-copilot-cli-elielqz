#!/usr/bin/env node
/**
 * Calculadora CLI
 *
 * Operações suportadas:
 *   add (+)       - adição
 *   subtract (-)  - subtração
 *   multiply (*)  - multiplicação
 *   divide (/)    - divisão (divisão por zero retorna erro)
 *
 * Uso: node src/calculator.js <operação> <número1> <número2>
 * Ex.: node src/calculator.js add 2 3
 */

// Adição
function add(a, b) {
  return a + b;
}

// Subtração
function subtract(a, b) {
  return a - b;
}

// Multiplicação
function multiply(a, b) {
  return a * b;
}

// Divisão (lança erro se o divisor for zero)
function divide(a, b) {
  if (b === 0) {
    throw new Error('Erro: divisão por zero não é permitida.');
  }
  return a / b;
}

const operations = {
  add, '+': add,
  subtract, '-': subtract,
  multiply, '*': multiply, x: multiply,
  divide, '/': divide,
};

function main(args) {
  const [op, rawA, rawB] = args;

  if (args.length !== 3) {
    console.error('Uso: node calculator.js <add|subtract|multiply|divide> <n1> <n2>');
    return 1;
  }

  const fn = operations[op];
  if (!fn) {
    console.error(`Erro: operação desconhecida "${op}". Use add, subtract, multiply ou divide.`);
    return 1;
  }

  const a = Number(rawA);
  const b = Number(rawB);
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    console.error('Erro: os operandos devem ser números válidos.');
    return 1;
  }

  try {
    console.log(fn(a, b));
    return 0;
  } catch (err) {
    console.error(err.message);
    return 1;
  }
}

if (require.main === module) {
  process.exitCode = main(process.argv.slice(2));
}

module.exports = { add, subtract, multiply, divide };
