import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
import { UserDto } from '../src/user/dto';
import { CreateBookmarkDto, EditBookmarkDto } from 'src/bookmark/dto';

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
    await app.listen(4444);
    prisma = app.get(PrismaService);
    await prisma.cleandb();
    pactum.request.setBaseUrl('http://localhost:4444');
  });

  afterAll(() => app.close());

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'shashank@shashank.com',
      password: '12345',
    };
    describe('Register', () => {
      it('Should throw error without email', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({ password: dto.password })
          .expectStatus(400);
      });
      it('Should throw error without password', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({ email: dto.email })
          .expectStatus(400);
      });
      it('Should throw error without body', () => {
        return pactum.spec().post('/auth/register').expectStatus(400);
      });

      it('Should register', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody(dto)
          .expectStatus(200);
      });
    });
    describe('Login', () => {
      it('Should throw error when wrong password', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({ ...dto, password: '' })
          .expectStatus(400);
      });
      it('Should throw error without email', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({ password: dto.password })
          .expectStatus(400);
      });
      it('Should throw error without body', () => {
        return pactum.spec().post('/auth/login').expectStatus(400);
      });
      it('Should throw error without password', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({ email: dto.email })
          .expectStatus(400);
      });
      it('Should login', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get Me', () => {
      it('Should get current user', () => {
        return pactum
          .spec()
          .get('/user/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });

      it('Should throw error without token', () => {
        return pactum.spec().get('/user/me').expectStatus(401);
      });
    });
    describe('Edit User', () => {
      const dto: UserDto = {
        first_name: 'Shashank',
        last_name: 'Kumar',
      };
      it('Should throw error without body', () => {
        return pactum
          .spec()
          .patch('/user/edit')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
      it('Should edit current user', () => {
        return pactum
          .spec()
          .patch('/user/edit')
          .withBody(dto)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectBodyContains('id')
          .expectStatus(200);
      });
    });
  });
  describe('Bookmark', () => {
    const dto: CreateBookmarkDto = {
      title: 'Nestjs',
      link: 'https://www.youtube.com/watch?v=GHTA143_b-s&t=6701s',
    };
    describe('Get Empty Bookmarks', () => {
      it('Should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmark')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBody([])
          .inspect();
      });
    });
    describe('Create Bookmark', () => {
      it('Should create bookmark', () => {
        return pactum
          .spec()
          .post('/bookmark')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.link)
          .stores('bookmarkId', 'id');
      });
    });
    describe('Get Bookmarks', () => {
      it('Should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmark')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });
    describe('Get Bookmark by ID', () => {
      it('Should get bookmark by id', () => {
        return pactum
          .spec()
          .get('/bookmark/{id}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withPathParams('id', '$S{bookmarkId}')
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}')
          .inspect();
      });
    });
    describe('Edit Bookmark', () => {
      const dto: EditBookmarkDto = {
        title: 'Second Bookmark',
        description: 'This is NestJs course by Vlad',
      };
      it('Should edit bookmark by id', () => {
        return pactum
          .spec()
          .patch('/bookmark/{id}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withPathParams('id', '$S{bookmarkId}')
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}')
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description)
          .inspect();
      });
    });
    describe('Delete Bookmark', () => {
      it('Should edit bookmark by id', () => {
        return pactum
          .spec()
          .delete('/bookmark/{id}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withPathParams('id', '$S{bookmarkId}')
          .expectStatus(204)
          .inspect();
      });

      it('Should get empty bookmark', () => {
        return pactum
          .spec()
          .get('/bookmark')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(0)
          .inspect();
      });
    });
  });
});
