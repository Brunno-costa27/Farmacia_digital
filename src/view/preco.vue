<template>
  <a-table :columns="columns" :data-source="requisições" bordered id="tabela">
   
  </a-table>
</template>
<script>

import Funcionario from '../services/funcionarios'
const columns = [
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

const requisições = [];

export default {
  data() {
    return {
      requisições,
      columns,
    };
  },
   mounted() {
    Funcionario.listar1().then(resposta => {
      console.log(resposta.data);
      this.requisições = resposta.data;
    })
  },
  methods: {
    handleChange(value, key, column) {
      const newData = [...this.data];
      const target = newData.filter(item => key === item.key)[0];
      if (target) {
        target[column] = value;
        this.data = newData;
      }
    },
    edit(key) {
      const newData = [...this.data];
      const target = newData.filter(item => key === item.key)[0];
      this.editingKey = key;
      if (target) {
        target.editable = true;
        this.data = newData;
      }
    },
    save(key) {
      const newData = [...this.data];
      const newCacheData = [...this.cacheData];
      const target = newData.filter(item => key === item.key)[0];
      const targetCache = newCacheData.filter(item => key === item.key)[0];
      if (target && targetCache) {
        delete target.editable;
        this.data = newData;
        Object.assign(targetCache, target);
        this.cacheData = newCacheData;
      }
      this.editingKey = '';
    },
    cancel(key) {
      const newData = [...this.data];
      const target = newData.filter(item => key === item.key)[0];
      this.editingKey = '';
      if (target) {
        Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
        delete target.editable;
        this.data = newData;
      }
    },
  },
};
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
#tabela{
  width: 100%;
  height: 100%;
}
</style>
