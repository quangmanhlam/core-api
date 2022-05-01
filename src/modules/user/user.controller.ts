const bcrypt = require("bcryptjs");
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, Res, UseGuards} from "@nestjs/common";

import {BaseController} from "../base.controller";
import {RoleService, UserService} from "../../providers";
import {JwtAuthGuard, RequirePermissions, RolesGuard} from "../auth";
import {ResponseDeleteSuccessDto, ResponseErrorDto, ResponseSuccessDto} from "../../dtos";
import {
    RoleNotFound,
    UserCanNotDeleteYourself,
    UserCanNotEditYourself,
    UserExists,
    UserInvalid,
    UserNotFound
} from "../../exceptions";

import {PERMISSIONS, SELECT_FIELDS} from "./constants";
import {
    CreateUserDto,
    DeleteManyUserDto,
    GetManyUserDto,
    ResponseGetManyUserDto,
    ResponseGetOneUserDto,
    UpdateManyUserDto,
    UpdateUserDto
} from "./dtos";

// documents Api tag
@ApiTags("User")
@ApiResponse({status: 200, description: "Successful.", type: ResponseSuccessDto})
@ApiResponse({status: 400, description: "Invalid request input.", type: ResponseErrorDto})
@ApiResponse({status: 401, description: "Unauthorized."})
@ApiResponse({status: 403, description: "Forbidden."})
@ApiResponse({status: 404, description: "Resource not found."})

@Controller("users")
export class UserController extends BaseController {
    constructor(
        private userService: UserService,
        private roleService: RoleService,
    ) {
        super();
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @RequirePermissions(PERMISSIONS.USER_GET_MANY)
    @ApiOperation({summary: "Get list"})
    @ApiResponse({status: 200, description: "Successful.", type: ResponseGetManyUserDto})
    async getMany(@Query() filterData: GetManyUserDto, @Res() res: any, @Req() req: any): Promise<any> {
        let response = null;
        try {
            let filter: any = filterData.getFilter();
            const options = filterData.getOptions();
            options.select = SELECT_FIELDS;

            // get list user
            const data = await this.userService.paginate(filter, options);

            // response
            response = new ResponseSuccessDto({
                total: data.totalDocs,
                data: data.docs
            });
            this.ok(res, response);
        } catch (ex) {
            console.log('message: ', ex.message);
            console.log(ex);
            response = this.handleError(ex);
            this.badRequest(res, response);

            throw ex;
        }
    }

    @Get("/:id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @RequirePermissions(PERMISSIONS.USER_GET_ONE)
    @ApiResponse({status: 200, description: "Successful.", type: ResponseGetOneUserDto})
    async getOne(@Param("id") id: string, @Res() res: any, @Req() req: any): Promise<any> {
        let response = null;
        try {
            let filter: any = {id};

            // get user
            const data = await this.userService.getOne(filter, SELECT_FIELDS);

            // response
            response = new ResponseSuccessDto({
                total: data ? 1 : 0,
                data: data
            });
            this.ok(res, response);
        } catch (ex) {
            response = this.handleError(ex);
            this.badRequest(res, response);

            throw ex;
        }
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @RequirePermissions(PERMISSIONS.USER_CREATE)
    @ApiResponse({status: 200, description: "Successful.", type: ResponseGetOneUserDto})
    async createOne(@Body() data: CreateUserDto, @Res() res: any, @Req() req: any): Promise<any> {
        let response = null;
        try {
            // get user id
            const {userId} = req.user;
            await this.validateCreate(data, req.user);

            // build user data
            const userData = this.buildCreateUser(data, req.user);

            // create user
            const user = await this.userService.createOne(userData, userId);

            response = new ResponseSuccessDto({
                total: 1,
                data: user
            });
            this.ok(res, response);
        } catch (ex) {
            response = this.handleError(ex);
            this.badRequest(res, response);

            throw ex;
        }
    }

    buildCreateUser(data: CreateUserDto, user: RequestUserData) {
        const {userId} = user;
        let userData: any = {
            ...data,
            password: data.password ? bcrypt.hashSync(data.password, 10) : null
        };

        return userData;
    }

    async validateCreate(data: CreateUserDto, user: RequestUserData) {
        const {roleId, email} = data;

        // check role
        const role = await this.roleService.getById(roleId);
        if (!role) throw new RoleNotFound("Role not found");

        // check user with email exists
        const userInfo = await this.userService.getOne({email});
        if (userInfo) throw new UserExists('User exists');
    }

    @Put("/:id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @RequirePermissions(PERMISSIONS.USER_UPDATE)
    @ApiResponse({status: 200, description: "Successful.", type: ResponseGetOneUserDto})
    async updateOne(
        @Param("id") id: string,
        @Body() data: UpdateUserDto,
        @Res() res: any,
        @Req() req: any
    ): Promise<any> {
        let response = null;
        try {
            let filter: any = {id};

            // get user id
            const {userId} = req.user;
            await this.validateUpdate(data, req.user, id);

            // hash password
            if (data.password && data.password.length > 0) {
                data.password = bcrypt.hashSync(data.password, 10);
            } else {
                delete data.password;
            }

            // update one
            await this.userService.updateOne(filter, data, userId);

            const result = await this.userService.getOne(filter);
            response = new ResponseSuccessDto({
                total: 1,
                data: result
            });
            this.ok(res, response);
        } catch (ex) {
            response = this.handleError(ex);
            this.badRequest(res, response);

            throw ex;
        }
    }

    async validateUpdate(data: UpdateUserDto, requestUser: RequestUserData, id: string) {
        const {userId} = requestUser;

        const filter = {id};
        const user = await this.userService.getOne(filter);
        if (!user) throw new UserNotFound("Can not edit user");

        // invalid if user is admin
        if (user.isRootAdmin) throw new UserInvalid("Can not edit admin user");

        // check user can not edit yourself
        if (userId === id) throw new UserCanNotEditYourself("Can not edit yourself!");

        // check role
        const role = await this.roleService.getById(data.roleId);
        if (!role) throw new RoleNotFound('Role not found');
    }

    @Patch()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @RequirePermissions(PERMISSIONS.USER_UPDATE)
    @ApiResponse({status: 200, description: "Successful.", type: ResponseGetOneUserDto})
    async updateMany(
        @Body() data: UpdateManyUserDto,
        @Res() res: any,
        @Req() req: any
    ): Promise<any> {
        let response = null;
        try {
            const {userId} = req.user;

            // validate
            const {ids} = this.validateUpdateMany(data, userId);

            // update many
            let filter: any = {ids};
            const update = {isArchived: data.isArchived, updatedBy: userId};
            const result = await this.userService.updateMany(filter, update);

            response = new ResponseSuccessDto({
                total: 1,
                data: result,
            });
            this.ok(res, response);
        } catch (ex) {
            response = this.handleError(ex);
            this.badRequest(res, response);

            throw ex;
        }
    }

    validateUpdateMany(data: UpdateManyUserDto, userId: string) {
        const ids = data.getIds();

        // can not delete yourself
        if (ids.some(value => value === userId)) {
            throw new UserCanNotEditYourself("Can not edit yourself!");
        }

        return {ids};
    }

    @Delete("/:id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @RequirePermissions(PERMISSIONS.USER_DELETE)
    @ApiResponse({status: 200, description: "Successful.", type: ResponseDeleteSuccessDto})
    async deleteOne(@Param("id") id: string, @Res() res: any, @Req() req: any): Promise<any> {
        let response = null;
        try {
            // get user id
            const {userId} = req.user;
            if (userId === id) throw new UserCanNotDeleteYourself("Can not delete yourself!");

            let filter: any = {id};

            // delete user
            const result = await this.userService.deleteOne(filter, userId);

            // response to client
            response = new ResponseSuccessDto({
                // @ts-ignore
                total: result.nModified || result.modifiedCount || 0,
                data: {
                    // @ts-ignore
                    deletedCount: result.nModified || result.modifiedCount || 0
                }
            });
            this.ok(res, response);
        } catch (ex) {
            response = this.handleError(ex);
            this.badRequest(res, response);

            throw ex;
        }
    }

    @Delete()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @RequirePermissions(PERMISSIONS.USER_DELETE)
    @ApiResponse({status: 200, description: "Successful.", type: ResponseDeleteSuccessDto})
    async deleteMany(@Body() data: DeleteManyUserDto, @Res() res: any, @Req() req: any): Promise<any> {
        let response = null;
        try {
            // validate
            const {userId} = req.user;
            const {ids} = this.validateDeleteMany(data, userId);

            let filter: any = {ids};

            // delete many
            const result = await this.userService.deleteMany(filter, userId);
            response = new ResponseSuccessDto({
                // @ts-ignore
                total: result.nModified || result.modifiedCount || 0,
                data: {
                    // @ts-ignore
                    deletedCount: result.nModified || result.modifiedCount || 0
                }
            });
            this.ok(res, response);
        } catch (ex) {
            response = this.handleError(ex);
            this.badRequest(res, response);

            throw ex;
        }
    }

    validateDeleteMany(data: DeleteManyUserDto, userId: string) {
        const ids = data.getIds();

        // can not delete yourself
        if (ids.some(value => value === userId)) {
            throw new UserCanNotDeleteYourself("Can not delete yourself!");
        }

        return {ids};
    }
}
