import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { useContainer } from 'class-validator';
import { LoginHttpDto } from 'src/auth/dto';
import { CryptographyService } from 'src/common/cryptography/cryptography.service';
import { UuidService } from 'src/common/uuid/uuid.service';
import { User } from 'src/models/users/entities/user.entity';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DbUtil } from './utils/db.util';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let dbUtil: DbUtil;
  let uuidService: UuidService;
  let cryptographyService: CryptographyService;

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
    uuidService = app.get<UuidService>(UuidService);
    cryptographyService = app.get<CryptographyService>(CryptographyService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/login (POST)', () => {
    afterEach(async () => {
      await dbUtil.clearDb();
    });

    const testCases = [
      {
        identifier: mockEmailIdentifier,
        password: mockPassword,
      },
      {
        identifier: mockUsernameIdentifier,
        password: mockPassword,
      },
    ];

    testCases.forEach(({ identifier, password }) => {
      it('should return 401 when user provided does not exist', async () => {
        const loginDto: LoginHttpDto = {
          identifier,
          password,
        };

        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send(loginDto)
          .expect(401);

        expect(response.body).toBeDefined();
        expect(response.body).toMatchObject({
          statusCode: 401,
          message: 'Unauthorized',
        });
      });
    });

    testCases.forEach(({ identifier, password }) => {
      it('should return 401 when user exists but invalid credentials are provided', async () => {
        const hashedPassword = cryptographyService.hash(password);

        await dbUtil.getRepository(User).save({
          firstName: 'John',
          lastName: 'Doe',
          dob: '2000-02-25',
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

        expect(response.body).toBeDefined();
        expect(response.body).toMatchObject({
          statusCode: 401,
          message: 'Unauthorized',
        });
        expect(response.body.token).not.toBeDefined();
      });
    });

    testCases.forEach(({ identifier, password }) => {
      it('should return a token when user exists and valid credentials are provided', async () => {
        const hashedPassword = cryptographyService.hash(password);

        await dbUtil.getRepository(User).save({
          firstName: 'John',
          lastName: 'Doe',
          dob: '2000-02-25',
          email: mockEmailIdentifier,
          username: mockUsernameIdentifier,
          password: hashedPassword,
        });

        const authData: LoginHttpDto = {
          identifier,
          password,
        };

        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send(authData)
          .expect(200);

        expect(response.body).toBeDefined();
        expect(response.body.token).toBeDefined();
      });
    });
  });

  describe('/request-password-restore (POST)', () => {
    describe('when user does not exist', () => {
      const cases = [
        {
          identifierName: 'email',
          identifier: mockEmailIdentifier,
        },
        {
          identifierName: 'username',
          identifier: mockUsernameIdentifier,
        },
      ];

      cases.forEach(({ identifier }) => {
        it('should return 401 for the provided $identifierName', async () => {
          const response = await request(app.getHttpServer())
            .post('/auth/request-password-restore')
            .send({ identifier })
            .expect(401);

          expect(response.body).toBeDefined();
          expect(response.body).toMatchObject({
            statusCode: 401,
            message: 'Unauthorized',
          });
        });
      });
    });

    describe('when user exists', () => {
      beforeEach(async () => {
        const hashedPassword = cryptographyService.hash(mockPassword);

        await dbUtil.getRepository(User).save({
          firstName: 'John',
          lastName: 'Doe',
          dob: '2000-02-25',
          email: mockEmailIdentifier,
          username: mockUsernameIdentifier,
          password: hashedPassword,
        });
      });

      afterEach(async () => {
        await dbUtil.clearDb();
      });

      const testCases = [
        {
          identifierName: 'email',
          identifier: mockEmailIdentifier,
        },
        {
          identifierName: 'username',
          identifier: mockUsernameIdentifier,
        },
      ];

      testCases.forEach(({ identifier }) => {
        it('should send restore email and return restore token for the provided $identifierName', async () => {
          const response = await request(app.getHttpServer())
            .post('/auth/request-password-restore')
            .send({ identifier })
            .expect(200);

          // Todo: check that mock EmailService was called

          expect(response.body).toBeDefined();
          expect(response.body.restoreToken).toBeDefined();
        });
      });
    });
  });

  describe('/restore-password/:id (POST)', () => {
    describe('when userId is not a UUID', () => {
      it('should return 400', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/restore-password/invalidId')
          .send({
            password: mockPassword,
            confirmPassword: mockPassword,
          })
          .expect(400);

        expect(response.body).toBeDefined();
        expect(response.body).toMatchObject({
          statusCode: 400,
          message: 'Validation failed (uuid is expected)',
        });
      });
    });

    describe('when passwords do not match', () => {
      it('should return 400', async () => {
        const response = await request(app.getHttpServer())
          .post(`/auth/restore-password/${uuidService.generate()}`)
          .send({
            password: mockPassword,
            confirmPassword: 'invalidPassword123',
          })
          .expect(400);

        expect(response.body).toBeDefined();
        expect(response.body).toMatchObject({
          statusCode: 400,
          message: expect.arrayContaining(['Passwords do not match']),
        });
      });
    });

    describe('when user does not exist', () => {
      it('should return 401', async () => {
        const response = await request(app.getHttpServer())
          .post(`/auth/restore-password/${uuidService.generate()}`)
          .send({
            password: mockPassword,
            confirmPassword: mockPassword,
          })
          .expect(401);

        expect(response.body).toBeDefined();
        expect(response.body).toMatchObject({
          statusCode: 401,
          message: 'Unauthorized',
        });
      });
    });

    describe('when user exists', () => {
      let user: User;

      beforeEach(async () => {
        const hashedPassword = cryptographyService.hash(mockPassword);

        user = await dbUtil.getRepository(User).save({
          firstName: 'John',
          lastName: 'Doe',
          dob: '2000-02-25',
          email: mockEmailIdentifier,
          username: mockUsernameIdentifier,
          password: hashedPassword,
        });
      });

      afterEach(async () => {
        await dbUtil.clearDb();
      });

      it('should update the password', async () => {
        const response = await request(app.getHttpServer())
          .post(`/auth/restore-password/${user.id}`)
          .send({
            password: mockPassword,
            confirmPassword: mockPassword,
          })
          .expect(200);

        expect(response.body).toBeDefined();

        const dbUser = await dbUtil.getRepository(User).findOne({
          where: { id: user.id },
          select: ['password'],
        });

        expect(dbUser).toBeDefined();
        expect(dbUser?.password).not.toBe(user.password);
        expect(
          cryptographyService.compare(mockPassword, dbUser!.password),
        ).toBe(true);
      });
    });
  });
});
