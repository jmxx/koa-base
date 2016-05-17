'use strict';

import gulp         from 'gulp';
import gutil        from 'gulp-util';
import nodemon      from 'gulp-nodemon';
import browserSync  from 'browser-sync';

const PORT = 3006;
const SIGNATURE = 'Koa is running now!';

const reload = (done) => {
  browserSync.reload();
  done && done();
};

gulp.task('browser-sync', (done) => {
  return browserSync.init({
    proxy: `http://localhost:${PORT}`
  }, done);
});

gulp.task('nodemon', (done) => {
  let started = false;

  return nodemon({
    script: './index.js',
    ext: 'js',
    env: {
      SIGNATURE,
      PORT,
      NODE_ENV: 'development'
    },
    stdout: false
  }).on('readable', function (log) {
      this.stdout.on('data', (data) => {
        const str = data.toString().replace(/(\r\n|\n|\r)+$/gm, '');

        if (str.indexOf(SIGNATURE) >= 0) {
          !started ? (started = true, done()) : reload();
        }

        gutil.log(gutil.colors.green(`[koa server] ${str}`));
      });
    });
});

gulp.task('default', gulp.series('nodemon', 'browser-sync'));