import Vue from 'vue';
import Router from 'vue-router';
import login from './view/login.vue';
import tabela from './view/tabela.vue';
import preco from './view/preco.vue';
import painel from './view/painel.vue';
import cadastroFuncionario from './view/cadastroFuncionario.vue';

import Funcionario from '../src/services/funcionarios'




Vue.use(Router);

const router = new Router({

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
            path: '/cadastro',
            name: 'cadastro',
            component: cadastroFuncionario
          },
          {
            path: '/painel',
            name: 'painel',
            component: painel,
            meta: { requiresAuth: true }
          },
          
       
    ]
})

router.beforeEach((to, from, next) => {

  if(to.meta.requiresAuth){
    if(!Funcionario.user){
      next({
        name: "login"
      })
    }else{
      next();
    }
  }else{
    next();
  }
})

export default router