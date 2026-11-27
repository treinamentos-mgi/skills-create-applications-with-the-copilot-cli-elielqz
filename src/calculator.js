#!/usr/bin/env node
/**
 * Calculadora CLI
 *
 * Operações suportadas:
 *   addition (+)       - adição
 *   subtraction (-)  - subtração
 *   multiplication (*)  - multiplicação
 *   division (/)    - divisão (divisão por zero retorna erro)
 *
 * Uso: node src/calculator.js <operação> <número1> <número2>
 * Ex.: node src/calculator.js addition 2 3
 */

// Adição
function addition(a, b) {
  return a + b;
}

// Subtração
function subtraction(a, b) {
  return a - b;
}

// Multiplicação
function multiplication(a, b) {
  return a * b;
}

// Divisão (lança erro se o divisor for zero)
function division(a, b) {
  if (b === 0) {
    throw new Error('Erro: divisão por zero não é permitida.');
  }
  return a / b;
}

// Módulo (lança erro se o divisor for zero)
function modulo(a, b) {
  if (b === 0) {
    throw new Error('Erro: módulo por zero não é permitido.');
  }
  return a % b;
}

// Exponenciação
function power(base, exponent) {
  return Math.pow(base, exponent);
}

// Raiz quadrada (lança erro para números negativos)
function squareRoot(n) {
  if (n < 0) {
    throw new Error('Erro: não é possível calcular a raiz quadrada de número negativo.');
  }
  return Math.sqrt(n);
}

const operations = {
  addition, '+': addition,
  subtraction, '-': subtraction,
  multiplication, '*': multiplication, x: multiplication,
  division, '/': division,
};

function main(args) {
  const [op, rawA, rawB] = args;

  if (args.length !== 3) {
    console.error('Uso: node calculator.js <addition|subtraction|multiplication|division> <n1> <n2>');
    return 1;
  }

  const fn = operations[op];
  if (!fn) {
    console.error(`Erro: operação desconhecida "${op}". Use addition, subtraction, multiplication ou division.`);
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

module.exports = { addition, subtraction, multiplication, division, modulo, power, squareRoot };
