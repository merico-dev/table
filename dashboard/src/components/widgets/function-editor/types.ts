// [ startLine, startColumn, endLine, endColumn ]
export type MonacoEditorRestrictionRange = [number, number, number, number];

export type MonacoEditorRestriction = {
  range: MonacoEditorRestrictionRange;
  label?: string;
  allowMultiline?: boolean;
  validate?: (currentlyTypedValue: any, newRange: any, info: any) => boolean;
};
