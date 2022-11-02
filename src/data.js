const columns = [
  {
    name: "id",
    field: "id",
    label: "Id",
    align: "center",
    sortable: true,
  },
  {
    name: "name",
    field: "name",
    label: "Название",
    align: "center",
  },
  {
    name: "baseprice",
    field: "baseprice",
    label: "Базовая цена",
    align: "center",
  },
  {
    name: "memory",
    field: "memory",
    label: "Память",
    align: "center",
  },
  {
    name: "status",
    field: "status",
    label: "Состояние",
    align: "center",
  },
  {
    name: "equipment",
    field: "equipment",
    label: "Комплектация",
    align: "center",
  },
  {
    name: "sort",
    field: "sort",
    label: "Сортировка",
    align: "center",
    sortable: true,
  },
  {
    name: "action",
    field: "action",
    label: "Изменить",
    align: "center",
  },
  {
    name: "published",
    field: "published",
    label: "Опубликован",
    align: "center",
  },
];

const rules = {
  intNumber: (val) =>
    (Number.isInteger(Number(val)) && Math.sign(Number(val) > -1)) ||
    "Только целые и положительные числа!",
  required: (val) => !!val || "Поле обязательно для заполнения!",
  requiredNumber: (val) =>
    Number.isInteger(val) || "Поле обязательно для заполнения!",
  minText: (val) => val.length > 2 || "Не короче 3х символов!",
  maxText: (val) => val.length < 89 || "Не длинее 90 символов!",
};

const statusFields = [
  "Ужасное",
  "Плохое",
  "Нормальное",
  "Хорошее",
  "Идеальное",
];

const memoryOptions = [
  "8Гб",
  "16Гб",
  "32Гб",
  "64Гб",
  "128Гб",
  "256Гб",
  "512Гб",
  "1Тб",
  "2Тб",
];

const equipmentOptions = ["Коробка", "Адаптер питания", "Кабель", "Наушники"];

export { columns, rules, statusFields, memoryOptions, equipmentOptions };
