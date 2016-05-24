import jwt      from 'koa-jwt';
import jwtToken from 'jsonwebtoken';
import Router   from 'koa-router';

const SECRET_KEY     = 'SECRET-KEY';
const JWT_COOKIE_KEY = 'JWT-TOKEN';

const router = new Router({
  prefix: '/sessions'
});

router
  .post('/', async (ctx, next) => {
    const token = await jwtToken.sign({username: ctx.request.body.username}, SECRET_KEY);

    ctx.cookies.set(JWT_COOKIE_KEY, token, {
      httpOnly: true
    });

    ctx.body = {
      status: 'OK',
      username: ctx.request.body.username
    };

    await next();
  })
  .get('/', jwt({secret: SECRET_KEY, key: 'jwtToken', cookie: JWT_COOKIE_KEY}), (ctx) => {
    ctx.body = {
      username: 'username',
      state: ctx.state.jwtToken
    };
  });

export default router;