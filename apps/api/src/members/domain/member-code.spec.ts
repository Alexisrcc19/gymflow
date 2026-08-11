import { formatMemberCode } from './member-code';

describe('formatMemberCode', () => {
  it('formats the gym sequence with a stable prefix and padding', () => {
    expect(formatMemberCode(1)).toBe('MEM-000001');
    expect(formatMemberCode(123456)).toBe('MEM-123456');
  });

  it('rejects invalid sequence values', () => {
    expect(() => formatMemberCode(0)).toThrow(RangeError);
    expect(() => formatMemberCode(1.5)).toThrow(RangeError);
  });
});
