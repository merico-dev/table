import { describe, it, expect } from 'vitest';
import { buildBarData } from '../index';

describe('buildBarData', () => {
  it('should ensure no duplicate x-axis categories with unique labels', () => {
    const data = [
      { id: 'alice@example.com', label: 'A', value: 10 },
      { id: 'bob@example.com', label: 'B', value: 20 },
      { id: 'charlie@example.com', label: 'C', value: 30 },
    ];

    const result = buildBarData(data, 'id', 'label', 'value');
    const categories = result.map(([x]) => x);

    expect(result).toHaveLength(3);
    expect(new Set(categories).size).toBe(3); // all categories are unique
  });

  it('should ensure no duplicate x-axis categories when labels are duplicated with different IDs', () => {
    const data = [
      { id: 'alice@example.com', label: 'A', value: 10 },
      { id: 'alice.smith@example.com', label: 'A', value: 20 },
      { id: 'bob@example.com', label: 'B', value: 30 },
    ];

    const result = buildBarData(data, 'id', 'label', 'value');
    const categories = result.map(([x]) => x);

    expect(result).toHaveLength(3);
    expect(new Set(categories).size).toBe(3); // all categories are unique
    expect(categories[0]).toBe('A');
    expect(categories[1]).toContain('A');
    expect(categories[1]).toContain('alice.smith@example.com');
  });

  it('should ensure no duplicate x-axis categories when labels are duplicated without IDs', () => {
    const data = [
      { label: 'A', value: 10 },
      { label: 'A', value: 20 },
      { label: 'A', value: 30 },
    ];

    const result = buildBarData(data, 'id', 'label', 'value');
    const categories = result.map(([x]) => x);

    expect(result).toHaveLength(3);
    expect(new Set(categories).size).toBe(3); // all categories are unique
    expect(categories[0]).toBe('A');
    expect(categories[1]).toContain('A');
    expect(categories[2]).toContain('A');
  });

  it('should handle nested object paths and ensure unique categories', () => {
    const data = [
      { nested: { id: 'david@example.com', label: 'A' }, metrics: { value: 10 } },
      { nested: { id: 'eve@example.com', label: 'B' }, metrics: { value: 20 } },
    ];

    const result = buildBarData(data, 'nested.id', 'nested.label', 'metrics.value');
    const categories = result.map(([x]) => x);

    expect(result).toHaveLength(2);
    expect(new Set(categories).size).toBe(2); // all categories are unique
  });

  it('should convert string values to numbers', () => {
    const data = [
      { id: 'frank@example.com', label: 'A', value: '10' },
      { id: 'grace@example.com', label: 'B', value: '20.5' },
    ];

    const result = buildBarData(data, 'id', 'label', 'value');

    expect(result[0][1]).toBe(10);
    expect(result[1][1]).toBe(20.5);
  });

  it('should handle empty data array', () => {
    const data: Record<string, any>[] = [];

    const result = buildBarData(data, 'id', 'label', 'value');

    expect(result).toEqual([]);
  });

  it('should ensure unique categories even with complex duplicate scenarios', () => {
    const data = [
      { id: 'kate@example.com', label: 'A', value: 10 },
      { id: 'leo@example.com', label: 'A', value: 20 },
      { label: 'A', value: 30 }, // no id
      { id: 'mike@example.com', label: 'A', value: 40 },
    ];

    const result = buildBarData(data, 'id', 'label', 'value');
    const categories = result.map(([x]) => x);

    expect(result).toHaveLength(4);
    expect(new Set(categories).size).toBe(4); // all categories are unique
  });

  it('should ensure unique categories when first record has no ID', () => {
    const data = [
      { label: 'A', value: 10 }, // no id
      { id: 'nancy@example.com', label: 'A', value: 20 },
      { id: 'oscar@example.com', label: 'A', value: 30 },
    ];

    const result = buildBarData(data, 'id', 'label', 'value');
    const categories = result.map(([x]) => x);

    expect(result).toHaveLength(3);
    expect(new Set(categories).size).toBe(3); // all categories are unique
  });

  it('should preserve numeric values including zero and negatives', () => {
    const data = [
      { id: 'paul@example.com', label: 'A', value: 0 },
      { id: 'quinn@example.com', label: 'B', value: -10 },
      { id: 'rachel@example.com', label: 'C', value: -20.5 },
    ];

    const result = buildBarData(data, 'id', 'label', 'value');
    const categories = result.map(([x]) => x);

    expect(result).toHaveLength(3);
    expect(new Set(categories).size).toBe(3); // all categories are unique
  });

  it('should use serial numbers when idKey is the same as labelKey', () => {
    const data = [
      { name: 'Product A', value: 100 },
      { name: 'Product A', value: 200 },
      { name: 'Product A', value: 300 },
      { name: 'Product B', value: 150 },
    ];

    const result = buildBarData(data, 'name', 'name', 'value');
    const categories = result.map(([x]) => x);

    expect(result).toHaveLength(4);
    expect(new Set(categories).size).toBe(4); // all categories are unique
    expect(categories[0]).toBe('Product A');
    expect(categories[1]).toContain('Product A');
    expect(categories[1]).toMatch(/Product A \(\d+\)/); // should use serial number
    expect(categories[2]).toContain('Product A');
    expect(categories[2]).toMatch(/Product A \(\d+\)/); // should use serial number
    expect(categories[3]).toBe('Product B');
  });

  it('should use serial numbers when record ID value equals label value', () => {
    const data = [
      { id: 'A', label: 'A', value: 100 },
      { id: 'A', label: 'A', value: 200 },
      { id: 'B', label: 'B', value: 150 },
      { id: 'C', label: 'A', value: 300 }, // different id but same label
    ];

    const result = buildBarData(data, 'id', 'label', 'value');
    const categories = result.map(([x]) => x);

    expect(result).toHaveLength(4);
    expect(new Set(categories).size).toBe(4); // all categories are unique
    expect(categories[0]).toBe('A');
    expect(categories[1]).toMatch(/A \(\d+\)/); // should use serial number when id === label
    expect(categories[2]).toBe('B');
    expect(categories[3]).toBe('A (C)'); // should use ID when id !== label
  });
});
