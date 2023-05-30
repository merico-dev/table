export type TCustomFunctionDefinition = () => Record<string, any>;
export type TCustomFunctionDto = {
  id: string;
  is_preset: boolean;
  definition: string;
  create_time: string;
  update_time: string;
};
