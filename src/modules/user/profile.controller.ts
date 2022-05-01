const bcrypt = require("bcryptjs");
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Controller, Get, Req, Res, UseGuards, Post, Body } from "@nestjs/common";

import { ResponseGetProfileDto, UpdateProfileDto } from "./dtos";

import { JwtAuthGuard } from "../auth";
import { BaseController } from "../base.controller";
import { ResponseErrorDto, ResponseSuccessDto } from "../../dtos";
import { UserNotFound } from "../../exceptions";
import { RoleService, UserService, PermissionService, ActionService } from "../../providers";

// documents Api tag
@ApiTags("Profile")
@ApiResponse({ status: 200, description: "Successful.", type: ResponseSuccessDto })
@ApiResponse({ status: 400, description: "Invalid request input.", type: ResponseErrorDto })
@ApiResponse({ status: 401, description: "Unauthorized." })
@ApiResponse({ status: 403, description: "Forbidden." })
@ApiResponse({ status: 404, description: "Resource not found." })

@Controller("profile")
export class ProfileController extends BaseController {
    constructor(
      private userService: UserService,
      private roleService: RoleService,
      private actionService: ActionService,
      private permissionService: PermissionService,
    ) {
        super();
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: "Get profile" })
    @ApiResponse({ status: 200, description: "Successful.", type: ResponseGetProfileDto })
    async getProfile(@Res() res: any, @Req() req: any): Promise<any> {
        let response = null;
        try {
            // get input from token
            const { userId, roleId } = req.user;

            // get user
            const user = await this.userService.getById(userId);
            if (!user) throw new UserNotFound("User not found");

            // get permission by roleId
            const permissions = await this.getRoleById(roleId);
            const { password, ...otherData } = user;
            const data = {
                ...otherData,
                permissions: permissions || []
            };

            response = new ResponseGetProfileDto({
                total: data ? 1 : 0,
                data: data
            });
            this.ok(res, response);
        } catch (e) {
            console.log(e);
            response = this.handleError(e);
            this.badRequest(res, response);

            throw e;
        }
    }

    async getRoleById(roleId: string) {
        let listPermission: any = [];

        // get role
        const role = await this.roleService.getOne({ id: roleId });
        if (!role) return listPermission;

        // get user permissions
        let permissionIds = [];
        let actionsIds: any = [];
        for (let i = 0; i < role.permissions.length; i++) {
            const { id, actionIds } = role.permissions[i];
            permissionIds.push(id);
            actionsIds = actionsIds.concat(actionIds);
        }

        // get permissions
        let filterPermission: any = { ids: permissionIds };
        if (role.isRootAdmin) filterPermission = {};
        const permissions = await this.permissionService.find(filterPermission);

        // get user actions
        let filterAction: any = { ids: actionsIds };
        if (role.isRootAdmin) filterAction = {};
        const ACTION_FIELDS = { name: 1, url: 1, key: 1, method: 1 };
        const actions = await this.actionService.find(filterAction, ACTION_FIELDS);

        // map data into role.
        for (let i = 0; i < permissions.length; i++) {
            const { _id, key, name, actionIds } = permissions[i];
            // filter actions of permission
            let listAction = [];
            for (let j = 0; j < actionIds.length; j++) {
                const action = actions.find(item => actionIds[j] === item._id.toString());
                listAction.push(action);
            }
            listPermission.push({
                _id,
                name,
                key,
                actions: listAction
            });
        }

        return listPermission;
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: "Update profile" })
    @ApiResponse({ status: 200, description: "Successful.", type: '' })
    async updateProfile(
      @Body() data: UpdateProfileDto,
      @Res() res: any,
      @Req() req: any
    ) {
        let response = null;
        try {
            const {userId, isRootAdmin} = req.user;

            // update
            if (data.password) data.password = bcrypt.hashSync(data.password, 10);
            await this.userService.updateOne({id: userId, ignoreIsAdmin: isRootAdmin}, data);
            const result = await this.userService.getOne({id: userId});

            // response
            response = new ResponseGetProfileDto({
                total: result ? 1 : 0,
                data: result
            });
            this.ok(res, response);
        } catch (e) {
            console.log(e);
            response = this.handleError(e);
            this.badRequest(res, response);

            throw e;
        }
    }
}
