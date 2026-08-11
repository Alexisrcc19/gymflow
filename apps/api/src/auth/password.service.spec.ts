import { PasswordService } from './password.service';

describe('PasswordService', () => {
  const service = new PasswordService();

  it('hashes and verifies a password without retaining its plaintext value', async () => {
    const password = 'A-valid-demo-password-123';
    const hash = await service.hash(password);

    expect(hash).not.toContain(password);
    await expect(service.verify(hash, password)).resolves.toBe(true);
    await expect(service.verify(hash, 'incorrect-password')).resolves.toBe(
      false,
    );
  });
});
