import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserHttpDto } from 'src/models/users/dto';
import { User } from 'src/models/users/entities/user.entity';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DbUtil } from './utils/db.util';

describe('UsersController (e2e)', () => {
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

  afterEach(async () => {
    await dbUtil.clearDb();
  });

  describe('/users (POST)', () => {
    it('should create user when valid DTO is provided', async () => {
      const userData: CreateUserHttpDto = {
        firstName: 'John',
        lastName: 'Doe',
        dob: '2000-02-25',
        email: 'john.doe@example.com',
        username: 'johndoe',
        password: 'Password123',
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .expect(201);

      expect(response.body).toBeDefined();
      expect(response.body.id).toBeDefined();

      const dbUser = await dbUtil.getRepository(User).findOneBy({
        id: response.body.id,
      });
      expect(dbUser).toBeInstanceOf(User);
      expect(dbUser?.firstName).toBe(userData.firstName);
      expect(dbUser?.lastName).toBe(userData.lastName);
      expect(dbUser?.dob).toBe(userData.dob);
      expect(dbUser?.email).toBe(userData.email);
    });
  });
});
