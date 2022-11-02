<template>
  <customTable
    v-for="(group, key) in this.groups"
    :key="key"
    :type="key"
    :label="key"
    :rows="group"
    :columns="columns"
    :loading="loading"
    @addItem="addItem"
    @editItem="editItem"
    @deleteItem="deleteItem"
    @changePublished="changePublished"
    style="margin-top: 8px"
  />

  <q-dialog v-model="showDialog" noBackdropDismiss>
    <q-card style="width: 100%; max-width: 1000px">
      <q-card-section>
        <q-btn
          round
          flat
          dense
          icon="close"
          class="float-right"
          color="grey-8"
          v-close-popup
        />
        <div class="text-h6">Редактировать</div>
      </q-card-section>
      <q-separator inset />

      <q-form @submit="saveItem">
        <q-card-section>
          <q-list>
            <q-item>
              <q-item-section>
                <q-input
                  label="Название"
                  v-model="editedItem.name"
                  type="text"
                  :rules="[rules.required, rules.minText, rules.maxText]"
                  filled
                />
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-input
                  label="Базовая цена"
                  v-model.number="editedItem.baseprice"
                  type="number"
                  step="10"
                  :rules="[rules.requiredNumber, rules.intNumber]"
                  filled
                />
              </q-item-section>
            </q-item>

            <CustomSelect
              label="Память"
              :options="memoryOptions"
              :rules="rules"
              v-model="editedItem.memory"
            />

            <q-item-label class="q-pl-md q-pt-md">Состояние</q-item-label>
            <q-item>
              <q-item-section v-for="(field, key) in statusFields" :key="key">
                <q-input
                  :label="field"
                  v-model.number="editedItem.status[key]"
                  type="number"
                  step="10"
                  :rules="[rules.requiredNumber, rules.intNumber]"
                  filled
                />
              </q-item-section>
            </q-item>

            <CustomSelect
              label="Комплектация"
              :options="equipmentOptions"
              :rules="rules"
              v-model="editedItem.equipment"
            />

            <q-item class="q-py-md">
              <q-item-section>
                <q-input
                  label="Сортировка"
                  v-model.number="editedItem.sort"
                  type="number"
                  filled
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="OK" color="green" type="submit" dense />
          </q-card-actions>
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import CustomTable from "@/components/CustomTable.vue";
import CustomSelect from "@/components/CustomSelect.vue";
import axios from "axios";

import {
  columns,
  rules,
  statusFields,
  memoryOptions,
  equipmentOptions,
} from "./data.js";

export default {
  components: {
    CustomTable,
    CustomSelect,
  },

  data() {
    return {
      columns: columns,
      rows: [],
      loading: false,
      showDialog: false,
      editedKey: -1,
      editedItem: {},
      rules: rules,
      statusFields: statusFields,
      memoryOptions: memoryOptions,
      equipmentOptions: equipmentOptions,
    };
  },

  mounted() {
    if (window.TradeInConfig) {
      axios.defaults.baseURL = window.TradeInConfig.connector_url;
      axios.defaults.headers.common["modAuth"] = window.TradeInConfig.modAuth;

      axios.interceptors.response.use(
        (response) => {
          if (response.data.success && response.data.success == true) {
            if (response.data.object) delete response.data.object.action;
            this.loading = false;
            return response;
          } else {
            return Promise.reject();
          }
        },

        (error) => {
          return Promise.reject(error);
        }
      );

      this.http("getlist", (response) => {
        this.rows = response.data.results;
      });
    } else {
      this.$q.notify({
        type: "negative",
        position: "top-right",
        message: "Произошла серьезная ошибка!",
      });
    }
  },

  computed: {
    groups() {
      let groups = {};
      this.rows.forEach((item) => {
        if (!groups[item.type]) {
          groups[item.type] = [];
        }
        groups[item.type].push(item);
      });
      return groups;
    },
  },

  methods: {
    http(action, callback, data) {
      this.loading = true;
      axios
        .get("?action=mgr/item/" + action, { params: data })
        .then(callback)
        .catch(() => {
          this.$q.notify({
            type: "negative",
            position: "top-right",
            message: "ОШИБКА!",
          });
        });
    },

    addItem(type) {
      this.editItem({ id: "new", type: type });
    },

    editItem(item) {
      this.editedKey = this.rows.indexOf(item);
      this.editedItem = JSON.parse(JSON.stringify(item));

      if (
        !(
          Array.isArray(this.editedItem.status) &&
          this.editedItem.status.length === 5
        )
      ) {
        this.editedItem.status = [0, 0, 0, 0, 0];
      }

      if (!Array.isArray(this.editedItem.memory)) {
        this.editedItem.memory = [];
      }

      if (!Array.isArray(this.editedItem.equipment)) {
        this.editedItem.equipment = [];
      }

      this.showDialog = true;
    },

    saveItem() {
      this.showDialog = false;
      this.editedItem.published = 1;

      this.editedItem.status.sort((a, b) => a - b);

      for (var key in this.editedItem) {
        if (typeof this.editedItem[key] === "object") {
          this.editedItem[key] = JSON.stringify(this.editedItem[key]);
        }
      }

      if (this.editedKey > -1) {
        this.http(
          "update",
          (response) => {
            this.rows[this.editedKey] = response.data.object;
          },
          this.editedItem
        );
      } else {
        this.http(
          "create",
          (response) => {
            this.rows.push(response.data.object);
          },
          this.editedItem
        );
      }
    },

    deleteItem(item) {
      this.$q
        .dialog({
          title: "Подтвердите удаление",
          message: "Вы точно хотите удалить?",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          this.http(
            "remove",
            () => {
              this.rows.splice(this.rows.indexOf(item), 1);
            },
            { id: item.id }
          );
        });
    },

    changePublished(item) {
      this.http(
        item.published ? "enable" : "disable",
        (response) => {
          item.published = response.data.object.published;
        },
        { id: item.id }
      );
    },
  },
};
</script>

<style></style>
