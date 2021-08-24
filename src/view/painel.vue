<template>
  <a-layout id="components-layout-demo-side">
    <a-layout-sider v-model="collapsed" collapsible>
      <div class="logo" />
      <a-menu theme="dark" :default-selected-keys="['1']" mode="inline">
        <a-sub-menu>
          <span slot="title"
            ><a-icon type="user" /><span>{{ nome.nome }}</span></span
          >
        </a-sub-menu>
        <a-sub-menu key="sub2">
          <span slot="title"><a-icon type="team" /><span>Funções</span></span>
          <a-menu-item key="6">
            <router-link to="/preco">cadastrar preços</router-link>
            <router-view></router-view>
          </a-menu-item>
          <a-menu-item>
            <!-- <router-link @click="tabelaAparece" to="/tabela">visualizar funcionarios</router-link>
            <router-view></router-view> -->
            <a @click="tabelaAparece"> visualizar funcionarios</a>
          </a-menu-item>
          <a-menu-item>
            <router-link to="/cadastro">Cadastrar funcionarios</router-link>
            <router-view></router-view>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <!-- <a-layout-header style="background: #fff; padding: 0" /> -->
      <a-layout-content style="margin: 0 16px">
        <a-breadcrumb style="margin: 16px 0">
          <!-- <a-breadcrumb-item>usuário</a-breadcrumb-item> -->
          <a-breadcrumb-item> Seja bem-vindo {{ nome.nome }}</a-breadcrumb-item>
        </a-breadcrumb>

        <div 
          :style="{ padding: '24px', background: '#fff', minHeight: '360px'}"
        >
          <div v-if="active">
            <a-table :columns="columns" :data-source="funcionarios" id="tab">
              <a slot="name" slot-scope="text">{{ text }}</a>
            </a-table>
            <a-button @click="tabelaFechar" type="danger" style="margin-top: 20px"> fechar </a-button>
          </div>
        </div>

        <div>
          
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        footer
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script>
import Funcionario from "../services/funcionarios";

const funcionarios = [];

export default {
  data() {
    return {
      collapsed: true,
      active: false,
      funcionarios,
      usuario: "",
      nome: "",
    };
  },
  mounted() {
    Funcionario.listar().then((resposta) => {
      // console.log(resposta.data);
      this.funcionarios = resposta.data;
      this.usuario = this.$route.params.cpf;
      this.user1(this.usuario);
    });
  },
  methods: {
    user1(usuario) {
      this.nome = this.funcionarios.find((user) => user.cpf === usuario);
      console.log(this.nome.nome);
    },
    tabelaAparece() {
      this.active = true;
    },
    tabelaFechar(){
      this.active = false;
    }
  },
};
</script>

<style>
#components-layout-demo-side .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
#components-layout-demo-side {
  min-height: 100vh;
  display: flex;
  width: 100%;
}
</style>
