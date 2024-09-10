import { createApp } from 'vue'
import App from './App.vue'

import  { Parse } from 'parse/dist/parse.min.js';
import router from './router'
import './assets/tailwind.css'
// appID, js key
Parse.initialize('ArFOJlSwZzGI3SCPVObh0LM3oewYKzdhFRu9AYiG', 'sEne5pC3BgF9UQbUG5M5YEXBavOhGufClcFjnzWq');
Parse.serverURL = 'https://parseapi.back4app.com';

createApp(App).use(router).mount('#app')
