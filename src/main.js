import { createApp } from "vue";

import { Quasar, Notify, Dialog } from "quasar";
import quasarLang from "quasar/lang/ru";
import "@quasar/extras/material-icons/material-icons.css";
import "quasar/dist/quasar.css";

import App from "./App.vue";

createApp(App)
  .use(Quasar, { plugins: { Notify, Dialog }, lang: quasarLang })
  .mount("#customTradeIn");
