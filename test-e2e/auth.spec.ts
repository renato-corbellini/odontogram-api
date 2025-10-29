import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { useContainer } from 'class-validator';
import { LoginHttpDto } from 'src/auth/dto';
import { CryptographyService } from 'src/common/cryptography/cryptography.service';
import { User } from 'src/models/users/entities/user.entity';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DbUtil } from './utils/db.util';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let dbUtil: DbUtil;
  let cryptographyService: CryptographyService;
  let jwtService: JwtService;

  const mockEmailIdentifier = 'john.doe@example.com';
  const mockUsernameIdentifier = 'johndoe';
  const mockPassword = 'Password123';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe());

    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    await app.init();

    dbUtil = new DbUtil(app);
    cryptographyService = app.get<CryptographyService>(CryptographyService);
    jwtService = app.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/login (POST)', () => {
    afterEach(async () => {
      await dbUtil.clearDb();
    });

    it.each([
      { idName: 'email', identifier: mockEmailIdentifier },
      { idName: 'username', identifier: mockUsernameIdentifier },
    ])(
      'should return 401 for non-existent user with $idName',
      async ({ identifier }) => {
        const loginDto: LoginHttpDto = {
          identifier,
          password: mockPassword,
        };

        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send(loginDto)
          .expect(401);

        expect(response.body).toMatchObject({
          statusCode: 401,
          message: 'Unauthorized',
        });
      },
    );

    it.each([
      { idName: 'email', identifier: mockEmailIdentifier },
      { idName: 'username', identifier: mockUsernameIdentifier },
    ])(
      'should return 401 for existing user ($idName) with invalid credentials',
      async ({ identifier }) => {
        const hashedPassword = cryptographyService.hash(mockPassword);
        await dbUtil.getRepository(User).save({
          email: mockEmailIdentifier,
          username: mockUsernameIdentifier,
          password: hashedPassword,
        });

        const body: LoginHttpDto = {
          identifier,
          password: 'invalidPassword123',
        };

        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send(body)
          .expect(401);

        expect(response.body).toMatchObject({
          statusCode: 401,
          message: 'Unauthorized',
        });
        expect(response.body.token).not.toBeDefined();
      },
    );

    it.each([
      { idName: 'email', identifier: mockEmailIdentifier },
      { idName: 'username', identifier: mockUsernameIdentifier },
    ])(
      'should return a token for existing user ($idName) with valid credentials',
      async ({ identifier }) => {
        const hashedPassword = cryptographyService.hash(mockPassword);
        await dbUtil.getRepository(User).save({
          email: mockEmailIdentifier,
          username: mockUsernameIdentifier,
          password: hashedPassword,
        });

        const authData: LoginHttpDto = {
          identifier,
          password: mockPassword,
        };

        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send(authData)
          .expect(200);

        expect(response.body.token).toBeDefined();
      },
    );
  });

  describe('/request-password-restore (POST)', () => {
    describe('when user does not exist', () => {
      it.each([
        { idName: 'email', identifier: mockEmailIdentifier },
        { idName: 'username', identifier: mockUsernameIdentifier },
      ])(
        'should return 401 for the provided $idName',
        async ({ identifier }) => {
          await request(app.getHttpServer())
            .post('/auth/request-password-restore')
            .send({ identifier })
            .expect(401);
        },
      );
    });

    describe('when user exists', () => {
      beforeEach(async () => {
        const hashedPassword = cryptographyService.hash(mockPassword);

        await dbUtil.getRepository(User).save({
          email: mockEmailIdentifier,
          username: mockUsernameIdentifier,
          password: hashedPassword,
        });
      });

      afterEach(async () => {
        await dbUtil.clearDb();
      });

      it.each([
        { idName: 'email', identifier: mockEmailIdentifier },
        { idName: 'username', identifier: mockUsernameIdentifier },
      ])(
        'should send restore email for the provided $idName',
        async ({ identifier }) => {
          await request(app.getHttpServer())
            .post('/auth/request-password-restore')
            .send({ identifier })
            .expect(200);

          // Todo: check that mock EmailService was called
        },
      );
    });
  });

  describe('/restore-password (POST)', () => {
    it('should return 401 when no auth token is provided', async () => {
      await request(app.getHttpServer())
        .post('/auth/restore-password')
        .send({})
        .expect(401);
    });

    it('should return 401 when an invalid auth token is provided', async () => {
      await request(app.getHttpServer())
        .post('/auth/restore-password')
        .set('Authorization', 'Bearer aninvalidtoken')
        .send({})
        .expect(401);
    });

    it('should return 401 when an expired auth token is provided', async () => {
      const token = jwtService.sign({ id: 'any-id' }, { expiresIn: '1ms' });

      // Wait for token to expire
      await new Promise((resolve) => setTimeout(resolve, 10));

      await request(app.getHttpServer())
        .post('/auth/restore-password')
        .set('Authorization', `Bearer ${token}`)
        .send({ password: '123', confirmPassword: '123' })
        .expect(401);
    });

    it('should return 401 when token contains a non-existent user ID', async () => {
      const nonExistentUserId = '123e4567-e89b-12d3-a456-426614174000';
      const token = jwtService.sign({ id: nonExistentUserId });

      await request(app.getHttpServer())
        .post('/auth/restore-password')
        .set('Authorization', `Bearer ${token}`)
        .send({ password: mockPassword, confirmPassword: mockPassword })
        .expect(401);
    });

    describe('when a valid token is provided', () => {
      let user: User;
      let token: string;

      beforeEach(async () => {
        const hashedPassword = cryptographyService.hash(mockPassword);
        user = await dbUtil.getRepository(User).save({
          email: mockEmailIdentifier,
          username: mockUsernameIdentifier,
          password: hashedPassword,
        });
        token = jwtService.sign({ id: user.id });
      });

      afterEach(async () => {
        await dbUtil.clearDb();
      });

      it('should return 400 when passwords do not match', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/restore-password')
          .set('Authorization', `Bearer ${token}`)
          .send({
            password: mockPassword,
            confirmPassword: 'invalidPassword123',
          })
          .expect(400);

        expect(response.body).toBeDefined();
        expect(response.body).toMatchObject({
          statusCode: 400,
          message: ['Passwords do not match'],
        });
      });

      it('should update the password when valid data is provided', async () => {
        const newPassword = 'newValidPassword123';
        await request(app.getHttpServer())
          .post('/auth/restore-password')
          .set('Authorization', `Bearer ${token}`)
          .send({
            password: newPassword,
            confirmPassword: newPassword,
          })
          .expect(200);

        const dbUser = await dbUtil.getRepository(User).findOne({
          where: { id: user.id },
          select: ['password'],
        });

        expect(dbUser).toBeDefined();
        expect(dbUser?.password).not.toBe(user.password);
        expect(cryptographyService.compare(newPassword, dbUser!.password)).toBe(
          true,
        );
      });
    });
  });
});
