export const parseStringToByte = (size: string) => {
  const [value, unit] = size.split(" ");

  let res = +value;
  switch (unit) {
    case "kb":
    case "kilobyte":
    case "kilobytes":
      res *= 1024;
      break;
    case "mb":
    case "megabyte":
    case "megabytes":
      res *= 1024 * 1024;
      break;
    case "gb":
    case "gigabyte":
    case "gigabytes":
      res *= 1024 * 1024 * 1024;
      break;
    default:
      break;
  }

  return res;
};

export const isNotEmpty = (value: any) => typeof value === "boolean" || value;

export const prepareQuery = (params: Record<string, any>, scopes: Record<string, any>) => {
  const limit = params.limit;
  const offset = (params.page - 1) * params.limit;
  const order = [];
  const where: Record<string, any> = {};
  let include = null;

  if (params.join) include = scopes[params.join];

  if (params.sort_field || params.sort_dir) order[0] = [];

  if (params.sort_field) order[0][0] = params.sort_field;
  if (params.sort_dir) order[0][1] = params.sort_dir;

  if (order[0] && order[0][0] && !order[0][1]) order[0][1] = "ASC";

  return { limit, offset, order, include, where };
};
