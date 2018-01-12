import Woowahan from 'woowahan';
import DefaultLayout from './views/layout/default';
import * as views from './views';

global.$ = global.jQuery = Woowahan.$;

const app = new Woowahan();
const routeConfig = {
  url: '/',
  view: views.Main,
  container: '.contents',
  layout: 'DefaultLayout'
};

app.start(routeConfig);

app.use(Woowahan.Layout('#app', DefaultLayout));

app.on('start', function() {
  console.log('app start');
});
