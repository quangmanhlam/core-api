export interface IOptions {
  offset?: number;
  page?: number;
  limit?: number;
  sort?: any;
  select?: any;
}

export interface IBaseGetMany {
    id?: string;
    ids?: string[];
    createdBy?: string;
}

export interface IBaseGetOne {
    id?: string;
    ids?: string[];
    createdBy?: string;
    notId?: string;
}

export interface IBaseDeleteMany {
    id?: string;
    ids?: string[];
    createdBy?: string;
}

export interface IBaseUpdateMany {
    isArchived: boolean;
    updatedBy?: string;
    createdBy?: string;
}
// ---------------------------------------------------
// Action
export interface IGetManyAction extends IBaseGetMany {
  name?: string;
  key?: string;

}

export interface IGetOneAction extends IBaseGetOne {
  key?: string;
}

// user
export interface IGetOneUser extends IBaseGetOne {
    status?: string;
    phone?: string;
    email?: string;
    ignoreIsAdmin?: boolean;
}

export interface IGetManyUser extends IBaseGetMany {
    name?: string;
    phone?: string;
    email?: string;
    status?: string;
    roleId?: string;
    isArchived?: string;
}

export interface IConditionUpdateManyUser extends IBaseGetMany {}
export interface IDataUpdateManyUser extends IBaseUpdateMany {}

export interface IDeleteManyUser extends IBaseDeleteMany {
    status?: string;
    phone?: string;
    email?: string;
}

// Permission
export interface IGetOnePermission extends IBaseGetOne {
  name?: string;
  key?: string;
}

export interface IGetManyPermission extends IBaseGetMany {
  name?: string;
  key?: string;
}

export interface IConditionUpdateManyPermission extends IBaseGetMany {}

export interface IDataUpdateManyPermission extends IBaseUpdateMany {}

export interface IConditionDeleteManyPermission extends IBaseDeleteMany {}

// Role
export interface IGetOneRole extends IBaseGetOne{
    name?: string;
}

export interface IConditionUpdateManyRole extends IBaseGetMany {}

export interface IDataUpdateManyRole extends IBaseUpdateMany {}

export interface IGetManyRole extends IBaseGetMany {
    name?: string;
    isArchived?: string;
}

export interface IConditionDeleteManyRole extends IBaseDeleteMany {}

// User reset pass
export interface IGetOneUserResetPass extends IBaseGetOne {
    userId?: string;
    verifyCode?: string;
    isExpired?: boolean;
    status?: string;
}
