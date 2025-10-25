import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { hash } from 'src/common/bcrypt-adapter';
import { LoginHttpDto } from 'src/models/auth/dto';
import { User } from 'src/models/users/entities/user.entity';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DbUtil } from './utils/db.util';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let dbUtil: DbUtil;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dbUtil = new DbUtil(app);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/login (POST)', () => {
    afterEach(async () => {
      await dbUtil.clearDb();
    });

    it('should return a token when valid credentials are provided (username, password)', async () => {
      const password = 'Password123';
      const hashedPassword = hash(password);

      const dbUser = await dbUtil.getRepository(User).save({
        firstName: 'John',
        lastName: 'Doe',
        dob: '2000-02-25',
        email: 'john.doe@example.com',
        username: 'johndoe',
        password: hashedPassword,
      });

      const authData: LoginHttpDto = {
        username: dbUser.username,
        password,
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(authData)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.token).toBeDefined();
    });

    it('should return 401 when invalid credentials are provided (username, password)', async () => {
      const password = 'Password123';
      const hashedPassword = hash(password);

      const dbUser = await dbUtil.getRepository(User).save({
        firstName: 'John',
        lastName: 'Doe',
        dob: '2000-02-25',
        email: 'john.doe@example.com',
        username: 'johndoe',
        password: hashedPassword,
      });

      const authData: LoginHttpDto = {
        email: dbUser.email,
        password: 'wrongPassword',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(authData)
        .expect(401);

      expect(response.body).toBeDefined();
      expect(response.body).toMatchObject({
        statusCode: 401,
        message: 'Unauthorized',
      });
      expect(response.body.token).not.toBeDefined();
    });
  });
});
