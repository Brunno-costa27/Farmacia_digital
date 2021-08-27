
<template>
  <a-table :columns="columns" :data-source="requisições" bordered id="tabela">
    <template v-for="col in ['valor']" :slot="col" slot-scope="text, record">
      <div :key="col">
        <a-input
          v-if="record.editable"
          style="margin: -5px 0"
          :value="text"
          @change="(e) => handleChange(e.target.value, record.id_historico, col)"
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
          <a :disabled="editingKey !== ''" @click="() => edit(record.id_historico)"
            >Editar</a
          >
        </span>
      </div>
    </template>
  </a-table>
</template>
<script>
import Funcionario from "../services/funcionarios";
const columns = [
 
  {
    title: "id_historico",
    dataIndex: "id_historico",
    width: "15%",
    scopedSlots: { customRender: "id_historico" },
  },
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
    title: "data_historico",
    dataIndex: "data_historico",
    scopedSlots: { customRender: "data_historico" },
  },
  {
    title: "telefone",
    dataIndex: "telefone",
    scopedSlots: { customRender: "telefone" },
  },
  {
    title: "operation",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
  },
];

// const columns = [
//   {
//     title: 'name',
//     dataIndex: 'name',
//     width: '25%',
//     scopedSlots: { customRender: 'name' },
//   },
//   {
//     title: 'age',
//     dataIndex: 'age',
//     width: '15%',
//     scopedSlots: { customRender: 'age' },
//   },
//   {
//     title: 'address',
//     dataIndex: 'address',
//     width: '40%',
//     scopedSlots: { customRender: 'address' },
//   },
//   {
//     title: 'operation',
//     dataIndex: 'operation',
//     scopedSlots: { customRender: 'operation' },
//   },
// ];

const requisições = [];

export default {
  data() {
    return {
      requisições,
      columns,
      chave: "",
      editingKey: "",
    };
  },
  mounted() {
    Funcionario.listar1().then((resposta) => {
      // console.log(resposta.data);
      this.requisições = resposta.data;
      for (let i in this.requisições) {
        console.log(this.requisições[i].id_historico);
      }
    });
        // this.cacheData = this.requisições.map((item) => ({ ...item }));
  },
  methods: {
    handleChange(value, id_historico, column) {
      const newData = [...this.requisições];
      const target = newData.filter(item => id_historico === item.id_historico)[0];
      console.log(id_historico, "aqui");
      if (target) {
        target[column] = value;
        console.log(value, "valor");
        this.requisições = newData;
      }
    },
    edit(id_historico) {
      const newData = [...this.requisições];
      const target = newData.filter(item => id_historico === item.id_historico)[0];
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
      const target = newData.filter(item => id_historico === item.id_historico)[0];
      console.log(target, 'target');
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
      const target = newData.filter(item => id_historico === item.id_historico)[0];
      this.editingKey = "";
      console.log(target, 'target do cancel');
      if (target) {
        Object.assign(target);
        delete target.editable;
        this.requisições = newData;
      }
    },
  },
};
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
#tabela {
  width: 100%;
  height: 100%;
}
</style>
