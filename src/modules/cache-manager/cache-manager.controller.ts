import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {Controller, Post, Req, Res, UseGuards} from "@nestjs/common";

import {CacheManagerService} from "./cache-manager.service";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {ResponseSuccessDto} from "../../dtos";
import {PermissionDenied} from "../../exceptions";
import {BaseController} from "../base.controller";

@ApiTags('Cache Manager')
@ApiResponse({status: 200, description: 'Successful.'})
@ApiResponse({status: 400, description: 'Invalid request input.'})
@ApiResponse({status: 401, description: 'Unauthorized.'})
@ApiResponse({status: 403, description: 'Forbidden.'})
@ApiResponse({status: 404, description: 'Resource not found.'})

@Controller('cache-managers')
export class CacheManagerController extends BaseController {
    constructor(
        private cacheManagerService: CacheManagerService,
    ) {
        super();
    }

    @Post('/clear-all')
    @UseGuards(JwtAuthGuard)
    @ApiResponse({status: 200, description: 'Successful.'})
    async clearAll(@Res() res, @Req() req: any): Promise<any> {
        let response = null;
        try {
            // only using by admin.
            const {isRootAdmin} = req.user;
            if (!isRootAdmin) throw new PermissionDenied('Permission denied!');

            // clear all cache data.
            await this.cacheManagerService.clearAll();

            response = new ResponseSuccessDto({
                total: 1,
                data: {success: true},
            });
            this.ok(res, response);
        } catch (ex) {
            response = this.handleError(ex);
            this.badRequest(res, response);

            throw ex;
        }
    }
}
