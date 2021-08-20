<template>
  <a-form :form="form" @submit="handleSubmit" id="components-form-demo-normal-login"  class="login-form">
    <a-form-item  label="Nome">
      <a-input
        v-model="nome"
        required
      />
    </a-form-item>

      <a-form-item label="cpf" has-feedback v-mask="'###.###.###-##'">
      <a-input
        v-model="cpf"
        required
      />
    </a-form-item>

      <a-form-item label="cargo" has-feedback>
      <a-input
        v-model="cargo"
        required
      />
    </a-form-item>

    <a-form-item  label="Senha" has-feedback>
      <a-input
        type="password"
        v-model="senha"
        required
      />
    </a-form-item>


    <a-form-item >

    </a-form-item>
    <a-form-item  >
      <a-button type="primary"  html-type="submit" class="login-form-button">
        Registrar
         <div v-if="active">
          <router-link  to="/painel"></router-link>
          <router-view />
        </div>
      </a-button >
      <a-alert v-if="active" type="error" v-text="messageError" />
    </a-form-item>
  </a-form>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
        nome:'',
        cpf: '',
        senha: '',
        cargo: '',
        messageError: null,
        message: null,
        active: false,
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'register' });
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
        axios.post(`http://localhost:3333/funcionario`, {
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
        this.cargo =  "";
        this.nome = "";
      } else if (this.message === "cadastrado com sucesso!") {
        console.log('deu certo');
      }
    },
    }
}

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
}
</style>>