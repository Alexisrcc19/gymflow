import {
  NodeEnvironment,
  parseCorsOrigins,
  validateEnvironment,
} from './environment';

describe('environment configuration', () => {
  it('applies safe local defaults', () => {
    expect(validateEnvironment({})).toEqual({
      NODE_ENV: NodeEnvironment.Development,
      PORT: 3333,
      CORS_ORIGINS: 'http://localhost:4200',
      SWAGGER_ENABLED: true,
      DATABASE_URL:
        'postgresql://gymflow:gymflow_dev@localhost:5433/gymflow?schema=public',
    });
  });

  it('converts supported environment values', () => {
    expect(
      validateEnvironment({
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
    expect(() => validateEnvironment({ PORT: '70000' })).toThrow(
      'Invalid environment configuration',
    );
  });

  it('normalizes a comma-separated origin allowlist', () => {
    expect(
      parseCorsOrigins('http://localhost:4200, https://gymflow.example '),
    ).toEqual(['http://localhost:4200', 'https://gymflow.example']);
  });
});
