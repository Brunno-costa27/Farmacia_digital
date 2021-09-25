
<template>
  <div id="container">
    <a-form
      id="components-form-demo-normal-login"
      :form="form"
      class="login-form"
      @submit="handleSubmit"
      @click="activeError"
    >
      <a-form-item>
        <a-avatar :size="64" icon="user" id="avatar" />
        <a-input
          placeholder="Insira seu cpf"
          type="text"
          v-mask="'###.###.###-##'"
          v-model="cpf"
          required
        >
          <a-icon
            slot="prefix"
            type="user"
            style="color: rgba(0, 0, 0, 0.25)"
          />
        </a-input>
      </a-form-item>

      <a-form-item>
        <a-input
          type="password"
          placeholder="Insira uma senha"
          v-model="senha"
          required
        >
          <a-icon
            slot="prefix"
            type="lock"
            style="color: rgba(0, 0, 0, 0.25)"
          />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button
          style="background-color: white"
          color="white"
          html-type="submit"
          class="login-form-button"
        >
          Entrar
          <div v-if="active">
            <router-link to="/painel"></router-link>
            <router-view />
          </div>
        </a-button>
      </a-form-item>
      <a-alert v-if="active" type="error" v-text="message" />
    </a-form>
  </div>
</template>

<script>
import axios from "axios";
import Funcionario from "../services/funcionarios";
export default {
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "normal_login" });
  },
  data() {
    return {
      cpf: "",
      senha: "",
      message: null,
      active: false,
    };
  },

  mounted() {
    this.login();
  },

  methods: {
    handleSubmit(e) {
      e.preventDefault();
      axios
        .post(`http://localhost:3333/autenticacao`, {
          cpf: this.cpf,
          senha: this.senha,
        })
        .then((res) => {
          this.message = res.data.message;
          // console.log(res);
          // console.log(res.data);
          // console.log(res.data.message);
          this.activeError();
        })
        .catch((e) => {
          console.log(e);
        });
    },
    activeError() {
      if (this.message === "paciente não existe!") {
        this.active = true;
        this.cpf = "";
        this.senha = "";
      } else if (this.message === "seja bem vindo!") {
        this.login();
        this.$router.push({ name: "painel", params: { cpf: this.cpf } });
      }
    },

    login() {
      // console.log(Funcionario.user);
      Funcionario.user = this.cpf;
    },
  },
};
</script>
<style>
#components-form-demo-normal-login .login-form {
  max-width: 300px;
}
#components-form-demo-normal-login .login-form-forgot {
  float: right;
}
#components-form-demo-normal-login .login-form-button {
  width: 100%;
  color: #aeb0b4;
}

#avatar {
  margin-bottom: 30px;
  background-color: #2c3e50;
}

#container {
  background-color: white;
  padding: 30px;
  height: 400px;
  border-radius: 10px;
}
</style>

