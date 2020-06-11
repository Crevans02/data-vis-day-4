// Imports
import Vue from 'vue';
import App from '../vue/App.vue';
import * as d3 from "d3";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'

// Configure language
locale.use(lang);

// Vue use
Vue.use(ElementUI);
// Vue.use(VueCalendarHeatmap);

// Mount
new Vue({ render: createElement => createElement(App) }).$mount('#app');
