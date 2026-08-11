import {
  NodeEnvironment,
  parseCorsOrigins,
  validateEnvironment,
} from './environment';

describe('environment configuration', () => {
  const requiredConfiguration = {
    JWT_ACCESS_SECRET: 'a-secure-test-secret-with-at-least-32-characters',
  };

  it('applies safe local defaults', () => {
    expect(validateEnvironment(requiredConfiguration)).toEqual({
      NODE_ENV: NodeEnvironment.Development,
      PORT: 3333,
      CORS_ORIGINS: 'http://localhost:4200',
      SWAGGER_ENABLED: true,
      DATABASE_URL:
        'postgresql://gymflow:gymflow_dev@localhost:5433/gymflow?schema=public',
      JWT_ACCESS_SECRET: requiredConfiguration.JWT_ACCESS_SECRET,
      JWT_ACCESS_TTL_SECONDS: 900,
      REFRESH_SESSION_TTL_DAYS: 30,
      REFRESH_COOKIE_NAME: 'gymflow_refresh',
      INVITATION_TTL_HOURS: 48,
      MEMBER_PORTAL_URL: 'http://localhost:4201',
      SMTP_HOST: 'localhost',
      SMTP_PORT: 1025,
      SMTP_SECURE: false,
      SMTP_USER: '',
      SMTP_PASSWORD: '',
      MAIL_FROM: 'GymFlow <no-reply@gymflow.local>',
    });
  });

  it('converts supported environment values', () => {
    expect(
      validateEnvironment({
        ...requiredConfiguration,
        NODE_ENV: 'test',
        PORT: '4400',
        SWAGGER_ENABLED: 'false',
      }),
    ).toMatchObject({
      NODE_ENV: NodeEnvironment.Test,
      PORT: 4400,
      SWAGGER_ENABLED: false,
    });
  });

  it('rejects an invalid port', () => {
    expect(() =>
      validateEnvironment({ ...requiredConfiguration, PORT: '70000' }),
    ).toThrow('Invalid environment configuration');
  });

  it('requires a sufficiently strong access-token secret', () => {
    expect(() =>
      validateEnvironment({ JWT_ACCESS_SECRET: 'too-short' }),
    ).toThrow('Invalid environment configuration');
  });

  it('normalizes a comma-separated origin allowlist', () => {
    expect(
      parseCorsOrigins('http://localhost:4200, https://gymflow.example '),
    ).toEqual(['http://localhost:4200', 'https://gymflow.example']);
  });
});
