<template>
  <a-layout id="components-layout-demo-side">
    <a-layout-sider v-model="collapsed" collapsible>
      <div class="logo" />
      <a-menu theme="dark" :default-selected-keys="['1']" mode="inline">
        <a-sub-menu>
          <span slot="title"
            ><a-icon type="user" /><span>{{ users.nome }}</span></span
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
          <a-breadcrumb-item>
            Seja bem-vindo {{ users.nome }}</a-breadcrumb-item
          >
        </a-breadcrumb>

        <div
          :style="{ padding: '20px', background: '#fff', minHeight: '360px' }"
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
              style="margin-top: 20px max-width: 100%;"
            >
              Fechar
            </a-button>
          </div>

          <a-modal
            v-model="modal2Visible"
            title="Cadastro de funcionarios"
            centered
            @ok="() => (modal2Visible = false, active2 = false, active3 = false)"
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

                <a-form-item v-bind="formItemLayout" label="cargo" has-feedback>
                  <a-input v-model="cargo" required />
                </a-form-item>

                <a-form-item v-bind="formItemLayout" label="Senha" has-feedback>
                  <a-input type="password" v-model="senha" required />
                </a-form-item>

                <a-form-item v-bind="formItemLayout">
                  <a-button type="primary" html-type="submit" @click="activeError">
                    Registrar
                    
                  </a-button>
                   <a-alert v-if="active2" type="error" message="funcionário já existe!" style="text-align: center"/>
                   <a-alert v-if="active3" type="success" message="funcionário cadastrado com sucesso!"  style="text-align: center"/>
                </a-form-item>
              </a-form>
            </div>
          </a-modal>
        </div>
      </a-layout-content>
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
    dataIndex: "id_login",
    width: "17%",
    scopedSlots: { customRender: "id_login" },
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
    title: "medico",
    dataIndex: "medico",
    width: "20%",
    scopedSlots: { customRender: "medico" },
  },
  {
    title: "data",
    dataIndex: "create_date",
    width: "10%",
    scopedSlots: { customRender: "crcreate_date" },
  },
  {
    title: "quantidade",
    dataIndex: "quantidade",
    width: "10%",
    scopedSlots: { customRender: "quantidade" },
  },
  {
    title: "operation",
    dataIndex: "operation",
    width: "9%",
    scopedSlots: { customRender: "operation" },
  },
];

export default {
  data() {
    return {
      users: "",
      date: "",
      columns,
      editingKey: "",
      collapsed: true,
      active: false,
      active1: false,
      active2: false,
      active3: false,
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
      // console.log(resposta.data);
      this.funcionarios = resposta.data;
      this.usuario = this.$route.params.cpf;
      this.user1(this.usuario);
    });

    Funcionario.listar1().then((resposta) => {
      console.log(resposta.data);
      this.requisições = resposta.data;
      // console.log(resposta.data);
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
          this.activeError();
        })
        .catch((e) => {
          console.log(e.response);
        });
    },
    user1(usuario) {
      this.users = this.funcionarios.find((user) => user.cpf === usuario);
      // console.log(this.users.nome);
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
        // console.log(value, "valor");
        this.requisições = newData;
      }
    },
    edit(id_historico) {
      const newData = [...this.requisições];
      const target = newData.filter(
        (item) => id_historico === item.id_historico
      )[0];
      this.editingKey = id_historico;
      // console.log(id_historico);
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
      // console.log(target, "target");
      // const targetCache = newCacheData.filter(item => id_historico === item.id_historico)[0];
      // console.log(targetCache, 'targetCache');
      console.log(target.paciente);
      if (target) {
        delete target.editable;
        this.requisições = newData;
        Object.assign(target);
      }
      this.date = new Date();
      axios
        .post(`http://localhost:3333/requisicao`, {
          id_historico: 6,
          medicamento: target.medicamento,
          valor: target.valor,
          paciente: target.paciente,
          data_historico: this.date.toLocaleDateString('pt-BR'),
          telefone: target.telefone,
          id_cpf: this.usuario
        })
        .then((res) => {
          this.messageError = res.data.error;
          this.message = res.data.message;
          this.activeError();
        })
        .catch((e) => {
          console.log(e.response);
        });

      this.editingKey = "";
    },
    cancel(id_historico) {
      const newData = [...this.requisições];
      const target = newData.filter(
        (item) => id_historico === item.id_historico
      )[0];
      this.editingKey = "";
      // console.log(target, "target do cancel");
      if (target) {
        Object.assign(target);
        delete target.editable;
        this.requisições = newData;
      }
    },
  setModal1Visible(modal1Visible) {
    this.modal1Visible = modal1Visible;
    },
  activeError() {
    if (this.messageError === "funcionario already exists") {
      console.log("deu certo, já existe");
      this.active2 = true;
      this.cpf = "";
      this.senha = "";
      this.cargo = "";
      this.nome = "";
    } else if (this.message === "cadastrado com sucesso!") {
      this.active2 = false;
      this.active3 = true;
      this.cpf = "";
      this.senha = "";
      this.cargo = "";
      this.nome = "";
      console.log("deu certo , cadastrou");
      // document.location.reload(true);
    }
    this.messageError = "";
    this.message = "";
  },
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
