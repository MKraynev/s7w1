import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
import { RequestDeviceEntity } from './entity/RequestDeviceEntity';

export const ReadRequestDevice = createParamDecorator(
  async (data: any, ctx: ExecutionContext): Promise<RequestDeviceEntity> => {
    const req = ctx.switchToHttp().getRequest() as Request & {
      rawHeaders: Array<string>;
    };

    // Check if the request is coming through a proxy
    const forwardedForHeader =
      req.headers['x-forwarded-for'] || req.headers['x-real-ip'];
    const clientIp = forwardedForHeader
      ? String(forwardedForHeader).split(',')[0].trim()
      : req.ip;

    const userAgentPos = req.rawHeaders.findIndex(
      (header) => header === 'User-Agent',
    );
    const userAgent = req.rawHeaders[userAgentPos + 1];

    const device = new RequestDeviceEntity(userAgent, clientIp);

    return device;
  },
);
