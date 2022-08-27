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
