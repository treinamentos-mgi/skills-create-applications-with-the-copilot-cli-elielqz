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

  describe('modulo', () => {
    test('resto com operandos positivos e negativos', () => {
      expect(modulo(10, 3)).toBe(1);
      expect(modulo(-10, 3)).toBe(-1);
      expect(modulo(0, 3)).toBe(0);
    });
    test('divisor zero lança erro', () => {
      expect(() => modulo(10, 0)).toThrow('módulo por zero');
      expect(() => modulo(0, -0)).toThrow('módulo por zero');
    });
    test('operandos inválidos lançam erro', () => {
      expect(() => modulo(Infinity, 2)).toThrow('números válidos');
    });
  });

  describe('exponentiation', () => {
    test('expoentes positivos, negativos e fracionários', () => {
      expect(exponentiation(2, 3)).toBe(8);
      expect(exponentiation(2, -2)).toBe(0.25);
      expect(exponentiation(9, 0.5)).toBe(3);
      expect(exponentiation(0, 0)).toBe(1);
    });
    test('resultados não reais ou não finitos lançam erro', () => {
      expect(() => exponentiation(-1, 0.5)).toThrow('exponenciação');
      expect(() => exponentiation(0, -1)).toThrow('exponenciação');
      expect(() => exponentiation(10, 1000)).toThrow('exponenciação');
      expect(() => exponentiation(NaN, 0)).toThrow('números válidos');
    });
  });

  describe('squareRoot', () => {
    test('raiz de zero e números positivos', () => {
      expect(squareRoot(0)).toBe(0);
      expect(squareRoot(9)).toBe(3);
      expect(squareRoot(2)).toBeCloseTo(Math.SQRT2);
    });
    test('número negativo ou inválido lança erro', () => {
      expect(() => squareRoot(-1)).toThrow('raiz quadrada de número negativo');
      expect(() => squareRoot(Infinity)).toThrow('números válidos');
    });
  });

  describe('CLI das novas operações', () => {
    const run = (...args) => spawnSync(process.execPath, [require.resolve('../calculator'), ...args], { encoding: 'utf8' });

    test.each([
      [['modulo', '10', '3'], '1'],
      [['%', '10', '3'], '1'],
      [['exponentiation', '2', '3'], '8'],
      [['squareRoot', '9'], '3'],
    ])('%j retorna %s', (args, expected) => {
      const result = run(...args);
      expect(result.status).toBe(0);
      expect(result.stdout.trim()).toBe(expected);
      expect(result.stderr).toBe('');
    });

    test.each([
      [['modulo', '1', '0'], 'módulo por zero'],
      [['exponentiation', '-1', '0.5'], 'exponenciação'],
      [['squareRoot', '-1'], 'raiz quadrada de número negativo'],
      [['squareRoot', 'abc'], 'números válidos'],
      [['squareRoot'], 'Uso:'],
      [['squareRoot', '9', '2'], 'Uso:'],
      [['modulo', '1'], 'Uso:'],
    ])('%j retorna erro', (args, message) => {
      const result = run(...args);
      expect(result.status).toBe(1);
      expect(result.stdout).toBe('');
      expect(result.stderr).toContain(message);
    });
  });
  test('0 / 0 lança erro', () => {
    expect(() => division(0, 0)).toThrow();
  });
});
