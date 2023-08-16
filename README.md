<h1 align="center">nestjs-roles</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/nestjs-roles">
    <img alt="npm" src="https://img.shields.io/npm/v/nestjs-roles" />
  </a>
  <a href="https://www.npmjs.com/package/nestjs-roles">
    <img alt="npm" src="https://img.shields.io/npm/dm/nestjs-roles" />
  </a>
  <a href="https://github.com/iamolegga/nestjs-roles/actions">
    <img alt="GitHub branch checks state" src="https://badgen.net/github/checks/iamolegga/nestjs-roles" />
  </a>
  <a href="https://codeclimate.com/github/iamolegga/nestjs-roles/test_coverage">
    <img src="https://api.codeclimate.com/v1/badges/267a32bd68cbc25c7f7c/test_coverage" />
  </a>
  <a href="https://snyk.io/test/github/iamolegga/nestjs-roles">
    <img alt="Known Vulnerabilities" src="https://snyk.io/test/github/iamolegga/nestjs-roles/badge.svg" />
  </a>
  <a href="https://libraries.io/npm/nestjs-roles">
    <img alt="Libraries.io" src="https://img.shields.io/librariesio/release/npm/nestjs-roles" />
  </a>
  <img alt="Dependabot" src="https://badgen.net/github/dependabot/iamolegga/nestjs-roles" />
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

  if (!session) return;

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

<h2 align="center">Do you use this library?<br/>Don't be shy to give it a star! ★</h2>

<h3 align="center">Also if you are into NestJS you might be interested in one of my <a href="https://github.com/iamolegga#nestjs">other NestJS libs</a>.</h3>
