export const filterAttrs = (
  obj: any,
  toRemove: any,
  oclusive: boolean = true
) => {
  const newObj: any = {};
  for (var attr in obj) {
    if (!oclusive === toRemove.includes(attr)) {
      newObj[attr] = obj[attr];
    }
  }
  return newObj;
};

export const getEntityProperties = (Entity: any) => {
  const newObj: any = {};
  for (var attr in Entity) {
    if (typeof Entity[attr] !== "function") newObj[attr] = Entity[attr];
  }
  return newObj;
};

export const capitalize = (label: string, pluralize: boolean = false) => {
  return (
    label[0].toUpperCase() +
    label.slice(1).toLowerCase() +
    (pluralize ? "s" : "")
  );
};

export const Mapfy = (object: any) => new Map(Object.entries(object));

export const settingName = (value: any) =>
  "set" + value.slice(0, 1).toUpperCase() + value.slice(1);

export const getActionTypes = (object: any) => {
  const actionTypes: any = {};
  for (var key of object.keys()) {
    actionTypes[settingName(key)] = settingName(key);
  }
  actionTypes["reset"] = "reset";
  return actionTypes;
};

export const setEnums = (enums: string[], entity: any = {}) => {
  // enums = [...enums, "reset"];
  const types: any = {};
  enums.forEach((E: any) => (types[E] = E));
  return Object.freeze({ ...types });
};

export const Enumfy = (object: Array<String> | Object) => {
  const enumObj: any = {};
  if (Array.isArray(object)) object.forEach((i: string) => (enumObj[i] = i));
  return Object.freeze(enumObj);
};

export const execFunc = async(func: Function | any) => {
  typeof func === "function"
    ? await func()
    : console.log("Not implemented yet!".red);
};