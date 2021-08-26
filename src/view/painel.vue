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
          <a-menu-item>
            <!-- <router-link to="/preco">cadastrar preços</router-link>
            <router-view></router-view> -->
            <a @click="precoAparece">cadastrar preços</a>
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
            <a-table :columns="columnsFuncionarios" :data-source="funcionarios" id="tab">
              <a slot="name" slot-scope="text">{{ text }}</a>
            </a-table>
            <a-button @click="tabelaFechar" type="danger" style="margin-top: 20px"> fechar </a-button>
          </div>
           <div v-if="active1">
            <a-table :columns="columnsCadastroPreco" :data-source="requisições" bordered id="tabela">
              <a slot="name" slot-scope="text">{{ text }}</a>
            </a-table>
            <a-button @click="precoFechar" type="danger" style="margin-top: 20px"> fechar </a-button>
          </div>
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
const requisições = [];

const columnsFuncionarios = [
  {
    title: 'cpf',
    dataIndex: 'cpf',
    key: 'cpf',
     width: '15%',
  },
  {
    title: 'nome',
    dataIndex: 'nome',
    key: 'nome',
    width: 800,
  },
  {
    title: 'cargo',
    dataIndex: 'cargo',
    key: 'cargo 1',
    ellipsis: true,
  },
];

const columnsCadastroPreco = [
  {
    title: 'medicamento',
    dataIndex: 'medicamento',
    width: '15%',
    scopedSlots: { customRender: 'medicamento' },
  },
  {
    title: 'valor',
    dataIndex: 'valor',
    width: '15%',
    scopedSlots: { customRender: 'valor' },
  },
  {
    title: 'paciente',
    dataIndex: 'paciente',
    width: '40%',
    scopedSlots: { customRender: 'paciente' },
  },
  {
    title: 'data',
    dataIndex: 'data_historico',
    scopedSlots: { customRender: 'data_historico' },
  },
  {
    title: 'telefone',
    dataIndex: 'telefone',
    scopedSlots: { customRender: 'telefone' },
  },
];


export default {
  data() {
    return {
      collapsed: true,
      active: false,
      active1: false,
      requisições,
      columnsFuncionarios,
      columnsCadastroPreco,
      funcionarios,
      usuario: "",
      nome: "",
    };
  },
  mounted() {
    Funcionario.listar().then((resposta) => {
      console.log(resposta.data);
      this.funcionarios = resposta.data;
      this.usuario = this.$route.params.cpf;
      this.user1(this.usuario);
    });

     Funcionario.listar1().then(resposta => {
      console.log(resposta.data);
      this.requisições = resposta.data;
      console.log(resposta.data);
    })

  },
  methods: {
    user1(usuario) {
      this.nome = this.funcionarios.find((user) => user.cpf === usuario);
      console.log(this.nome.nome);
    },
    tabelaAparece() {
      this.active = true;
      this.active1 = false;
    },
    tabelaFechar(){
      this.active = false;
    },
    precoAparece(){
      this.active1 = true;
      this.active = false;
    },
    precoFechar(){
      this.active1 = false;
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
