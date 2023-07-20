export interface IValueMapper {
  /**
   * Maps any number to a number between 0 and 100
   * @param from
   */
  mapValue(from: number): number;
}
