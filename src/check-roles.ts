import { ForbiddenException, UnauthorizedException } from '@nestjs/common';

export function checkRoles<R>(
  requiredRoles: [R, ...R[]] | [boolean],
  role: R | undefined,
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

  // role is not one of requireds
  if (!(requiredRoles as [R, ...R[]]).includes(role)) {
    throw new ForbiddenException();
  }

  return true;
}
