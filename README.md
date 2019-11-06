<h1 align="center">nestjs-roles</h1>


<p align="center">
  <a href="https://www.npmjs.com/package/nestjs-roles">
    <img alt="npm" src="https://img.shields.io/npm/v/nestjs-roles" />
  </a>
  <a href="https://travis-ci.org/iamolegga/nestjs-roles">
    <img alt="Travis (.org)" src="https://img.shields.io/travis/iamolegga/nestjs-roles" />
  </a>
  <a href="https://coveralls.io/github/iamolegga/nestjs-roles?branch=master">
    <img alt="Coverage Status" src="https://coveralls.io/repos/github/iamolegga/nestjs-roles/badge.svg?branch=master" />
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

Type safe roles guard and decorator made easy. Just specify how you store `role` on `context`.

`nestjs-roles` will do the rest.

## Install

```sh
npm i nestjs-roles
```

or

```sh
yarn add nestjs-roles
```

## Example

First let's define roles:

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
  return (session as { role?: Role }).role;
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
