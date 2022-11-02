<template>
  <q-item class="q-pb-none">
    <q-item-section>
      <q-select
        v-model="selected"
        :options="options"
        :label="label"
        filled
        style="margin-bottom: 20px"
      />
    </q-item-section>

    <q-item-section>
      <q-input
        v-model.number="price"
        type="number"
        step="10"
        :rules="[rules.intNumber]"
        label="Цена"
        filled
        @keydown.enter.prevent="addItem"
      ></q-input>
    </q-item-section>

    <q-btn
      icon="save"
      color="primary"
      class="q-ml-md"
      style="margin-bottom: 20px"
      :stretch="true"
      @click="addItem"
    />
  </q-item>

  <div class="q-ml-lg">
    <div v-for="(item, key) in items" :key="key" class="text-body1 q-mb-sm">
      {{ key + 1 }}) {{ item.name }}: {{ item.price }} р.
    </div>
  </div>
</template>

<script>
export default {
  name: "CustomSelect",

  props: {
    label: { type: String, default: "", required: true },
    options: { type: Array, default: new Array(), required: true },
    rules: { type: Object, default: new Object(), required: true },
    modelValue: { type: Array, default: new Array(), required: true },
  },

  data() {
    return {
      selected: "",
      price: 0,
    };
  },

  emits: ["update:modelValue"],

  computed: {
    items: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit("update:modelValue", val);
      },
    },
  },

  methods: {
    addItem() {
      if (this.selected) {
        let index = this.items.findIndex((item) => item.name === this.selected);

        if (index === -1) {
          if (this.price > 0) {
            this.items.push({ name: this.selected, price: this.price });
          }
        } else {
          if (this.price > 0) {
            this.items[index].price = this.price;
          } else {
            this.items.splice(index, 1);
          }
        }

        this.items.sort(
          (a, b) => this.options.indexOf(a.name) - this.options.indexOf(b.name)
        );
      }
    },
  },
};
</script>

<style></style>
