export const LineHeightIDPrefix = 'line_height_';
export const IDPrefixReg = new RegExp(`^(?!${LineHeightIDPrefix})(.+)$`);

export function ensurePrefixOnID(id: string | null) {
  if (!id) {
    return id;
  }
  return id.replace(IDPrefixReg, `${LineHeightIDPrefix}$1`);
}

export const getLineHeightID = (size: number) => {
  const MASK = 0x3d;
  const LETTERS = 'abcdefghijklmnopqrstuvwxyz';
  const NUMBERS = '1234567890';
  const charset = `${NUMBERS}${LETTERS}${LETTERS.toUpperCase()}`.split('');

  const bytes = new Uint8Array(size);
  crypto.getRandomValues(bytes);

  const id = bytes.reduce((acc, byte) => `${acc}${charset[byte & MASK]}`, '');
  return `${LineHeightIDPrefix}${id}`;
};
