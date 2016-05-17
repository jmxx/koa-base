import Koa    from 'koa';
import path   from 'path';
import views  from 'koa-views';

const viewPaths = path.resolve(__dirname, '../resources/views');
const app = new Koa();

app.use(views(viewPaths, {
  extension: 'pug'
}));

app.use(async (ctx) => {
  await ctx.render('index');
});

app.listen(process.env.PORT || 3000, () => {
  if (process.env.SIGNATURE) {
    console.log(process.env.SIGNATURE);
  }
});