<template>
  <a-layout id="components-layout-demo-side">
    <a-layout-sider v-model="collapsed" collapsible>
      <img src="../assets/farmacia.png" alt="não deu certo" id="logo" />
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
           <a-menu-item>
             <router-link to="/login">Sair</router-link>
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
          <a-breadcrumb-item id="name">
            <div id="voltar">
            Seja bem-vindo {{ users.nome }}
            </div>
          </a-breadcrumb-item
          >
        </a-breadcrumb>

        <div
          :style="{ padding: '20px', background: '#fff', minHeight: '360px' }"
        >
          <div id="inform" v-if="active_boletim">
            <div>
              <h1 id="center_boletin">Boletim covid</h1>
              <h1 id="texto_boletim">Estado:{{ Estado }}</h1>
              <h1 id="texto_boletim">Casos:{{ casosCovid }}</h1>
              <h1 id="texto_boletim">Mortes:{{ mortes }}</h1>
              <h1 id="texto_boletim">
                Data da última atualização:{{ data_padrao }}
              </h1>
            </div>
          </div>

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
                v-for="col in ['valor', 'telefone']"
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
                        handleChange(e.target.value, record.key, col)
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
                    <a @click="() => save(record.key)">Salvar</a>
                    <a-popconfirm
                      title="Certifique-se de cancelar?"
                      @confirm="() => cancel(record.key)"
                    >
                      <a>Cancelar</a>
                    </a-popconfirm>
                  </span>
                  <span v-else>
                    <a
                      :disabled="editingKey !== ''"
                      @click="() => edit(record.key)"
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
            @ok="
              () => (
                (modal2Visible = false), (active2 = false), (active3 = false)
              )
            "
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
                  <a-button
                    type="primary"
                    html-type="submit"
                    @click="activeError"
                  >
                    Registrar
                  </a-button>
                  <a-alert
                    v-if="active2"
                    type="error"
                    message="funcionário já existe!"
                    style="text-align: center"
                  />
                  <a-alert
                    v-if="active3"
                    type="success"
                    message="funcionário cadastrado com sucesso!"
                    style="text-align: center"
                  />
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

// const columnsCadastroPreco = [
//   {
//     title: "medicamento",
//     dataIndex: "medicamento",
//     width: "15%",
//     scopedSlots: { customRender: "medicamento" },
//   },
//   {
//     title: "valor",
//     dataIndex: "valor",
//     width: "15%",
//     scopedSlots: { customRender: "valor" },
//   },
//   {
//     title: "paciente",
//     dataIndex: "paciente",
//     width: "40%",
//     scopedSlots: { customRender: "paciente" },
//   },
//   {
//     title: "data",
//     dataIndex: "data_historico",
//     scopedSlots: { customRender: "data_historico" },
//   },
//   {
//     title: "telefone",
//     dataIndex: "telefone",
//     scopedSlots: { customRender: "telefone" },
//   },
// ];

const columns = [
  {
    title: "id_historico",
    dataIndex: "id_historico",
    width: "17%",
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
    title: "medico",
    dataIndex: "medico",
    width: "10%",
    scopedSlots: { customRender: "medico" },
  },
  {
    title: "quantidade",
    dataIndex: "quantidade",
    width: "7%",
    scopedSlots: { customRender: "quantidade" },
  },
  {
    title: "telefone",
    dataIndex: "telefone",
    width: "10%",
    scopedSlots: { customRender: "telefone" },
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
      dadosCovid: "",
      data_padrao: "",
      converter_data: "",
      Estado: "",
      casosCovid: "",
      data_horas: "",
      mortes: "",
      users: "",
      date: "",
      columns,
      data: [],
      editingKey: "",
      collapsed: true,
      active: false,
      active1: false,
      active2: false,
      active3: false,
      active_boletim: true,
      requisições,
      columnsFuncionarios,
      // columnsCadastroPreco,
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

    axios.get('http://localhost:8081/requisicoes').then((resposta) => {
      console.log(resposta.data);
      this.data = resposta.data;
      for (let i = 0; i < 100; i++) {
  this.requisições.push({
    key: i,
    id_historico: this.data[i].id_login,
    medicamento: this.data[i].medicamento,
    quantidade: this.data[i].quantidade,
    medico: this.data[i].medico
  });
}

      // console.log(resposta.data);
    });


    axios
      .get("https://covid19-brazil-api.vercel.app/api/report/v1")
      .then((res) => {
        this.dadosCovid = res.data;
        // console.log(res.data);
        for (const key in this.dadosCovid) {
          let valor = this.dadosCovid[key];
          for (const key1 in valor) {
            if (valor[key1].uid === 24) {
              // console.log(valor[key1].state);
              this.Estado = valor[key1].state;
              this.casosCovid = valor[key1].cases;
              this.mortes = valor[key1].deaths;
              this.data_horas = valor[key1].datetime;
              this.converter_data = this.data_horas.slice(0, 10);
              this.data_padrao = this.converter_data
                .split("-")
                .reverse()
                .join("/");
            }
          }
        }
      });
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "register" });
  },
  methods: {
//     atualiza(){
//        axios.get('http://localhost:8081/requisicoes').then((resposta) => {
//       console.log(resposta.data);
//       this.data = resposta.data;
//       const tamanho = this.data.length;
//       console.log(tamanho);
//       for (let i = 0; i < 100; i++) {
//   this.requisições.push({
//     key: i,
//     id_historico: this.data[i].id_login,
//     medicamento: this.data[i].medicamento,
//     quantidade: this.data[i].quantidade,
//     medico: this.data[i].medico
//   });
// }

//       // console.log(resposta.data);
//     });
//     },
    
    handleSubmit(e) {
      e.preventDefault();
      axios
        .post(`http://pacienteweb.brazilsouth.cloudapp.azure.com:3333/funcionario`, {
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
      this.active_boletim = false;
    },
    tabelaFechar() {
      this.active = false;
      this.active_boletim = true;
    },
    precoAparece() {
      this.active1 = true;
      this.active = false;
      this.active_boletim = false;
    },
    precoFechar() {
      this.active1 = false;
      this.active_boletim = true;
    },
    handleChange(value, key, column) {
      const newData = [...this.requisições];
      const target = newData.filter(
        (item) => key === item.key
      )[0];
      if (target) {
        target[column] = value;
        // console.log(value, "valor");
        this.requisições = newData;
      }
    },
    edit(key) {
      const newData = [...this.requisições];
      const target = newData.filter(
        (item) => key === item.key
      )[0];
      this.editingKey = key;
      console.log(target);

      if (target) {
        target.editable = true;
        this.requisições = newData;
      }
    },
    save(key) {
      const newData = [...this.requisições];
      // const newCacheData = [...this.cacheData];
      const target = newData.filter(
        (item) => key === item.key
      )[0];
      // console.log(target, "target");
      // const targetCache = newCacheData.filter(item => key === item.key)[0];
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
          id_historico: target.id_historico,
          medicamento: target.medicamento,
          valor: target.valor,
          data_historico: this.date.toLocaleDateString("pt-BR"),
          telefone: target.telefone,
          id_cpf: this.usuario,
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
    cancel(key) {
      const newData = [...this.requisições];
      const target = newData.filter(
        (item) => key === item.key
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
        Funcionario.listar().then((resposta) => {
          // console.log(resposta.data);
          this.funcionarios = resposta.data;
          this.usuario = this.$route.params.cpf;
          this.user1(this.usuario);
        });
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

img {
  width: 100%;
}

#name {
  font-size: 30px;
}

#inform {
  /* margin-top: 60px; */
  background-color: red;
  border-radius: 5px;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

#center_boletin {
  text-decoration: underline;
  color: white;
  font-size: 30px;
}

#texto_boletim {
  text-decoration: none;
  color: white;
  font-size: 30px;
}

#voltar{
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

}

</style>
