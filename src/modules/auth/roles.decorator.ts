import { SetMetadata } from '@nestjs/common';

import {PermissionType} from './types';
import {IS_PUBLIC_KEY, PERMISSIONS_KEY} from './constants';

/**
 * Role decorator. User only match one in list roles.
 * @param permissions
 * @constructor
 */
export const RequirePermissions = (...permissions: Array<string|PermissionType>) => SetMetadata(PERMISSIONS_KEY, permissions);

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
