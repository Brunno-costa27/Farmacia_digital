
<template>
   <a-table :columns="columns" :data-source="requisições" bordered id="tabela">
    <template
      v-for="col in ['name', 'age', 'address mexer aqui']" 
      :slot="col"
      slot-scope="text, record, "
    >
      <div :key="col">
        <a-input
          v-if="record.editable"
          style="margin: -5px 0"
          :value="text"
          @change="e => handleChange(e.target.value, record.key, col)"
        />
        <template v-else>
          {{ text }}
        </template>
      </div>
    </template>
    <template slot="operation" slot-scope="text, record, ">
      <div class="editable-row-operations">
        <span v-if="record.editable">
          <a @click="() => save(record.key)">Save</a>
          <a-popconfirm title="Sure to cancel?" @confirm="() => cancel(record.key)">
            <a>Cancel</a>
          </a-popconfirm>
        </span>
        <span v-else>
          <a :disabled="editingKey !== ''" @click="() => edit(record.key)">Editar</a>
        </span>
      </div>
    </template>
  </a-table>
</template>
<script>

import Funcionario from '../services/funcionarios'
// const columns = [
//   {
//     title: 'medicamento',
//     dataIndex: 'medicamento',
//     width: '15%',
//     scopedSlots: { customRender: 'medicamento' },
//   },
//   {
//     title: 'valor',
//     dataIndex: 'valor',
//     width: '15%',
//     scopedSlots: { customRender: 'valor' },
//   },
//   {
//     title: 'paciente',
//     dataIndex: 'paciente',
//     width: '40%',
//     scopedSlots: { customRender: 'paciente' },
//   },
//   {
//     title: 'data',
//     dataIndex: 'data_historico',
//     scopedSlots: { customRender: 'data_historico' },
//   },
//   {
//     title: 'telefone',
//     dataIndex: 'telefone',
//     scopedSlots: { customRender: 'telefone' },
//   },
//   {
//     title: 'operation',
//     dataIndex: 'operation',
//     scopedSlots: { customRender: 'operation' },
//   },
// ];

const columns = [
  {
    title: 'name',
    dataIndex: 'name',
    width: '25%',
    scopedSlots: { customRender: 'name' },
  },
  {
    title: 'age',
    dataIndex: 'age',
    width: '15%',
    scopedSlots: { customRender: 'age' },
  },
  {
    title: 'address',
    dataIndex: 'address',
    width: '40%',
    scopedSlots: { customRender: 'address' },
  },
  {
    title: 'operation',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
  },
];

const requisições = [];

for (let i = 0; i < 100; i++) {
  requisições.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}
export default {
  data() {
    this.cacheData = requisições.map(item => ({ ...item }));
    return {
      requisições,
      columns,
      editingKey: ''
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
      const newData = [...this.requisições];
      const target = newData.filter(item => key === item.key)[0];
      if (target) {
        target[column] = value;
        this.requisições = newData;
      }
    },
    edit(key) {
      const newData = [...this.requisições];
      const target = newData.filter(item => key === item.key)[0];
      this.editingKey = key;
      if (target) {
        target.editable = true;
        this.requisições = newData;
        console.log(this.requisições);
      }
    },
    save(key) {
      const newData = [...this.requisições];
      const newCacheData = [...this.cacheData];
      const target = newData.filter(item => key === item.key)[0];
      const targetCache = newCacheData.filter(item => key === item.key)[0];
      if (target && targetCache) {
        delete target.editable;
        this.requisições = newData;
        Object.assign(targetCache, target);
        this.cacheData = newCacheData;
        console.log(this.requisições);
      }
      this.editingKey = '';
    },
    cancel(key) {
      const newData = [...this.requisições];
      const target = newData.filter(item => key === item.key)[0];
      this.editingKey = '';
      if (target) {
        Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
        delete target.editable;
        this.requisições = newData;
        console.log(this.requisições);
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
