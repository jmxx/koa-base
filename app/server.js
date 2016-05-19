import Koa    from 'koa';
import path   from 'path';
import views  from 'koa-views';
import server from 'koa-static';

const viewPaths   = path.resolve(__dirname, '../resources/views');
const publicPath  = path.resolve(__dirname, '../public');

const app = new Koa();

app.use(views(viewPaths, {
  extension: 'pug'
}));

app.use(server(publicPath));

app.use(async (ctx) => {
  await ctx.render('index');
});

app.listen(process.env.PORT || 3000, () => {
  if (process.env.SIGNATURE) {
    console.log(process.env.SIGNATURE);
  }
});