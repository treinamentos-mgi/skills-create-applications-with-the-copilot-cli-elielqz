const { spawnSync } = require('child_process');
const { addition, subtraction, multiplication, division, modulo, exponentiation, squareRoot } = require('../calculator');

describe('addition', () => {
  test('2 + 3 = 5', () => expect(addition(2, 3)).toBe(5));
  test('números negativos', () => expect(addition(-2, -3)).toBe(-5));
  test('positivo + negativo', () => expect(addition(5, -8)).toBe(-3));
  test('zero é elemento neutro', () => expect(addition(7, 0)).toBe(7));
  test('decimais', () => expect(addition(0.1, 0.2)).toBeCloseTo(0.3));
});

describe('subtraction', () => {
  test('10 - 4 = 6', () => expect(subtraction(10, 4)).toBe(6));
  test('resultado negativo', () => expect(subtraction(4, 10)).toBe(-6));
  test('subtrair negativo', () => expect(subtraction(5, -3)).toBe(8));
  test('subtrair zero', () => expect(subtraction(9, 0)).toBe(9));
  test('decimais', () => expect(subtraction(0.5, 0.25)).toBeCloseTo(0.25));
});

describe('multiplication', () => {
  test('45 * 2 = 90', () => expect(multiplication(45, 2)).toBe(90));
  test('por zero', () => expect(multiplication(123, 0)).toBe(0));
  test('negativo * negativo', () => expect(multiplication(-3, -4)).toBe(12));
  test('positivo * negativo', () => expect(multiplication(3, -4)).toBe(-12));
  test('decimais', () => expect(multiplication(1.5, 2)).toBe(3));
});

describe('division', () => {
  test('20 / 5 = 4', () => expect(division(20, 5)).toBe(4));
  test('resultado decimal', () => expect(division(1, 4)).toBe(0.25));
  test('negativos', () => expect(division(-10, 2)).toBe(-5));
  test('zero dividido por número', () => expect(division(0, 5)).toBe(0));
  test('divisão por zero lança erro', () => {
    expect(() => division(10, 0)).toThrow('divisão por zero');
  });
  test('0 / 0 lança erro', () => {
    expect(() => division(0, 0)).toThrow();
  });
});

describe('modulo', () => {
  test('resto da divisão', () => expect(modulo(10, 3)).toBe(1));
  test('dividendo negativo', () => expect(modulo(-10, 3)).toBe(-1));
  test('divisor zero lança erro', () => expect(() => modulo(10, 0)).toThrow('módulo por zero'));
});

describe('exponentiation', () => {
  test('potência inteira', () => expect(exponentiation(2, 3)).toBe(8));
  test('expoente negativo', () => expect(exponentiation(2, -2)).toBe(0.25));
  test('resultado não real lança erro', () => expect(() => exponentiation(-1, 0.5)).toThrow());
  test('resultado infinito lança erro', () => expect(() => exponentiation(0, -1)).toThrow());
  test('estouro numérico lança erro', () => expect(() => exponentiation(10, 1000)).toThrow());
});

describe('squareRoot', () => {
  test('raiz quadrada', () => expect(squareRoot(9)).toBe(3));
  test('raiz de zero', () => expect(squareRoot(0)).toBe(0));
  test('número negativo lança erro', () => expect(() => squareRoot(-1)).toThrow('raiz quadrada de número negativo'));
});

describe('CLI', () => {
  const run = (...args) => spawnSync(process.execPath, [require.resolve('../calculator'), ...args], { encoding: 'utf8' });

  test.each([
    [['modulo', '10', '3'], '1'],
    [['%', '10', '3'], '1'],
    [['exponentiation', '2', '3'], '8'],
    [['^', '2', '3'], '8'],
    [['squareRoot', '9'], '3'],
    [['sqrt', '9'], '3'],
    [['addition', '2', '3'], '5'],
  ])('%j retorna %s', (args, expected) => {
    const result = run(...args);
    expect(result.status).toBe(0);
    expect(result.stdout.trim()).toBe(expected);
  });

  test.each([
    ['modulo', '1', '0'],
    ['exponentiation', '-1', '0.5'],
    ['squareRoot', '-1'],
    ['sqrt', 'abc'],
    ['sqrt', '9', '2'],
    ['modulo', '1'],
  ])('%j retorna erro', (...args) => {
    const result = run(...args);
    expect(result.status).toBe(1);
    expect(result.stderr).toMatch(/Erro|Uso/);
  });
});
