import { ForbiddenException, UnauthorizedException } from '@nestjs/common';

export function checkRoles<R>(
  requiredRoles: [R, ...R[]] | [boolean],
  role: R | R[] | undefined,
) {
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
    if (!role) {
      throw new UnauthorizedException();
    }

    return true;
  }

  // handler is allowed for certain roles

  // there is no any role
  if (!role) {
    throw new UnauthorizedException();
  }

  // check if role is not one of requireds

  // if role is array of roles
  // guard will pass if one of roles is in required roles
  if (Array.isArray(role)) {
    if (
      !(requiredRoles as [R, ...R[]]).some((requiredRole) =>
        (role as R[]).includes(requiredRole),
      )
    ) {
      throw new ForbiddenException();
    }
  } else {
    // if role is single role
    // guard will pass if role is in required roles
    if (!(requiredRoles as [R, ...R[]]).includes(role as R)) {
      throw new ForbiddenException();
    }
  }

  return true;
}
