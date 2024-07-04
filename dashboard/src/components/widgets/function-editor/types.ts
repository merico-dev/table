export type MonacoEditorRestriction = {
  // range : [ startLine, startColumn, endLine, endColumn ]
  range: [number, number, number, number];
  label?: string;
  allowMultiline?: boolean;
  validate?: (currentlyTypedValue: any, newRange: any, info: any) => boolean;
};
