import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        enableDebugMessages: true,
      }),
    );
    await app.init();
    prisma = app.get(PrismaService);
    await prisma.cleandb();
  });

  afterAll(() => app.close());

  describe('Auth', () => {
    describe('Register', () => {
      it.todo('Should register');
    });
    describe('Login', () => {
      it.todo('Should login');
    });
  });

  describe('User', () => {
    describe('Get Me', () => {});
    describe('Edit User', () => {});
  });
  describe('Bookmark', () => {
    describe('Get Bookmarks', () => {});
    describe('Get Bookmark by ID', () => {});
    describe('Create Bookmark', () => {});
    describe('Edit Bookmark', () => {});
    describe('Delete Bookmark', () => {});
  });
});
