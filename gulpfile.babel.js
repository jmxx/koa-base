'use strict';

import gulp         from 'gulp';
import gutil        from 'gulp-util';
import nodemon      from 'gulp-nodemon';
import browserSync  from 'browser-sync';
import postStylus   from 'poststylus';
import sourcemaps   from 'gulp-sourcemaps';
import lost         from 'lost';
import autoprefixer from 'autoprefixer';
import stylus       from 'gulp-stylus';

const PORT = 3006;
const SIGNATURE = 'Koa is running now!';

const reload = (done) => {
  browserSync.reload();
  done && done();
};

const paths = {
  public: './public',
  styles: [
    './resources/assets/styl/**/*.styl'
  ],
  views: [
    './resources/views/**/*.pug'
  ],
};

gulp.task('stylus', () => {
  return gulp.src('./resources/assets/styl/app.styl')
    .pipe(sourcemaps.init())
    .pipe(stylus({
      use: [
        postStylus([lost, autoprefixer])
      ]
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.public + '/css'))
    .pipe(browserSync.stream());
});

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

gulp.task('watch:pug', () => {
  gulp.watch(paths.views, gulp.series(reload));
});

gulp.task('watch:styles', () => {
  gulp.watch(paths.styles, gulp.series('stylus'));
});

gulp.task('watch', gulp.parallel('watch:pug', 'watch:styles'));

gulp.task('default', gulp.series('stylus', 'nodemon', 'browser-sync', 'watch'));