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
            <a @click="precoAparece" v-on:click="atualiza">cadastrar preços</a>
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
            <!-- <router-link to="/cadastro">Cadastrar funcionarios</router-link>
            <router-view></router-view> -->
            <a @click="() => (modal2Visible1 = true)">Excluir funcionarios</a>
          </a-menu-item>
          <a-menu-item>
            <!-- <router-link to="/cadastro">Cadastrar funcionarios</router-link>
            <router-view></router-view> -->
            <a @click="historicoAparece">Historico</a>
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
            <div id="voltar">Seja bem-vindo {{ users.nome }}</div>
          </a-breadcrumb-item>
        </a-breadcrumb>

        <div
          :style="{ padding: '20px', background: '#fff', minHeight: '360px' }"
        >
          <div id="inform" v-if="active_boletim">
            <div>
              <!-- <h1 id="center_boletin">Boletim covid</h1>
              <h1 id="texto_boletim">Estado:{{ Estado }}</h1>
              <h1 id="texto_boletim">Casos:{{ casosCovid }}</h1>
              <h1 id="texto_boletim">Mortes:{{ mortes }}</h1>
              <h1 id="texto_boletim">
                Data da última atualização:{{ data_padrao }}
              </h1> -->
              <div style="background: #ececec; padding: 30px">
                <a-card
                  title="Boletin covid"
                  :bordered="false"
                  style="width: 300px"
                >
                  <p>Estado: {{Estado}}</p>
                  <p>Casos: {{casosCovid}}</p>
                  <p>Mortes: {{mortes}}</p>
                   <p>Data da última atualização: {{data_padrao}}</p>
                </a-card>
              </div>
            </div>
          </div>

          <div v-if="active">
            <a-table
              :columns="columnsFuncionarios"
              :data-source="funcionarios"
              rowKey="key"
              id="tab"
            >
              <a slot="name" slot-scope="text">{{ text }}</a>
            </a-table>
            <a-button
              @click="tabelaFechar"
              type="danger"
              style="margin-top: 20px"
            >
              <a-icon type="close" />
            </a-button>
          </div>
          <!-- Tabela historico-->
          <div v-if="active4">
            <h1
              style="
                color: rgba(0, 0, 0, 0.65);
                font-size: 20px;
                font-weight: bold;
              "
            >
              Lista de cargos admitidos
            </h1>
            <a-table
              :columns="columnsAuditoria"
              :data-source="auditoria"
              rowKey="key"
              id="tab"
            >
              <a slot="name" slot-scope="text">{{ text }}</a>
            </a-table>
            <a-button
              @click="historicoFechar"
              type="danger"
              style="margin-top: 20px"
            >
              <a-icon type="close" />
            </a-button>
          </div>

          <div v-if="active1">
            <!-- <a-table :columns="columnsCadastroPreco" :data-source="requisições" bordered id="tabela">
              <a slot="name" slot-scope="text">{{ text }}</a>
            </a-table> -->
            <a-table
              :columns="columns"
              :data-source="requisições"
              rowKey="key"
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
                        handleChange(e.target.value, record.id_cadastro, col)
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
                    <a @click="() => save(record.id_cadastro)">Salvar</a>
                    <a-popconfirm
                      title="Certifique-se de cancelar?"
                      @confirm="() => cancel(record.id_cadastro)"
                    >
                      <a>Cancelar</a>
                    </a-popconfirm>
                  </span>
                  <span v-else id="buttonEditar">
                    <a
                      :disabled="editingKey !== ''"
                      @click="() => edit(record.id_cadastro)"
                      >Lançar preços</a
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
              <a-icon type="close" />
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
          <a-modal
            v-model="modal2Visible1"
            title="Excluir funcionarios"
            centered
            @ok="
              () => (
                (modal2Visible1 = false), (active2 = false), (active3 = false)
              )
            "
          >
            <div>
              <a-form :form="form" @submit="handleSubmit1">
                <a-form-item
                  v-bind="formItemLayout"
                  label="cpf"
                  has-feedback
                  v-mask="'###.###.###-##'"
                >
                  <a-input v-model="cpf" required />
                </a-form-item>
                <a-form-item v-bind="formItemLayout">
                  <a-button
                    type="primary"
                    html-type="submit"
                    @click="activeError"
                  >
                    Excluir
                  </a-button>
                  <a-alert
                    v-if="active2"
                    type="error"
                    message="Funcionário já existe!"
                    style="text-align: center"
                  />
                  <a-alert
                    v-if="active3"
                    type="success"
                    message="O funcionário foi removido!"
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
const auditoria = [];
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

const columnsAuditoria = [
  {
    title: "cargo",
    dataIndex: "valor_novo",
    key: "valor_novo",
    width: "15%",
  },
  {
    title: "data",
    dataIndex: "data_changed",
    key: "data_changed",
    width: "10%",
  },
];

const columns = [
  {
    title: "id",
    dataIndex: "id_login",
    width: "17%",
    align: "center",
    scopedSlots: { customRender: "id_login" },
  },
  {
    title: "Medicamento",
    dataIndex: "medicamento",
    width: "10%",
    align: "center",
    scopedSlots: { customRender: "medicamento" },
  },
  {
    title: "Valor",
    dataIndex: "valor",
    width: "8%",
    align: "center",
    scopedSlots: { customRender: "valor" },
  },
  {
    title: "Medico",
    dataIndex: "medico",
    width: "10%",
    align: "center",
    scopedSlots: { customRender: "medico" },
  },
  {
    title: "Quantidade",
    dataIndex: "quantidade",
    width: "7%",
    align: "center",
    scopedSlots: { customRender: "quantidade" },
  },
  {
    title: "Telefone",
    dataIndex: "telefone",
    width: "10%",
    align: "center",
    scopedSlots: { customRender: "telefone" },
  },
  {
    title: "Operação",
    dataIndex: "operation",
    width: "15%",
    align: "center",
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
      columnsAuditoria,
      data: [],
      arrayAuxiliar: [],
      arrayAtualizado: [],
      precoLancado: [],
      editingKey: "",
      collapsed: true,
      active: false,
      active1: false,
      active2: false,
      active3: false,
      active4: false,
      active_boletim: true,
      requisições,
      columnsFuncionarios,
      // columnsCadastroPreco,
      funcionarios,
      auditoria,
      usuario: "",
      modal2Visible: false,
      modal2Visible1: false,
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

    axios
      .get(`http://portalwebpaciente.brazilsouth.cloudapp.azure.com:8081/requisicoes?${Date.now()}`)// pegar da rota do azure portalpaciente
      .then((resposta) => {
        this.requisições = resposta.data;
      });

    axios
      .get(`http://portalfarmacia.brazilsouth.cloudapp.azure.com:3333/historicoDePreco?${Date.now()}`) // pegar da rota do azure portalfarmacia
      .then((resposta) => {
        this.precoLancado = resposta.data;
        console.log(this.precoLancado);
      });

    axios
      .get(`http://portalfarmacia.brazilsouth.cloudapp.azure.com:3333/auditoria?${Date.now()}`) // pegar da rota do azure portalfarmacia
      .then((resposta) => {
        this.arrayAuxiliar = resposta.data;
        this.arrayAuxiliar.forEach((item) => {
          item.data_changed = item.data_changed
            .slice(0, 10)
            .split("-")
            .reverse()
            .join("/");
        });
        this.auditoria = this.arrayAuxiliar;
        // console.log(this.auditoria);
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
    console.log(this.form);
  },
  methods: {
    atualiza() {
      // const precoFiltradas = this.requisições.filter(preco => this.precoLancado.filter(id => id.id_cadastro === preco.id_cadastro));

      // console.log(precoFiltradas);
      // this.requisições = precoFiltradas;
      const results = this.requisições.filter(
        ({ id_cadastro: id1 }) =>
          !this.precoLancado.some(({ id_cadastro: id2 }) => id2 === id1)
      );

      console.log(typeof results);
      this.requisições = results;
    },

    // formatCelular(v){
    // v=v.replace(/D/g,"");             //Remove tudo o que não é dígito
    // v=v.replace(/^(d{2})(d)/g,"($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
    // v=v.replace(/(d)(d{4})$/,"$1-$2");    //Coloca hífen entre o quarto e o quinto dígitos
    // return v;
    // },

    handleSubmit(e) {
      e.preventDefault();
      axios
        .post(`http://portalfarmacia.brazilsouth.cloudapp.azure.com:3333/funcionario?${Date.now()}`, { //cadastrar funcionario na rota do azure do portalfarmacia
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

    handleSubmit1(e) {
      e.preventDefault();
      axios
        .delete(`http://portalfarmacia.brazilsouth.cloudapp.azure.com:3333/funcionario/${this.cpf}`, {}) // deletar na rota da azure no portalfarmacia
        .then((res) => {
          this.messageError = res.data.error;
          this.message = res.data.message;
          this.activeError1();
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
      this.active4 = false;
      this.active1 = false;
      this.active_boletim = false;
    },
    tabelaFechar() {
      this.active = false;
      this.active_boletim = true;
    },
    precoAparece() {
      this.active1 = true;
      this.active4 = false;
      this.active = false;
      this.active_boletim = false;
    },
    historicoAparece() {
      this.active4 = true;
      this.active = false;
      this.active1 = false;
      this.active_boletim = false;
    },
    historicoFechar() {
      this.active4 = false;
      this.active = false;
      this.active_boletim = true;
    },
    precoFechar() {
      this.active1 = false;
      this.active_boletim = true;
      axios
        .get(`http://portalwebpaciente.brazilsouth.cloudapp.azure.com:8081/requisicoes?${Date.now()}`) // pegar da rota do azure portalpaciente
        .then((resposta) => {
          this.requisições = resposta.data;
        });

      axios
        .get(`http://portalfarmacia.brazilsouth.cloudapp.azure.com:3333/historicoDePreco?${Date.now()}`) // pegar da rota do azure portalfarmacia
        .then((resposta) => {
          this.precoLancado = resposta.data;
          // console.log(this.precoLancado);
        });

      const results = this.requisições.filter(
        ({ id_cadastro: id1 }) =>
          !this.precoLancado.some(({ id_cadastro: id2 }) => id2 === id1)
      );

      console.log(typeof results);
      this.requisições = results;
    },
    handleChange(value, id_cadastro, column) {
      const newData = [...this.requisições];
      const target = newData.filter(
        (item) => id_cadastro === item.id_cadastro
      )[0];
      if (target) {
        target[column] = value;
        // console.log(value, "valor");
        this.requisições = newData;
      }
    },
    edit(id_cadastro) {
      const newData = [...this.requisições];
      const target = newData.filter(
        (item) => id_cadastro === item.id_cadastro
      )[0];
      this.editingKey = id_cadastro;

      if (target) {
        target.editable = true;
        this.requisições = newData;
      }
      target.valor = "R$ ";
    },
    save(id_cadastro) {
      const newData = [...this.requisições];
      // const newCacheData = [...this.cacheData];
      const target = newData.filter(
        (item) => id_cadastro === item.id_cadastro
      )[0];
      // console.log(target, "target");
      // const targetCache = newCacheData.filter(item => key === item.key)[0];
      // console.log(targetCache, 'targetCache');
      if (target) {
        delete target.editable;
        this.requisições = newData;
        Object.assign(target);
      }
      this.date = new Date();
      // console.log(target.id_cadastro);

      axios
        .post(`http://portalfarmacia.brazilsouth.cloudapp.azure.com:3333/historico_preco?${Date.now()}`, {// pegar do azure no portalfarmacia
          id_cadastro: target.id_cadastro,
          id_historico: target.id_login,
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
      // this.arrayAtualizado = this.requisições.splice(
      //   this.requisições.indexOf(id_cadastro),
      //   1
      // );
      // console.log(this.arrayAtualizado);
      this.editingKey = "";
    },
    cancel(id_cadastro) {
      const newData = [...this.requisições];
      const target = newData.filter(
        (item) => id_cadastro === item.id_cadastro
      )[0];
      this.editingKey = "";
      // console.log(target, "target do cancel");
      if (target) {
        Object.assign(target);
        delete target.editable;
        this.requisições = newData;
      }

      target.valor = "";
      target.telefone = "";
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

           axios
      .get(`http://portalfarmacia.brazilsouth.cloudapp.azure.com:3333/auditoria?${Date.now()}`) // pegar da rota do azure portalfarmacia
      .then((resposta) => {
        this.arrayAuxiliar = resposta.data;
        this.arrayAuxiliar.forEach((item) => {
          item.data_changed = item.data_changed
            .slice(0, 10)
            .split("-")
            .reverse()
            .join("/");
        });
        this.auditoria = this.arrayAuxiliar;
        // console.log(this.auditoria);
      });
      }
      this.messageError = "";
      this.message = "";
    },
    activeError1() {
      if (this.messageError === "Funcionário não existe!") {
        console.log("funcionario já existe");
        this.active2 = true;
        this.cpf = "";
      } else if (this.message === "Apagado com sucesso!") {
        this.active2 = false;
        this.active3 = true;
        this.cpf = "";
        console.log("deu certo , excluiu o funcionario");
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
  border-radius: 5px;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

#center_boletin {
  text-decoration: underline;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: white;
  font-size: 30px;
}

#texto_boletim {
  text-decoration: none;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: white;
  font-size: 30px;
}

#voltar {
  width: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-weight: 100;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

#buttonEditar a {
  text-align: center;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: white;
}

.editable-row-operations {
  text-align: center;
  width: 100%;
  height: 100%;
  color: #e8e8e8;
  padding: 5px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

.ant-table-row-cell-break-word {
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

.editable-row-operations a {
  text-align: center;
  width: 100%;
  height: 100%;
  color: white;
  padding: 10px;
  background-color: #2c3e50;
  border-radius: 20px;
  
}

.ant-btn {
  background-color: white;
}

/* @media (min-width: 360px) and (max-width: 640px) {
  .ant-layout-content{
    display: none;
  }
} */
</style>
