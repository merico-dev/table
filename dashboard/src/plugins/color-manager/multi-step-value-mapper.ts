import { findLastIndex } from 'lodash';
import { IValueMapper } from './type';

export interface IValueStep {
  from: number;
  to: number;
}

function minmax(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export class MultiStepValueMapper implements IValueMapper {
  constructor(public steps: IValueStep[]) {
    const deduplicated: IValueStep[] = [];
    const toValues = new Set<number>();
    for (const step of steps) {
      if (!toValues.has(step.to)) {
        deduplicated.push(step);
        toValues.add(step.to);
      }
    }
    deduplicated.sort((a, b) => a.from - b.from);
    if (deduplicated.length < 2) {
      throw new Error('MultiStepValueMapper requires at least 2 steps');
    }
    this.steps = deduplicated;
  }

  protected getLinearFunction(p1: IValueStep, p2: IValueStep): (x: number) => number {
    const m = (p2.to - p1.to) / (p2.from - p1.from);
    const b = p1.to - m * p1.from;
    return (x: number) => m * x + b;
  }

  protected getStepFunctionForValue(value: number): (x: number) => number {
    let step = findLastIndex(this.steps, (s) => s.from <= value);
    step = minmax(step, 0, this.steps.length - 2);
    return this.getLinearFunction(this.steps[step], this.steps[step + 1]);
  }

  mapValue(from: number): number {
    return minmax(this.getStepFunctionForValue(from)(from), 0, 100);
  }
}
