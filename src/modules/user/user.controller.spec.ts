import { Test } from '@nestjs/testing';
import { CanActivate, Injectable } from "@nestjs/common";

import { UserController } from './user.controller';
import { UserService, RoleService } from '../../providers';
import { GetManyUserDto } from './dtos';
import { RolesGuard } from '../auth/guards/roles.guard';

const mockGuard: CanActivate = { canActivate: jest.fn(() => true) };

@Injectable()
class CacheManagerService {

}

class MockUserService {
    async paginate(filter: any, options: any) {
        return {docs: [], totalDocs: 0};
    }

    async getOne(filter: any) {
        return filter?.email === 'test1@gmail.com' ? null : filter;
    }

    async createOne(data: any) {
        return data;
    }

    async updateOne(condition: any, data: any) {
        return data;
    }
}

class MockRoleService {

    async getById(id: string) {
        return {id};
    }
}

const req = {
    status: jest.fn((statusCode: any) => {
        return statusCode;
    }),
    json: jest.fn((data: any) => {
        return data;
    }),
    user: {
        userId: '1',
    }
};

describe('User Controller', () => {
    let userController: UserController;
    let userService: MockUserService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                CacheManagerService,
            ],
            controllers: [UserController],
            providers: [UserService, CacheManagerService, RoleService],
        })
            .overrideGuard(RolesGuard)
            .useValue(mockGuard)
            .overrideProvider(UserService).useClass(MockUserService)
            .overrideProvider(RoleService).useClass(MockRoleService)
            .compile();

        userService = moduleRef.get<UserService>(UserService);
        userController = moduleRef.get<UserController>(UserController);
    });

    describe('Should be defined', () => {
        it('Controller is defined', async () => {
            expect(userController).toBeDefined();
        });
    });

    describe('Get list', () => {
        it('should return an array of users', async () => {
            const result: any[] = [
                {
                    email: 'admin@gmail.com',
                    name: 'Admin',
                },
            ];
            const mockData = {docs: result, totalDocs: 1};
            jest.spyOn(userService, 'paginate').mockResolvedValue(mockData);

            const mockJsonCallback = jest.fn((data: any) => {
                return data;
            });

            const mockStatusCallback = jest.fn((statusCode: number) => {
                return statusCode;
            });
            const res = {
                json: mockJsonCallback,
                status: mockStatusCallback
            };

            const queryDto = new GetManyUserDto();
            await userController.getMany(queryDto, res, req);
            // @ts-ignore
            // console.log({a: mockJsonCallback.mock.results[0]})

            // @ts-ignore
            expect(mockJsonCallback.mock.results[0].value.data).toBe(result);
        });
    });

    describe('Get detail', () => {
        it('should return a user', async () => {
            let result = {
                id: '1',
                email: 'admin@gmail.com',
                name: 'Admin',
            };
            jest.spyOn(userService, 'getOne').mockResolvedValue(result);

            const mockJsonCallback = jest.fn((data: any) => {
                return data;
            });

            const mockStatusCallback = jest.fn((statusCode: number) => {
                return statusCode;
            });
            const res = {
                json: mockJsonCallback,
                status: mockStatusCallback
            };

            await userController.getOne(result.id, res, req);
            // @ts-ignore
            // console.log({a: mockJsonCallback.mock.results[0]})

            // @ts-ignore
            expect(mockJsonCallback.mock.results[0].value.data).toBe(result);
        });
    });

    describe('Create', () => {
        it('should return a user', async () => {
            let data: any = {
                "email": "test1@gmail.com",
                "password": "123456",
                "name": "Manh Lam",
                "photo": '',
                "phone": "0387622932"
            };
            jest.spyOn(userService, 'createOne').mockResolvedValue(data);

            const mockJsonCallback = jest.fn((data: any) => {
                return data;
            });

            const mockStatusCallback = jest.fn((statusCode: number) => {
                return statusCode;
            });
            const res = {
                json: mockJsonCallback,
                status: mockStatusCallback
            };

            await userController.createOne(data, res, req);
            // @ts-ignore
            // console.log({create: mockJsonCallback.mock.results[0].value.data})

            // @ts-ignore
            expect(mockJsonCallback.mock.results[0].value.data).toBe(data);
        });
    });

    describe('Update', () => {
        it('should return a user', async () => {
            let data: any = {
                "id:": "1",
                "email": "test2@gmail.com",
                "password": "123456",
                "name": "Manh Lam",
                "photo": '',
                "phone": "0387622932"
            };
            jest.spyOn(userService, 'updateOne').mockResolvedValue(data);
            jest.spyOn(userService, 'getOne').mockResolvedValue(data);

            const mockJsonCallback = jest.fn((data: any) => {
                return data;
            });

            const mockStatusCallback = jest.fn((statusCode: number) => {
                return statusCode;
            });
            const res = {
                json: mockJsonCallback,
                status: mockStatusCallback
            };

            await userController.updateOne(data.id, data, res, req);
            // @ts-ignore
            // console.log({create: mockJsonCallback.mock.results[0].value.data})

            // @ts-ignore
            expect(mockJsonCallback.mock.results[0].value.data).toBe(data);
        });
    });
});
