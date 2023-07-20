import { MultiStepValueMapper } from './multi-step-value-mapper';

function assertMappedValues(values: number[], mapper: MultiStepValueMapper) {
  const [first, ...rest] = values.map((v) => ({
    x: v,
    y: mapper.mapValue(v),
  }));
  const k = rest.map((p) => (p.y - first.y) / (p.x - first.x));
  expect(k.every((v) => Math.abs(v - k[0]) < 0.001)).toBe(true);
}

describe('MultiStepValueMapper', () => {
  let mapper: MultiStepValueMapper;
  describe('[0 -> 0], [200 -> 100]', () => {
    beforeEach(() => {
      mapper = new MultiStepValueMapper([
        { from: 0, to: 0 },
        {
          from: 200,
          to: 100,
        },
      ]);
    });
    test.each([[[0, 100, 200]]])('should map %s', (values) => {
      assertMappedValues(values, mapper);
    });
    test('result should not be greater than 100', () => {
      expect(mapper.mapValue(400)).toBe(100);
    });
    test('result should not be less than 0', () => {
      expect(mapper.mapValue(-100)).toBe(0);
    });
  });
  describe('[0 -> 0], [130 -> 50] , [200 -> 100]', () => {
    beforeEach(() => {
      mapper = new MultiStepValueMapper([
        { from: 0, to: 0 },
        { from: 130, to: 50 },
        {
          from: 200,
          to: 100,
        },
      ]);
    });
    test.each([[[0, 40, 100, 130]], [[131, 150, 200]]])('should map %s', (values: number[]) => {
      assertMappedValues(values, mapper);
    });
  });
  test('requires at least 2 steps', () => {
    expect(() => new MultiStepValueMapper([{ from: 0, to: 0 }])).toThrowError();
  });

  test('steps in wrong order', () => {
    mapper = new MultiStepValueMapper([
      { from: 130, to: 50 },
      { from: 0, to: 0 },
      { from: 400, to: 100 },
    ]);
    assertMappedValues([0, 40, 100, 130], mapper);
    assertMappedValues([131, 150, 200, 400], mapper);
  });

  test('duplicated steps should be ignored', () => {
    mapper = new MultiStepValueMapper([
      { from: 130, to: 50 },
      { from: 0, to: 0 },
      { from: 400, to: 100 },
      { from: 200, to: 100 },
    ]);
    assertMappedValues([0, 40, 100, 130], mapper);
    assertMappedValues([131, 150, 200, 300, 400], mapper);
  });
});
