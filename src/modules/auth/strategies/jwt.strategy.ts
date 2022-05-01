import {Injectable} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';

import {configs} from '../../../configs';

/**
 * Version one compatibility.
 * @param options
 */
const versionOneCompatibility = (options: any) => {
    let authScheme = options.authScheme || 'JWT',
        bodyField = options.tokenBodyField || 'auth_token',
        queryParam = options.tokenQueryParameterName || 'auth_token';

    return function (request) {
        let authHeaderExtractor = ExtractJwt.fromAuthHeaderWithScheme(authScheme);
        let token =  authHeaderExtractor(request);

        if (!token) {
            let headerExtractor = ExtractJwt.fromAuthHeaderAsBearerToken();
            token = headerExtractor(request);
        }

        if (!token) {
            let bodyExtractor = ExtractJwt.fromBodyField(bodyField);
            token = bodyExtractor(request);
        }

        if (!token) {
            let queryExtractor = ExtractJwt.fromUrlQueryParameter(queryParam);
            token = queryExtractor(request);
        }

        return token;
    };
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() || ExtractJwt.fromUrlQueryParameter('jwt'),
            jwtFromRequest: versionOneCompatibility({
                tokenQueryParameterName: 'jwt'
            }),
            ignoreExpiration: false,
            secretOrKey: configs.jwt?.secret || 'secretKey',
        });
    }

    async validate(payload: any) {
        // console.log('validate JwtStrategy', payload);
        return payload;
    }
}
