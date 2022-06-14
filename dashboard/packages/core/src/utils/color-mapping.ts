import { interpolate } from "popmotion"

interface InterpolateColorOption {
  valueRange: number[];
  colorRange: string[];
}
export class InterpolateColor {
  mapper: (v: number) => string;

  constructor({ valueRange, colorRange }: InterpolateColorOption) {
    this.mapper = interpolate(valueRange, colorRange)
  }

  getColor(value: number) {
    return this.mapper(value)
  }
}