const MongooseAutoIncrement = require('mongoose-auto-increment');

import {
  ACTION_MODEL,
  ALL_MODELS,
  MIGRATION_MODEL,
  PERMISSION_MODEL,
  ROLE_MODEL,
  SETTING_MODEL,
  USER_MODEL,
  USER_RESET_PASS_MODEL
} from '../constants';

import {ActionSchema} from './action.schema';
import {PermissionSchema} from './permission.schema';
import {RoleSchema} from './role.schema';
import {UserSchema} from './user.schema';
import {SettingSchema} from './setting.schema';
import {MigrationSchema} from './migration.schema';
import {UserResetPassSchema} from './user-reset-pass.schema';

const list: any = [
  {name: ACTION_MODEL, model: ActionSchema},
    {name: PERMISSION_MODEL, model: PermissionSchema},
    {name: ROLE_MODEL, model: RoleSchema},
    {name: USER_MODEL, model: UserSchema},
    {name: SETTING_MODEL, model: SettingSchema},
    {name: MIGRATION_MODEL, model: MigrationSchema},
    {name: USER_RESET_PASS_MODEL, model: UserResetPassSchema},
];

const getSchemasByNames = (names: any[] = ALL_MODELS) => {
  let schemas: any = [];

  for (let i = 0; i < list.length; i++) {
    if (names.some(value => value === list[i].name)) {
      schemas.push({
        name: list[i].name,
        useFactory: () => {
          const schema = list[i].model;
          // @ts-ignore
          schema.plugin(require('mongoose-paginate-v2'));

          return schema;
        },
      });
    }
  }

  return schemas;
};

export {
  getSchemasByNames,
};

export default {
  getSchemasByNames,
};
