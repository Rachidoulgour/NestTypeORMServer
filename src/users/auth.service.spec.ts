import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { ASYNC_METHOD_SUFFIX } from '@nestjs/common/module-utils/constants';

describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>

    beforeEach(async() => {
        fakeUsersService = {
            find: () => Promise.resolve([]),
            create: (email: string, password: string) => Promise.resolve({ íd: 1, email, password } as unknown as User)
        }

        const module = await Test.createTestingModule({
            providers : [
                AuthService,
            {
                provide: UsersService,
                useValue: fakeUsersService
            }]
        }).compile();
        service = module.get(AuthService);
    })

    it('can create an instance of auth service', async () => {
        expect(service).toBeDefined();
    })

    it('creates a new user with a salted and hashed password', async () => {
        const user = await service.signup('asdf@asdf.com', 'asdf')

        expect(user.password).not.toEqual('asdf');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    })

    it('throws an error if user signs up with email that is in use', async () => {
        fakeUsersService.find = () =>
     
          Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
        await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
          BadRequestException,
        );
    });

    it('throws if signin is called with an unused email', async () => {
        await expect(
          service.signin('asdflkj@asdlfkj.com', 'passdflkj'),
        ).rejects.toThrow(NotFoundException);
    });

    it('throws if an invalid password is provided', async () => {
        fakeUsersService.find = () =>
          Promise.resolve([
            { email: 'asdf@asdf.com', password: 'laskdjf' } as User,
          ]);
        await expect(
          service.signin('laskdjf@alskdfj.com', 'passowrd'),
        ).rejects.toThrow(BadRequestException);
    });

    it('throws if a valid password is provided', async () => {
        fakeUsersService.find = () =>
          Promise.resolve([
            { email: 'asdf@asdf.com', password: 'laskdjf' } as User,
        ]);
        
        const user = await service.signin('asdf@asdf.com', 'asdf');
        expect(user).toBeDefined();
    });
});