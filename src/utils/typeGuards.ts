export function isNumberString(value: unknown): value is `${number}` {
  return typeof value === 'string' && !isNaN(Number(value));
}
