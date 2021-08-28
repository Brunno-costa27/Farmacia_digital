<template>
  <div id="components-modal-demo-position">
    <br /><br />
    <a-button type="primary" @click="() => (modal2Visible = true)">
      Aperte aqui
    </a-button>
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

          <a-form-item v-bind="formItemLayout" label="cargo" has-feedback>
            <a-input v-model="cargo" required />
          </a-form-item>

          <a-form-item v-bind="formItemLayout" label="Senha" has-feedback>
            <a-input type="password" v-model="senha" required />
          </a-form-item>

          <a-form-item v-bind="formItemLayout">
            <a-button type="primary" html-type="submit" @click="voltar">
              Registrar
              <router-link to="/painel"></router-link>
              <router-view />
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>
<script>

import axios from "axios";

export default {
  data() {
    return {
      modal2Visible: false,
      nome: "",
      cpf: "",
      senha: "",
      cargo: "",
      messageError: null,
      message: null,
      active: false,
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
   beforeCreate() {
    this.form = this.$form.createForm(this, { name: "register" });
  },
  methods: {
    setModal1Visible(modal1Visible) {
      this.modal1Visible = modal1Visible;
    },
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
    activeError() {
      if (this.messageError === "funcionario already exists") {
        this.active = true;
        this.cpf = "";
        this.senha = "";
        this.cargo = "";
        this.nome = "";
      } else if (this.message === "cadastrado com sucesso!") {
        console.log("deu certo");
      }
    },
  },
};
</script>