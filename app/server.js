import Koa        from 'koa';
import views      from 'koa-views';
import server     from 'koa-static';
import bodyParser from 'koa-bodyparser';
import session    from 'koa-generic-session';
import redisStore from 'koa-redis';
import config     from './config';
import api        from './api/v1';

const app = new Koa();

app.keys = ['SECRET_KEY_2', 'SECRET_KEY_1'];

app.use(server(config.paths.public));

app.use(session({
  store: redisStore()
}));

app.use(views(config.paths.views, {
  extension: 'pug'
}));

app.use(bodyParser({
  extendTypes: {
    json: ['application/json'] // will parse application/x-javascript type body as a JSON string
  }
}));

app.use((ctx, next) => {
  return next().catch((err) => {
    if (401 === err.status) {
      ctx.status = 401;
      ctx.body = 'Protected resource, use Authorization header to get access.';
    } else {
      throw err;
    }
  });
})

app.use(async (ctx) => {
  ctx.session.timestamp = (new Date).getTime();
});

app.use(api.sessions.routes());

app.listen(process.env.PORT || 3000, () => {
  if (process.env.SIGNATURE) {
    console.log(process.env.SIGNATURE);
  }
});