import Koa        from 'koa';
import views      from 'koa-views';
import Router     from 'koa-router';
import server     from 'koa-static';
import mount      from 'koa-mount';
import session    from 'koa-generic-session';
import redisStore from 'koa-redis';
import convert    from 'koa-convert';
import config     from './config';
import api        from './api/v1';

const app = new Koa();
const router = new Router();

app.keys = ['SECRET_KEY_2', 'SECRET_KEY_1'];

app.use(server(config.paths.public));

app.use(views(config.paths.views, {
  extension: 'pug'
}));

app.use(convert(session({
  store: redisStore()
})));

app.use(mount('/api/v1', api));

router
  .get('/', async (ctx) => {
    ctx.session.timestamp = (new Date).getTime();
    await ctx.render('index', {
      text: 'Koa'
    });
  })
  .get('/:text', async (ctx) => {
    await ctx.render('index', {
      text: ctx.params.text
    });
  });

app.use(router.routes());

app.listen(process.env.PORT || 3000, () => {
  if (process.env.SIGNATURE) {
    console.log(process.env.SIGNATURE);
  }
});