import Koa        from 'koa';
import bodyParser from 'koa-bodyparser';
import sessions   from './sessions';

const app = new Koa();

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
});

app.use(sessions.routes());

export default app;