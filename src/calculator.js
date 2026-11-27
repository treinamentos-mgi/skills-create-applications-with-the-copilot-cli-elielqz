#!/usr/bin/env node
/**
 * Calculadora CLI
 *
 * Operações suportadas:
 *   addition (+)       - adição
 *   subtraction (-)  - subtração
 *   multiplication (*)  - multiplicação
 *   division (/)    - divisão (divisão por zero retorna erro)
 *   modulo (%)      - resto da divisão
 *   exponentiation - potenciação
 *   squareRoot     - raiz quadrada
 *
 * Uso: node src/calculator.js <operação> <número1> <número2>
 *      node src/calculator.js squareRoot <número>
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

function modulo(a, b) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    throw new Error('Erro: os operandos devem ser números válidos.');
  }
  if (b === 0) {
    throw new Error('Erro: módulo por zero não é permitido.');
  }
  return a % b;
}

function exponentiation(a, b) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    throw new Error('Erro: os operandos devem ser números válidos.');
  }
  const result = Math.pow(a, b);
  if (!Number.isFinite(result)) {
    throw new Error('Erro: resultado da exponenciação não é um número finito.');
  }
  return result;
}

function squareRoot(a) {
  if (!Number.isFinite(a)) {
    throw new Error('Erro: os operandos devem ser números válidos.');
  }
  if (a < 0) {
    throw new Error('Erro: raiz quadrada de número negativo não é permitida.');
  }
  return Math.sqrt(a);
}

const operations = {
  addition, '+': addition,
  subtraction, '-': subtraction,
  multiplication, '*': multiplication, x: multiplication,
  division, '/': division,
  modulo, '%': modulo,
  exponentiation,
  squareRoot,
};

function main(args) {
  const [op, rawA, rawB] = args;

  if (args.length !== (op === 'squareRoot' ? 2 : 3)) {
    console.error('Uso: node calculator.js <addition|subtraction|multiplication|division|modulo|exponentiation> <n1> <n2> ou node calculator.js squareRoot <n1>');
    return 1;
  }

  const fn = operations[op];
  if (!fn) {
    console.error(`Erro: operação desconhecida "${op}". Use addition, subtraction, multiplication, division, modulo, exponentiation ou squareRoot.`);
    return 1;
  }

  const a = Number(rawA);
  const b = op === 'squareRoot' ? undefined : Number(rawB);
  if (!Number.isFinite(a) || (op !== 'squareRoot' && !Number.isFinite(b))) {
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

module.exports = { addition, subtraction, multiplication, division, modulo, exponentiation, squareRoot };
