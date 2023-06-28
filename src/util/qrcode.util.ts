import * as qrcode from "qrcode";
import { createCanvas, Image, loadImage } from "canvas";
import { IQrcode } from "./interface";

export const generate = async (data: IQrcode) => {
  const canvas = createCanvas(data.size, data.size);
  qrcode.toCanvas(canvas, data.content, {
    errorCorrectionLevel: "H",
    margin: 1,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
  });

  let img;
  let center;
  const ctx = canvas.getContext("2d");
  if (data.embed) {
    const image = new Image();
    image.src = data.embed;
    image.onload = () => {
      ctx.drawImage(
        image,
        canvas.width / 2 - data.center_size / 2,
        canvas.height / 2 - data.center_size / 2,
        data.center_size,
        data.center_size,
      );
    };
  }
  if (data.embed) img = await loadImage(data.embed);
  if (data.center_size) center = (data.size - data.center_size) / 2;
  if (data.embed) ctx.drawImage(img, center, center, data.center_size, data.center_size);
  return canvas.toDataURL("image/png");
};
