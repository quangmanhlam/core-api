import {ResponseErrorDto} from '../dtos';
import {ErrorCodes} from '../constants';

export class BaseController {

    /**
     * Handle exceptions
     * @param ex
     */
    handleError(ex: any) {
        let response = {
            name: ex.name || null,
            type: ex.type || null,
            code: ex.code || ErrorCodes.SERVER_ERROR,
            subCode: ex.subCode || undefined,
            subTitle: ex.subTitle || null,
            message: ex.message,
            data: ex.data || null,
        };
        return new ResponseErrorDto(response);
    }

    /**
     * OK 200-OK with data in body
     * @param res
     * @param data
     */
    ok(res: any, data: any) {
        res.status(200);
        this.response(res, data);
    }

    /**
     * Accepted 202-Accepted with data in body
     * @param res
     * @param data
     */
    accepted(res: any, data: any) {
        res.status(202);
        this.response(res, data);
    }

    /**
     * RecordNotFound 404-RecordNotFound
     * @param res
     * @param error
     */
    recordNotFound(res: any, error: any) {
        res.status(404);
        this.response(res, error);
    }

    /**
     * BadRequest 400-BadRequest
     * @param res
     * @param error
     */
    badRequest(res: any, error: any) {
        res.status(400);
        this.response(res, error);
    }

    /**
     *
     * @param res
     * @param data
     */
    response(res: any, data: any) {
        res.json(data);
        // format response {users: [{id, name, photo}, {id, name, photo}]}
        // format response {code: 'INVALID_PARAM', message: 'The field name is required'}
    }
}
