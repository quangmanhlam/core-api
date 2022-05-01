import {ApiProperty} from "@nestjs/swagger";
import {IsOptional, IsString } from "class-validator";

export class ValidateDto {
    @ApiProperty({
        required: false,
        default: []
    })
    @IsOptional()
    public filterFields: Array<IFilterFields>;

    @ApiProperty({
        required: false,
        default: []
    })
    @IsOptional()
    public sortFields: Array<string>;

    constructor(fields: Array<IFilterFields> = [], sorts: Array<string> = []) {
        this.filterFields = fields;
        this.sortFields = sorts;
    }

    getFilter() {
        let values: any = {};
        for (let i = 0; i < this.filterFields?.length; i++) {
            const field = this.filterFields[i];

            // check field not undefined
            if (this[field.name] === undefined) continue;

            switch (field.fieldType) {
                case 'number': {
                    values[field.name] = Number(this[field.name]);
                    break;
                }
                case 'boolean': {
                    values[field.name] = this[field.name] === 'true';
                    break;
                }
                case 'string':
                default: {
                    values[field.name] = String(this[field.name]);
                    break;
                }
            }
        }

        // get ids
        const ids = this.getIds();
        if (ids && ids.length > 0) values.ids = ids;

        return values;
    }

    getFilterFields() {
        return this.filterFields;
    }

    setFilterFields(fields: Array<IFilterFields> = []) {
        this.filterFields = fields;
    }

    getSortFields() {
        return this.sortFields;
    }

    setSortFields(sorts: Array<string> = []) {
        this.sortFields = sorts;
    }

    @ApiProperty({
        description: 'Paginate: offset param. Example: /users?offset=10',
        required: false,
        default: 0
    })
    @IsOptional()
    @IsString()
    offset: string = '0';

    @ApiProperty({
        description: 'Paginate: limit param. Example: /users?limit=10',
        required: false,
        default: 10
    })
    @IsOptional()
    @IsString()
    limit: string = '10';

    @ApiProperty({
        description: 'Search by ids. Example: /users?ids=1,2,4,5. Example in body: {ids: [1,2,3]}',
        required: false,
    })
    @IsOptional()
    ids: any;

    @ApiProperty({
        description: 'Example: /users?sort=name_desc,createdAt_asc . default sort by createdAt desc',
        required: false,
    })
    @IsOptional()
    @IsString()
    sort: any = 'createdAt_desc';

    getIds() {
        let ids: any = [];
        if (typeof this.ids === 'string') ids = this.ids.split(',');
        if (Array.isArray(this.ids)) ids = this.ids;
        return ids;
    }

    getOffset() {
        return Number(this.offset || 10);
    }

    getLimit() {
        return Number(this.limit || 10);
    }

    getSort() {
        let sort: any = {_id: -1};

        if (this.sort && this.sortFields?.length > 0) {
            const fields = this.sort.split(',');
            if (fields.length > 0) sort = {};

            for (let i = 0; i < fields.length; i++) {
                const arrTem = fields[i].split('_');

                // check field in list can sort
                if (!this.sortFields.some(value => value === arrTem[0])) continue;

                if (arrTem[1] === 'desc' || arrTem[1] === 'asc') {
                    sort[arrTem[0]] = arrTem[1] === 'desc' ? -1 : 1;
                }
            }
        }

        return sort;
    }

    getOptions() {
        return {
            offset: this.getOffset(),
            limit: this.getLimit(),
            sort: this.getSort(),
            select: null,
        }
    }
}
