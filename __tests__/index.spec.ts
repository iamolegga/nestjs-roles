import { Controller, ExecutionContext, Get, Type } from '@nestjs/common';

import { createRolesGuard } from '../src';

import { createTest } from './utils/create-test';
import { platforms } from './utils/platforms';

enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
}

const Guard = createRolesGuard<Role>(function getRole(
  context: ExecutionContext,
) {
  const { headers }: Request = context.switchToHttp().getRequest();

  const { role } = headers as unknown as { role: string };

  if (role) {
    return role.replace(/\s/g, '').split(',').length > 1
      ? (role.replace(/\s/g, '').trim().split(',') as unknown as Role[])
      : (role as Role);
  }

  return undefined;
});

for (const platform of platforms) {
  describe(platform.name, () => {
    let fn: () => void;
    let controller: Type<unknown>;

    beforeEach(() => {
      fn = jest.fn();
    });

    describe('if not set', () => {
      beforeEach(() => {
        // tslint:disable-next-line: max-classes-per-file
        @Controller('/')
        class TestController {
          @Get()
          get() {
            fn();
          }
        }
        controller = TestController;
      });

      it('should pass users with roles', async () => {
        await createTest(controller, Guard, platform, Role.ADMIN);
        expect(fn).toHaveBeenCalledTimes(1);
      });

      it('should pass users with array of roles', async () => {
        await createTest(controller, Guard, platform, [Role.ADMIN, Role.USER]);
        expect(fn).toHaveBeenCalledTimes(1);
      });

      it('should pass users without roles', async () => {
        await createTest(controller, Guard, platform);
        expect(fn).toHaveBeenCalledTimes(1);
      });
    });

    describe('if set false', () => {
      beforeEach(() => {
        // tslint:disable-next-line: max-classes-per-file
        @Controller('/')
        class TestController {
          @Get()
          @Guard.Params(false)
          get() {
            fn();
          }
        }
        controller = TestController;
      });

      it('should not pass users with roles', async () => {
        await createTest(controller, Guard, platform, Role.ADMIN);
        expect(fn).toHaveBeenCalledTimes(0);
      });

      it('should not pass users with array of roles', async () => {
        await createTest(controller, Guard, platform, [Role.ADMIN, Role.USER]);
        expect(fn).toHaveBeenCalledTimes(0);
      });

      it('should pass users without roles', async () => {
        await createTest(controller, Guard, platform);
        expect(fn).toHaveBeenCalledTimes(1);
      });
    });

    describe('if set true', () => {
      beforeEach(() => {
        // tslint:disable-next-line: max-classes-per-file
        @Controller('/')
        class TestController {
          @Get()
          @Guard.Params(true)
          get() {
            fn();
          }
        }
        controller = TestController;
      });

      it('should pass users with roles', async () => {
        await createTest(controller, Guard, platform, Role.ADMIN);
        expect(fn).toHaveBeenCalledTimes(1);
      });

      it('should pass users with array of roles', async () => {
        await createTest(controller, Guard, platform, [Role.ADMIN, Role.USER]);
        expect(fn).toHaveBeenCalledTimes(1);
      });

      it('should not pass users without roles', async () => {
        await createTest(controller, Guard, platform);
        expect(fn).toHaveBeenCalledTimes(0);
      });
    });

    describe('if set concrete role', () => {
      beforeEach(() => {
        // tslint:disable-next-line: max-classes-per-file
        @Controller('/')
        class TestController {
          @Get()
          @Guard.Params(Role.ADMIN)
          get() {
            fn();
          }
        }
        controller = TestController;
      });

      it('should pass users with allowed roles', async () => {
        await createTest(controller, Guard, platform, Role.ADMIN);
        expect(fn).toHaveBeenCalledTimes(1);
      });

      it('should pass users with allowed roles in array', async () => {
        await createTest(controller, Guard, platform, [Role.ADMIN, Role.USER]);
        expect(fn).toHaveBeenCalledTimes(1);
      });

      it('should not pass users with not allowed roles', async () => {
        await createTest(controller, Guard, platform, Role.USER);
        expect(fn).toHaveBeenCalledTimes(0);
      });

      it('should not pass users with not allowed roles in array', async () => {
        await createTest(controller, Guard, platform, [
          Role.USER,
          Role.MODERATOR,
        ]);
        expect(fn).toHaveBeenCalledTimes(0);
      });

      it('should not pass users without roles', async () => {
        await createTest(controller, Guard, platform);
        expect(fn).toHaveBeenCalledTimes(0);
      });
    });
  });
}
