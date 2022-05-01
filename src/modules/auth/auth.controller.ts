const bcrypt = require("bcryptjs");
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Post, Res } from "@nestjs/common";

import { BaseController } from "../base.controller";
import { MailService } from "../mail";
import { FORGOT_PASSWORD_TITLE, LINK_PORTAL_RESET_PASSWORD } from "../../constants";
import { UserService, SettingService, UserResetPassService } from "../../providers";
import { ResponseErrorDto, ResponseSuccessDto } from "../../dtos";
import { randomNumberByLength } from "../../utils";
import { STATUS } from "../user";
import { AuthWrongPassword, UserNotFound, AuthCanNotHaveLinkReset, AuthVerifyCodeExpired, AuthEmailExists } from "../../exceptions";

import { AuthService } from "./auth.service";
import { USER_RESET_PASS_STATUS } from "./constants";
import { LoginDto, ResponseLoginDto, ForgotPasswordDto, ResponseForgotPasswordDto, ResetPasswordDto, ResponseResetPasswordDto, RegisterDto, ResponseRegisterDto } from "./dtos";

@ApiTags("Auth")
@ApiResponse({ status: 200, description: "Successful.", type: ResponseSuccessDto })
@ApiResponse({ status: 400, description: "Invalid request input.", type: ResponseErrorDto })
@ApiResponse({ status: 401, description: "Unauthorized." })
@ApiResponse({ status: 403, description: "Forbidden." })
@ApiResponse({ status: 404, description: "Resource not found." })

@Controller("auth")
export class AuthController extends BaseController {
    constructor(
        private authService: AuthService,
        private userService: UserService,
        private mailService: MailService,
        private settingService: SettingService,
        private userResetPassService: UserResetPassService,
    ) {
        super();
    }

    /**
     * User login.
     * @param body
     * @param res
     */
    @ApiOperation({summary: 'Login by user'})
    @ApiResponse({status: 200, description: 'Successful.', type: ResponseLoginDto})
    @Post('/login')
    async login(@Body() body: LoginDto, @Res() res) {
        let response = null;
        try {
            // validate login
            const user = await this.validateLogin(body);

            // generate token
            const payload = {
                userId: user._id.toString(),
                roleId: user.roleId,
                phone: user.phone,
                email: user.email,
                isRootAdmin: user.isRootAdmin || false,
            };
            const data = {accessToken: this.authService.sign(payload)};

            // response to client
            response = new ResponseLoginDto({
                total: data ? 1 : 0,
                data: data,
            });
            this.ok(res, response);
        } catch (ex) {
            console.log(ex);
            response = this.handleError(ex);
            this.badRequest(res, response);

            throw ex;
        }
    }

    async validateLogin(body: LoginDto) {
        const {password, email} = body;

        // check user by phone
        const user = await this.userService.getByEmail(email);
        if (!user) throw new UserNotFound('User not found');

        // check password
        const isValidPassword = bcrypt.compareSync(password, user.password);
        if (!isValidPassword) throw new AuthWrongPassword('Wrong password');

        return user;
    }

    @Post('/register')
    @ApiOperation({summary: 'Register'})
    @ApiResponse({status: 200, type: ResponseRegisterDto})
    async register(@Body() body: RegisterDto, @Res() res: any) {
        let response = null;
        try {
            // validate login
            await this.validateRegister(body);

            // build data
            const data = {
                ...body,
                status: STATUS.INITIAL,
            };

            // create user
            await this.userService.createOne(data);

            // response to client
            response = new ResponseRegisterDto({
                data: {
                    success: true
                },
            });
            this.ok(res, response);
        } catch (ex) {
            console.log(ex);
            response = this.handleError(ex);
            this.badRequest(res, response);

            throw ex;
        }
    }

    async validateRegister(data: RegisterDto) {
        const {email} = data;

        // check email is exists
        const userWithEmail = await this.userService.getByEmail(email);
        if (userWithEmail) throw new AuthEmailExists();
    }

    @Post('/forgot-password')
    @ApiOperation({summary: 'Forgot password'})
    @ApiResponse({status: 200, type: ResponseForgotPasswordDto})
    async forgotPassword(@Body() body: ForgotPasswordDto, @Res() res) {
        let response = null;
        try {
            const {email} = body;

            // validate
            const {user} = await this.validateForgotPassword(body);

            // check user have required to reset password
            const filter = {
                userId: user._id.toString(),
                status: USER_RESET_PASS_STATUS.PROCESSING,
                isExpired: false,
            }
            let resetPass = await this.userResetPassService.getOne(filter);

            // create request reset pass
            if (!resetPass) {
                // get setting expired time
                const expiredHour = 24;

                // calculate expire time
                const expiredAt = new Date().getTime() + 3600 * 1000 * expiredHour;

                // create require reset password for customer
                let data: any = {
                    userId: user._id.toString(),
                    verifyCode: String(randomNumberByLength(6)),
                    expiredAt: new Date(expiredAt).toISOString(),
                    status: USER_RESET_PASS_STATUS.PROCESSING,
                };
                resetPass = await this.userResetPassService.createOne(data);
            }

            // get link portal reset password
            const link = await this.settingService.getByKey(LINK_PORTAL_RESET_PASSWORD);
            if (!link) throw new AuthCanNotHaveLinkReset();

            let url = `${link.value}?verifyCode=${resetPass.verifyCode}`;

            let html = '<div>\n' +
              '  <p>Hi,</p>\n' +
              '  <br/>\n' +
              '  <p>Vui lòng click vào link này để lấy lại mật khẩu <a href="{link}">Lấy lại mật khẩu</a></p>\n' +
              '  <p>Nếu bạn không yêu cầu email này, bạn có thể bỏ qua nó một cách an toàn.</p>\n' +
              '\n' +
              '  <br/>\n' +
              '  <p>Thanks</p>\n' +
              '</div>';

            html = html.replace('{link}', url);
            const mailData = {
                email,
                title: FORGOT_PASSWORD_TITLE,
                subject: FORGOT_PASSWORD_TITLE,
                type: 'HTML',
                html: html,
            };
            const result = await this.mailService.sendMail(mailData);

            // response to client
            response = new ResponseForgotPasswordDto({
                total: 1,
                data: {
                    success: true
                },
            });
            this.ok(res, response);
        } catch (ex) {
            console.log(ex);
            response = this.handleError(ex);
            this.badRequest(res, response);

            throw ex;
        }
    }

    async validateForgotPassword(data: ForgotPasswordDto) {
        const user = await this.userService.getByEmail(data.email);
        if (!user) throw new UserNotFound('Account with email not found');

        return {user};
    }

    @Post('/reset-password')
    @ApiOperation({summary: 'Reset password'})
    @ApiResponse({status: 200, type: ResponseResetPasswordDto})
    async resetPassword(@Body() body: ResetPasswordDto, @Res() res) {
        let response = null;
        try {
            const {password} = body;

            // validate
            const {resetPass} = await this.validateResetPassword(body);

            // update password
            const data = {
                password: bcrypt.hashSync(password, 10)
            };
            await this.userService.updateOne({id: resetPass.userId}, data);

            // update
            const filter = {id: resetPass._id};
            const resetPassData = {status: USER_RESET_PASS_STATUS.SUCCESS};
            await this.userResetPassService.updateOne(filter, resetPassData);

            // response to client
            response = new ResponseResetPasswordDto({
                total: 1,
                data: {
                    success: true
                },
            });
            this.ok(res, response);
        } catch (ex) {
            console.log(ex);
            response = this.handleError(ex);
            this.badRequest(res, response);

            throw ex;
        }
    }

    async validateResetPassword(data: ResetPasswordDto) {
        const {verifyCode} = data;

        const filter = {verifyCode, isExpired: false, status: USER_RESET_PASS_STATUS.PROCESSING};
        const resetPass = await this.userResetPassService.getOne(filter);
        if (!resetPass) throw new AuthVerifyCodeExpired();

        return {resetPass};
    }
}
