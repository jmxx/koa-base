import Koa    from 'koa';
import views  from 'koa-views';
import server from 'koa-static';
import Router from 'koa-router';
import config from './config';

const app = new Koa();
const router = new Router();

app.use(views(config.paths.views, {
  extension: 'pug'
}));

app.use(server(config.paths.public));

router
  .get('/', async (ctx) => {
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