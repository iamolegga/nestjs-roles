import { CanActivate, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { checkRoles } from './check-roles';
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

      return checkRoles(requiredRoles, role);
    }
  };
}
