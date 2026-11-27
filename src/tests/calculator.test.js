const { addition, subtraction, multiplication, division, modulo, exponentiation, squareRoot } = require('../calculator');
const { spawnSync } = require('node:child_process');
const path = require('node:path');

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

  describe('modulo', () => {
    test.each([
      [10, 3, 1], [-10, 3, -1], [10, -3, 1], [0, 3, 0], [5.5, 2, 1.5],
    ])('%s %% %s = %s', (a, b, expected) => expect(modulo(a, b)).toBe(expected));
    test.each([0, -0])('divisor %s lança erro', b => {
      expect(() => modulo(10, b)).toThrow('módulo por zero');
    });
  });

  describe('exponentiation', () => {
    test.each([
      [2, 3, 8], [2, 0, 1], [2, -2, 0.25], [9, 0.5, 3], [-2, 3, -8], [0, 2, 0],
    ])('%s ** %s = %s', (a, b, expected) => expect(exponentiation(a, b)).toBe(expected));
    test.each([[0, -1], [-1, 0.5], [10, 1000]])('resultado inválido para %s ** %s', (a, b) => {
      expect(() => exponentiation(a, b)).toThrow('número real finito');
    });
  });

  describe('squareRoot', () => {
    test.each([[9, 3], [0, 0], [0.25, 0.5], [2, Math.SQRT2]])('raiz de %s = %s', (a, expected) => {
      expect(squareRoot(a)).toBeCloseTo(expected);
    });
    test('número negativo lança erro', () => {
      expect(() => squareRoot(-1)).toThrow('número negativo');
    });
  });

  describe('validação das novas operações', () => {
    test.each([NaN, Infinity, -Infinity, '2', undefined])('rejeita operando inválido %s', value => {
      expect(() => modulo(value, 2)).toThrow('números válidos');
      expect(() => modulo(2, value)).toThrow('números válidos');
      expect(() => exponentiation(value, 2)).toThrow('números válidos');
      expect(() => exponentiation(2, value)).toThrow('números válidos');
      expect(() => squareRoot(value)).toThrow('números válidos');
    });
  });

  describe('CLI', () => {
    function run(...args) {
      return spawnSync(process.execPath, [path.join(__dirname, '../calculator.js'), ...args], { encoding: 'utf8' });
    }

    test.each([
      ['addition', '2', '3', '5'], ['subtraction', '10', '4', '6'],
      ['multiplication', '45', '2', '90'], ['division', '20', '5', '4'],
      ['modulo', '10', '3', '1'], ['%', '10', '3', '1'],
      ['exponentiation', '2', '3', '8'], ['**', '2', '3', '8'],
    ])('%s funciona com dois operandos', (op, a, b, expected) => {
      const result = run(op, a, b);
      expect(result.status).toBe(0);
      expect(result.stdout.trim()).toBe(expected);
      expect(result.stderr).toBe('');
    });

    test.each(['squareRoot', 'sqrt'])('%s funciona com um operando', op => {
      const result = run(op, '9');
      expect(result.status).toBe(0);
      expect(result.stdout.trim()).toBe('3');
      expect(result.stderr).toBe('');
    });

    test.each([
      [['modulo', '10', '0'], 'módulo por zero'],
      [['squareRoot', '-1'], 'número negativo'],
      [['exponentiation', '-1', '0.5'], 'número real finito'],
      [['exponentiation', '10', '1000'], 'número real finito'],
      [['squareRoot', 'abc'], 'números válidos'],
      [['modulo', 'Infinity', '2'], 'números válidos'],
      [['squareRoot'], 'Uso:'],
      [['squareRoot', '9', '2'], 'Uso:'],
      [['modulo', '2'], 'Uso:'],
      [['exponentiation', '2'], 'Uso:'],
      [['unknown', '2', '3'], 'operação desconhecida'],
      [['constructor', '2', '3'], 'operação desconhecida'],
    ])('erro para %j', (args, message) => {
      const result = run(...args);
      expect(result.status).toBe(1);
      expect(result.stderr).toContain(message);
      expect(result.stdout).toBe('');
    });
  });
  test('0 / 0 lança erro', () => {
    expect(() => division(0, 0)).toThrow();
  });
});
