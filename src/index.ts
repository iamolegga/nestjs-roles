import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { roleReflectionToken } from './role-reflection-token';
import { RolesGuardStatic } from './roles-guard-static';

export function createRolesGuard<R>(
  getRole: (context: ExecutionContext) => R | undefined,
): RolesGuardStatic<R> {
  return class RolesGuard implements CanActivate {
    static readonly Params = (...allowedRoles: [R, ...R[]] | [boolean]) =>
      SetMetadata(roleReflectionToken, allowedRoles);

    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext) {
      const requiredRoles = this.reflector.getAllAndOverride<
        [R, ...R[]] | [boolean] | undefined
      >(roleReflectionToken, [context.getHandler(), context.getClass()]);

      // roles are not set - handler is allowed for all
      if (!requiredRoles) {
        return true;
      }

      const role = getRole(context);

      // handler is allowed only for not authorized
      if (requiredRoles[0] === false) {
        // but there is some role
        if (role) {
          throw new ForbiddenException();
        }

        return true;
      }

      // handler is allowed for any authorized
      if (requiredRoles[0] === true) {
        // but there is not any role
        if (role!) {
          throw new UnauthorizedException();
        }

        return true;
      }

      // handler is allowed for certain roles

      // there is no any role
      if (!role) {
        throw new UnauthorizedException();
      }

      // role is not one of requireds
      if (!(requiredRoles as [R, ...R[]]).includes(role)) {
        throw new ForbiddenException();
      }

      return true;
    }
  };
}
