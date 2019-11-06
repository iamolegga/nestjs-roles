import { CanActivate, SetMetadata, Type } from '@nestjs/common';

export interface RolesGuardStatic<R> extends Type<CanActivate> {
  /**
   * Decorator for controller or handler to specify allowed roles.
   * For certain roles pass it to decorator.
   * Pass `false` to make controller or handler be allowed only for
   * unauthorized users.
   * Pass `true` to make controller or handler be allowed only for
   * authorized users (with any role).
   * Do not use it to make controller or handler bew allowed for all.
   */
  Params(
    ...allowedRoles: [R, ...R[]] | [boolean]
  ): ReturnType<typeof SetMetadata>;
}
