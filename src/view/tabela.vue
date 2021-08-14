<template>
  <a-table :columns="columns" :data-source="funcionarios" id="tab">
    <a slot="name" slot-scope="text">{{ text }}</a>
  </a-table>
</template>
<script>

import Funcionario from '../services/funcionarios';

const columns = [
  {
    title: 'cpf',
    dataIndex: 'cpf',
    key: 'cpf',
    scopedSlots: { customRender: 'cpf' },
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

const funcionarios = [];

export default {
  data() {
    return {
      funcionarios,
      columns,
    };
  },
  mounted() {
    Funcionario.listar().then(resposta => {
      console.log(resposta.data);
      this.funcionarios = resposta.data;
    })
  }
};
</script>
<style>
#tab{
    height: 100%;
}
</style>