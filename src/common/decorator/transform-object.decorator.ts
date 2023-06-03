import { Transform } from "class-transformer";

export function TransformObject(toArray: boolean) {
  return Transform(({ value }) => {
    try {
      if (typeof value === "string") {
        if (toArray) {
          return value[0] === "[" ? JSON.parse(value) : JSON.parse("[" + value + "]");
        }

        return JSON.parse(value);
      }
      return value;
    } catch (err) {
      console.log(err);
      return value;
    }
  });
}
