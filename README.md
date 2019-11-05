# nestjs-roles

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
