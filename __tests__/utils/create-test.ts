import { Module, Type } from '@nestjs/common';
import { AbstractHttpAdapter, NestFactory, Reflector } from '@nestjs/core';
import { RolesGuardStatic } from '../../src/roles-guard-static';
import { fastifyExtraWait } from './fastify-extra-wait';
import { requestWithRole } from './request-with-role';

export async function createTest<R>(
  controller: any,
  Guard: RolesGuardStatic<R>,
  Adapter: Type<AbstractHttpAdapter<any, any, any>>,
  role: R,
) {
  @Module({ controllers: [controller] })
  class TestModule {}

  const app = await NestFactory.create(TestModule, new Adapter(), {
    logger: false,
  });

  const reflector = app.get<Reflector>(Reflector);
  app.useGlobalGuards(new Guard(reflector));

  const server = app.getHttpServer();
  await app.init();
  await fastifyExtraWait(Adapter, app);
  await requestWithRole(server, role);
  await app.close();
}
