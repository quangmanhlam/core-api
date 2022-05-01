export const STATUS = {
    INITIAL: 'INITIAL',
    ACTIVE: 'ACTIVE',
    BLOCKED: 'BLOCKED',
    DELETED: 'DELETED',
}

export const STATUS_LIST = [STATUS.INITIAL, STATUS.ACTIVE, STATUS.BLOCKED, STATUS.DELETED];

export const IS_ARCHIVED = {
    TRUE_VALUE: 'true',
    FALSE_VALUE: 'false',
}

export const IS_ARCHIVED_LIST = [
  IS_ARCHIVED.TRUE_VALUE,
  IS_ARCHIVED.FALSE_VALUE,
]

export const TYPES = {
    USER: 'USER',
}

export const TYPES_LIST = [TYPES.USER];

export const PERMISSIONS = {
    USER_GET_MANY: 'user.get_many',
    USER_GET_ONE: 'user.get_one',
    USER_CREATE: 'user.create',
    USER_UPDATE: 'user.update',
    USER_DELETE: 'user.delete',
    USER_ONLY_CRUD_THEIR_DATA: 'user.only_crud_their_data',
}

export const SELECT_FIELDS = {
    password: false
}

export const USER_PREFIX_CODE = {
    CODE: 'NV000000',
    CODE_LENGTH: 6,
    CODE_PREFIX_LENGTH: 2,
}

export const FILTER_FIELDS: Array<IFilterFields> = [
    {
        name: 'name',
        fieldType: 'string',
    },
    {
        name: 'roleId',
        fieldType: 'string',
    },
    {
        name: 'email',
        fieldType: 'string',
    },
    {
        name: 'phone',
        fieldType: 'string',
    },
    {
        name: 'status',
        fieldType: 'string',
    },
    {
        name: 'isArchived',
        fieldType: 'string',
    }
]

export const SORT_FIELDS: Array<string> = [
    'createdAt',
    'status',
    'isDeleted',
    'isArchived',
]
