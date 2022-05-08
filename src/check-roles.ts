import { ForbiddenException, UnauthorizedException } from '@nestjs/common';

export function checkRoles<R>(
  requiredRoles: [R, ...R[]] | [boolean],
  role: R | R[] | string | undefined,
) {
  let parsedRole = role;

  // parse role to array if role is array in comma seperated string (like in header)
  if (typeof role === 'string') {
    parsedRole =
      role.replace(/\s/g, '').split(',').length > 1
        ? (role.replace(/\s/g, '').trim().split(',') as any as R[])
        : (role as R);
  }

  // handler is allowed only for not authorized
  if (requiredRoles[0] === false) {
    // but there is some role
    if (parsedRole) {
      throw new ForbiddenException();
    }

    return true;
  }

  // handler is allowed for any authorized
  if (requiredRoles[0] === true) {
    // but there is not any role
    if (!parsedRole) {
      throw new UnauthorizedException();
    }

    return true;
  }

  // handler is allowed for certain roles

  // there is no any role
  if (!parsedRole) {
    throw new UnauthorizedException();
  }

  // check if role is not one of requireds

  // if role is array of roles
  if (Array.isArray(parsedRole)) {
    if (
      !(requiredRoles as [R, ...R[]]).some((requiredRole) =>
        (parsedRole as R[]).includes(requiredRole),
      )
    ) {
      throw new ForbiddenException();
    }

    // if role is single role
  } else {
    if (!(requiredRoles as [R, ...R[]]).includes(parsedRole as R)) {
      throw new ForbiddenException();
    }
  }

  return true;
}
