<template>
  <q-table
    :rows="rows"
    :columns="columns"
    row-key="id"
    :filter="filter"
    :loading="loading"
    separator="cell"
    :title="label"
    class="q-px-lg"
    :pagination="{ rowsPerPage: 20, sortBy: 'sort', descending: true }"
  >
    <template v-slot:loading>
      <q-inner-loading showing color="primary" />
    </template>

    <template #top-right>
      <q-btn
        color="green"
        icon="add"
        :stretch="true"
        @click="$emit('addItem', this.type)"
      >
        Добавить элемент
      </q-btn>
      <div class="q-px-lg" />
      <q-input v-model="filter" outlined dense placeholder="Поиск">
        <template #append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>

    <template #body-cell-memory="props">
      <q-td class="text-center">
        <div v-for="(item, key) in props.row.memory" :key="key">
          {{ item.name }}: {{ item.price }} р.
        </div>
      </q-td>
    </template>

    <template #body-cell-status="props">
      <q-td class="text-center">
        <div v-for="(item, key) in props.row.status" :key="key">
          {{ item }} р.
        </div>
      </q-td>
    </template>

    <template #body-cell-equipment="props">
      <q-td class="text-center">
        <div v-for="(item, key) in props.row.equipment" :key="key">
          {{ item.name }}: {{ item.price }} р.
        </div>
      </q-td>
    </template>

    <template #body-cell-action="props">
      <q-td class="text-center">
        <q-btn
          dense
          flat
          round
          color="blue"
          icon="edit"
          @click="$emit('editItem', props.row)"
        />
        <q-btn
          dense
          flat
          round
          color="red"
          icon="delete"
          @click="$emit('deleteItem', props.row)"
        />
      </q-td>
    </template>

    <template #body-cell-published="props">
      <q-td class="text-center">
        <q-toggle
          v-model="props.row.published"
          dense
          flat
          round
          color="blue"
          field="published"
          @update:model-value="$emit('changePublished', props.row)"
        />
      </q-td>
    </template>
  </q-table>
</template>

<script>
export default {
  name: "CustomTable",

  props: {
    label: { type: String, default: "" },
    columns: { type: Array, default: new Array(), required: true },
    rows: { type: Array, default: new Array(), required: true },
    type: { type: String, default: "", required: true },
    loading: { type: Boolean, default: false, required: true },
  },

  data: function () {
    return {
      filter: "",
    };
  },

  methods: {},
};
</script>

<style></style>
