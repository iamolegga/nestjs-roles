import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  SetMetadata,
  Type,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

const roleReflectionToken = 'nestjs-roles';

type RoleParams<T> = [T, ...T[]] | [boolean];

export interface RolesGuardStatic<R> {
  Params(...allowedRoles: RoleParams<R>): ReturnType<typeof SetMetadata>;
}

export function createRolesGuard<R>(
  getRole: (context: ExecutionContext) => R | undefined,
): Type<CanActivate> & RolesGuardStatic<R> {
  return class RolesGuard implements CanActivate {
    /**
     * Decorator for controller or handler to specify allowed roles.
     * For certain roles pass it to decorator.
     * Pass `false` to make controller or handler be allowed only for
     * unauthorized users.
     * Pass `true` to make controller or handler be allowed only for
     * authorized users (with any role).
     * Do not use it to make controller or handler bew allowed for all.
     */
    static readonly Params = (...allowedRoles: RoleParams<R>) =>
      SetMetadata(roleReflectionToken, allowedRoles);

    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext) {
      const requiredRoles = this.reflector.getAllAndOverride<
        RoleParams<R> | undefined
      >(roleReflectionToken, [context.getHandler(), context.getClass()]);

      // roles are not set - handler is allowed for all
      if (!requiredRoles || !requiredRoles.length) {
        return true;
      }

      const role = getRole(context);

      // handler is allowed only for not authorized
      if (requiredRoles[0] === false) {
        // but there is some role
        if (role) {
          throw new ForbiddenException();
        }

        // handler is allowed for any authorized
      } else if (requiredRoles[0] === true) {
        // but there is not any role
        if (role!) {
          throw new UnauthorizedException();
        }
        // handler is allowed for certain roles
      } else {
        // there is no any role
        if (!role) {
          throw new UnauthorizedException();
        }

        // role is not one of requireds
        if (
          !(requiredRoles as Exclude<RoleParams<R>, [boolean]>).includes(role)
        ) {
          throw new ForbiddenException();
        }
      }

      return true;
    }
  };
}
