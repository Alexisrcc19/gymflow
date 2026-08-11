import { createParamDecorator, ExecutionContext } from '@nestjs/common';

interface RequestWithCookies {
  cookies?: Record<string, string>;
}

export const Cookies = createParamDecorator(
  (
    name: string | undefined,
    context: ExecutionContext,
  ): string | Record<string, string> | undefined => {
    const cookies = context
      .switchToHttp()
      .getRequest<RequestWithCookies>().cookies;
    return name ? cookies?.[name] : cookies;
  },
);
