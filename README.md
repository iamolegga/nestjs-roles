<h1 align="center">nestjs-roles</h1>


<p align="center">
  <a href="https://www.npmjs.com/package/nestjs-roles">
    <img alt="npm" src="https://img.shields.io/npm/v/nestjs-roles" />
  </a>
  <img alt="GitHub branch checks state" src="https://badgen.net/github/checks/iamolegga/nestjs-roles" />
  <a href="https://codeclimate.com/github/iamolegga/nestjs-roles/test_coverage">
    <img src="https://api.codeclimate.com/v1/badges/267a32bd68cbc25c7f7c/test_coverage" />
  </a>
  <img alt="Supported platforms: Express & Fastify" src="https://img.shields.io/badge/platforms-Express%20%26%20Fastify-green" />
</p>
<p align="center">
  <a href="https://snyk.io/test/github/iamolegga/nestjs-roles">
    <img alt="Snyk Vulnerabilities for npm package" src="https://img.shields.io/snyk/vulnerabilities/npm/nestjs-roles" />
  </a>
  <a href="https://david-dm.org/iamolegga/nestjs-roles">
    <img alt="Dependencies status" src="https://badgen.net/david/dep/iamolegga/nestjs-roles">
  </a>
  <img alt="Dependabot" src="https://badgen.net/dependabot/iamolegga/nestjs-roles/?icon=dependabot">
  <a href="https://codeclimate.com/github/iamolegga/nestjs-roles">
    <img alt="Maintainability" src="https://badgen.net/codeclimate/maintainability/iamolegga/nestjs-roles">
  </a>
</p>

Type safe roles guard with the decorator for controller made easy. Just specify how to get `role` from `ExecutionContext`. `nestjs-roles` will do the rest.

## Install

```sh
npm i nestjs-roles
```

## Example

First, let's define roles:

```ts
// role.enum.ts

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  MODERATOR = 'MODERATOR',
}
```

Let's say you use [nestjs-session](http://npm.im/nestjs-session) and keep `role` in `session` property object of `request`. So then create guard with `getRole` callback:

```ts
// roles.guard.ts

import { ExecutionContext } from '@nestjs/common';
import { createRolesGuard } from 'nestjs-roles';
import { Role } from './role.enum';

function getRole(context: ExecutionContext) {
  const { session } = context.switchToHttp().getRequest();
  if (!session) {
    return;
  }
  
  // you can use single role or array of roles
  // if you provide array of roles, the guard will pass if one of roles is in required roles
  return (session as { role?: Role | Role[] }).role;
}

export const Roles = createRolesGuard<Role>(getRole);
```

After that we can set `Roles` guard globally (don't forget to pass `Reflector` instance):

```ts
// bootstrap.ts

import { NestFactory, Reflector } from '@nestjs/core';
import { Roles } from './roles.guard';

const app = await NestFactory.create(AppModule);

const reflector = app.get<Reflector>(Reflector);
app.useGlobalGuards(new Roles(reflector));
```

All settings are done. Now you can set up access in your controllers:

```ts
// secrets.controller.ts

import { Roles } from './roles.guard';

@Controller('secrets')
@Roles.Params(true) // setup access on Controller for users with any existing role
export class SecretsController {

  @Get('my')
  async readMy() {
    // ...
  }

  @Patch(':id')
  @Roles.Params(Role.ADMIN) // override access on certain handler
  async update() {
    // ...
  }
}
```

---

<h2 align="center">Do you use this library?<br/>Don't be shy to give it a star! ★</h2>

Also if you are into NestJS ecosystem you may be interested in one of my other libs:

[nestjs-pino](https://github.com/iamolegga/nestjs-pino)

[![GitHub stars](https://img.shields.io/github/stars/iamolegga/nestjs-pino?style=flat-square)](https://github.com/iamolegga/nestjs-pino)
[![npm](https://img.shields.io/npm/dm/nestjs-pino?style=flat-square)](https://www.npmjs.com/package/nestjs-pino)

Platform agnostic logger for NestJS based on [pino](http://getpino.io/) with request context in every log

---

[nestjs-session](https://github.com/iamolegga/nestjs-session)

[![GitHub stars](https://img.shields.io/github/stars/iamolegga/nestjs-session?style=flat-square)](https://github.com/iamolegga/nestjs-session)
[![npm](https://img.shields.io/npm/dm/nestjs-session?style=flat-square)](https://www.npmjs.com/package/nestjs-session)

Idiomatic session module for NestJS. Built on top of [express-session](https://www.npmjs.com/package/express-session)

---

[nestjs-cookie-session](https://github.com/iamolegga/nestjs-cookie-session)

[![GitHub stars](https://img.shields.io/github/stars/iamolegga/nestjs-cookie-session?style=flat-square)](https://github.com/iamolegga/nestjs-cookie-session)
[![npm](https://img.shields.io/npm/dm/nestjs-cookie-session?style=flat-square)](https://www.npmjs.com/package/nestjs-cookie-session)

Idiomatic cookie session module for NestJS. Built on top of [cookie-session](https://www.npmjs.com/package/cookie-session)

---

[nestjs-roles](https://github.com/iamolegga/nestjs-roles)

[![GitHub stars](https://img.shields.io/github/stars/iamolegga/nestjs-roles?style=flat-square)](https://github.com/iamolegga/nestjs-roles)
[![npm](https://img.shields.io/npm/dm/nestjs-roles?style=flat-square)](https://www.npmjs.com/package/nestjs-roles)

Type safe roles guard and decorator made easy

---

[nestjs-injectable](https://github.com/segmentstream/nestjs-injectable)

[![GitHub stars](https://img.shields.io/github/stars/segmentstream/nestjs-injectable?style=flat-square)](https://github.com/segmentstream/nestjs-injectable)
[![npm](https://img.shields.io/npm/dm/nestjs-injectable?style=flat-square)](https://www.npmjs.com/package/nestjs-injectable)

`@Injectable()` on steroids that simplifies work with inversion of control in your hexagonal architecture

---

[nest-ratelimiter](https://github.com/iamolegga/nestjs-ratelimiter)

[![GitHub stars](https://img.shields.io/github/stars/iamolegga/nestjs-ratelimiter?style=flat-square)](https://github.com/iamolegga/nestjs-ratelimiter)
[![npm](https://img.shields.io/npm/dm/nest-ratelimiter?style=flat-square)](https://www.npmjs.com/package/nest-ratelimiter)

Distributed consistent flexible NestJS rate limiter based on Redis

---

[create-nestjs-middleware-module](https://github.com/iamolegga/create-nestjs-middleware-module)

[![GitHub stars](https://img.shields.io/github/stars/iamolegga/create-nestjs-middleware-module?style=flat-square)](https://github.com/iamolegga/create-nestjs-middleware-module)
[![npm](https://img.shields.io/npm/dm/create-nestjs-middleware-module?style=flat-square)](https://www.npmjs.com/package/create-nestjs-middleware-module)

Create simple idiomatic NestJS module based on Express/Fastify middleware in just a few lines of code with routing out of the box

---

[nestjs-configure-after](https://github.com/iamolegga/nestjs-configure-after)

[![GitHub stars](https://img.shields.io/github/stars/iamolegga/nestjs-configure-after?style=flat-square)](https://github.com/iamolegga/nestjs-configure-after)
[![npm](https://img.shields.io/npm/dm/nestjs-configure-after?style=flat-square)](https://www.npmjs.com/package/nestjs-configure-after)

Declarative configuration of NestJS middleware order
