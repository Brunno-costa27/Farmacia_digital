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
            <!-- <router-link to="/cadastro">Cadastrar funcionarios</router-link>
            <router-view></router-view> -->
            <a @click="() => (modal2Visible = true)">Cadastrar funcionarios</a>
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
          :style="{ padding: '24px', background: '#fff', minHeight: '360px' }"
        >
          <div v-if="active">
            <a-table
              :columns="columnsFuncionarios"
              :data-source="funcionarios"
              id="tab"
            >
              <a slot="name" slot-scope="text">{{ text }}</a>
            </a-table>
            <a-button
              @click="tabelaFechar"
              type="danger"
              style="margin-top: 20px"
            >
              fechar
            </a-button>
          </div>
          <div v-if="active1">
            <!-- <a-table :columns="columnsCadastroPreco" :data-source="requisições" bordered id="tabela">
              <a slot="name" slot-scope="text">{{ text }}</a>
            </a-table> -->
            <a-table
              :columns="columns"
              :data-source="requisições"
              bordered
              id="tabela"
            >
              <template
                v-for="col in ['valor']"
                :slot="col"
                slot-scope="text, record"
              >
                <div :key="col">
                  <a-input
                    v-if="record.editable"
                    style="margin: -5px 0"
                    :value="text"
                    @change="
                      (e) =>
                        handleChange(e.target.value, record.id_historico, col)
                    "
                  />
                  <template v-else>
                    {{ text }}
                  </template>
                </div>
              </template>
              <template slot="operation" slot-scope="text, record">
                <div class="editable-row-operations">
                  <span v-if="record.editable">
                    <a @click="() => save(record.id_historico)">Salvar</a>
                    <a-popconfirm
                      title="Certifique-se de cancelar?"
                      @confirm="() => cancel(record.id_historico)"
                    >
                      <a>Cancelar</a>
                    </a-popconfirm>
                  </span>
                  <span v-else>
                    <a
                      :disabled="editingKey !== ''"
                      @click="() => edit(record.id_historico)"
                      >Editar</a
                    >
                  </span>
                </div>
              </template>
            </a-table>
            <a-button
              @click="precoFechar"
              type="danger"
              style="margin-top: 20px"
            >
              fechar
            </a-button>
          </div>
          <div>
            <a-modal
              v-model="modal2Visible"
              title="Cadastro de funcionarios"
              centered
              @ok="() => (modal2Visible = false)"
            >
              <div>
                <a-form :form="form" @submit="handleSubmit">
                  <a-form-item v-bind="formItemLayout" label="Nome">
                    <a-input v-model="nome" required />
                  </a-form-item>

                  <a-form-item
                    v-bind="formItemLayout"
                    label="cpf"
                    has-feedback
                    v-mask="'###.###.###-##'"
                  >
                    <a-input v-model="cpf" required />
                  </a-form-item>

                  <a-form-item
                    v-bind="formItemLayout"
                    label="cargo"
                    has-feedback
                  >
                    <a-input v-model="cargo" required />
                  </a-form-item>

                  <a-form-item
                    v-bind="formItemLayout"
                    label="Senha"
                    has-feedback
                  >
                    <a-input type="password" v-model="senha" required />
                  </a-form-item>

                  <a-form-item v-bind="formItemLayout">
                    <a-button type="primary" html-type="submit">
                      Registrar
                    </a-button>
                  </a-form-item>
                </a-form>
              </div>
            </a-modal>
          </div>
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center"> footer </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script>
import Funcionario from "../services/funcionarios";
import axios from "axios";
const funcionarios = [];
const requisições = [];

const columnsFuncionarios = [
  {
    title: "cpf",
    dataIndex: "cpf",
    key: "cpf",
    width: "15%",
  },
  {
    title: "nome",
    dataIndex: "nome",
    key: "nome",
    width: 800,
  },
  {
    title: "cargo",
    dataIndex: "cargo",
    key: "cargo 1",
    ellipsis: true,
  },
];

const columnsCadastroPreco = [
  {
    title: "medicamento",
    dataIndex: "medicamento",
    width: "15%",
    scopedSlots: { customRender: "medicamento" },
  },
  {
    title: "valor",
    dataIndex: "valor",
    width: "15%",
    scopedSlots: { customRender: "valor" },
  },
  {
    title: "paciente",
    dataIndex: "paciente",
    width: "40%",
    scopedSlots: { customRender: "paciente" },
  },
  {
    title: "data",
    dataIndex: "data_historico",
    scopedSlots: { customRender: "data_historico" },
  },
  {
    title: "telefone",
    dataIndex: "telefone",
    scopedSlots: { customRender: "telefone" },
  },
];

const columns = [
  {
    title: "id",
    dataIndex: "id_historico",
    width: "5%",
    scopedSlots: { customRender: "id_historico" },
  },
  {
    title: "medicamento",
    dataIndex: "medicamento",
    width: "10%",
    scopedSlots: { customRender: "medicamento" },
  },
  {
    title: "valor",
    dataIndex: "valor",
    width: "8%",
    scopedSlots: { customRender: "valor" },
  },
  {
    title: "paciente",
    dataIndex: "paciente",
    width: "25%",
    scopedSlots: { customRender: "paciente" },
  },
  {
    title: "data",
    dataIndex: "data_historico",
    scopedSlots: { customRender: "data_historico" },
  },
  {
    title: "telefone",
    dataIndex: "telefone",
    width: "15%",
    scopedSlots: { customRender: "telefone" },
  },
  {
    title: "operation",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
  },
];

export default {
  data() {
    return {
      columns,
      editingKey: "",
      collapsed: true,
      active: false,
      active1: false,
      requisições,
      columnsFuncionarios,
      columnsCadastroPreco,
      funcionarios,
      usuario: "",
        modal2Visible: false,
      nome: "",
      cpf: "",
      senha: "",
      cargo: "",
      messageError: null,
      message: null,
      formItemLayout: {
        labelCol: {
          xs: { span: 40 },
          sm: { span: 40 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 24 },
        },
      },
      tailFormItemLayout: {
        wrapperCol: {
          xs: {
            span: 2,
            offset: 1,
          },
          sm: {
            span: 1,
            offset: 7,
          },
        },
      },
    };
  },
  
  mounted() {
    Funcionario.listar().then((resposta) => {
      console.log(resposta.data);
      this.funcionarios = resposta.data;
      this.usuario = this.$route.params.cpf;
      this.user1(this.usuario);
    });

    Funcionario.listar1().then((resposta) => {
      console.log(resposta.data);
      this.requisições = resposta.data;
      console.log(resposta.data);
    });
  },
   beforeCreate() {
    this.form = this.$form.createForm(this, { name: "register" });
  },
  methods: {
     handleSubmit(e) {
      e.preventDefault();
      axios
        .post(`http://localhost:3333/funcionario`, {
          nome: this.nome,
          cpf: this.cpf,
          senha: this.senha,
          cargo: this.cargo,
        })
        .then((res) => {
          this.messageError = res.data.error;
          this.message = res.data.message;
          console.log(res.data.error);
          this.activeError();
        })
        .catch((e) => {
          console.log(e.response.error);
        });
    },
    user1(usuario) {
      this.nome = this.funcionarios.find((user) => user.cpf === usuario);
      console.log(this.nome.nome);
    },
    tabelaAparece() {
      this.active = true;
      this.active1 = false;
    },
    tabelaFechar() {
      this.active = false;
    },
    precoAparece() {
      this.active1 = true;
      this.active = false;
    },
    precoFechar() {
      this.active1 = false;
    },
    handleChange(value, id_historico, column) {
      const newData = [...this.requisições];
      const target = newData.filter(
        (item) => id_historico === item.id_historico
      )[0];
      if (target) {
        target[column] = value;
        console.log(value, "valor");
        this.requisições = newData;
      }
    },
    edit(id_historico) {
      const newData = [...this.requisições];
      const target = newData.filter(
        (item) => id_historico === item.id_historico
      )[0];
      this.editingKey = id_historico;
      console.log(id_historico);
      if (target) {
        target.editable = true;
        this.requisições = newData;
      }
    },
    save(id_historico) {
      const newData = [...this.requisições];
      // const newCacheData = [...this.cacheData];
      const target = newData.filter(
        (item) => id_historico === item.id_historico
      )[0];
      console.log(target, "target");
      // const targetCache = newCacheData.filter(item => id_historico === item.id_historico)[0];
      // console.log(targetCache, 'targetCache');

      if (target) {
        delete target.editable;
        this.requisições = newData;
        Object.assign(target);
      }
      this.editingKey = "";
    },
    cancel(id_historico) {
      const newData = [...this.requisições];
      const target = newData.filter(
        (item) => id_historico === item.id_historico
      )[0];
      this.editingKey = "";
      console.log(target, "target do cancel");
      if (target) {
        Object.assign(target);
        delete target.editable;
        this.requisições = newData;
      }
    },
  },
  setModal1Visible(modal1Visible) {
      this.modal1Visible = modal1Visible;
    },
    // activeError() {
    //   if (this.messageError === "funcionario already exists") {
    //     this.active = true;
    //     this.cpf = "";
    //     this.senha = "";
    //     this.cargo = "";
    //     this.nome1 = "";
    //   } else if (this.message === "cadastrado com sucesso!") {
    //     console.log("deu certo");
    //   }
    // },
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
