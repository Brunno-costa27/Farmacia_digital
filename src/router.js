import Vue from 'vue';
import Router from 'vue-router';
import login from './view/login.vue';
import tabela from './view/tabela.vue';
import preco from './view/preco.vue';
import painel from './view/painel.vue';





Vue.use(Router);

export default new Router({

    mode: 'history',
    routes: [
        {
            path: '/login',
            name: 'login',
            component: login
        },
          {
            path: '/tabela',
            name: 'tabela',
            component: tabela
          },
          {
            path: '/preco',
            name: 'preco',
            component: preco
          },
          {
            path: '/painel',
            name: 'painel',
            component: painel
          }
       
    ]
})