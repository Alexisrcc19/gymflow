export function formatMemberCode(sequence: number): string {
  if (!Number.isSafeInteger(sequence) || sequence < 1) {
    throw new RangeError('Member sequence must be a positive integer');
  }

  return `MEM-${sequence.toString().padStart(6, '0')}`;
}
