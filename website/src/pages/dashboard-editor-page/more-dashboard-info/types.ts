export type TModalState = {
  opened: boolean;
  open: () => void;
  close: () => void;
};

export type TModalStates = {
  changelog: TModalState;
  version: TModalState;
};
