import { IUploadFile } from "./interface";
import { HttpException, HttpStatus } from "@nestjs/common";
import { HttpMessage, IOutputResponse, ValidationMessage } from "../common";
import { parseStringToByte } from "./function.util";
import * as mkdir from "mkdirp";
import * as fs from "fs-extra";

export const UploadFile = async (params: IUploadFile) => {
  if (params.file) {
    params.filename = params.filename.replace(/ /g, "-");
    const err: IOutputResponse = {
      code: HttpStatus.UNPROCESSABLE_ENTITY,
      status: false,
      msg: HttpMessage.validationError,
    };

    if (!params.allowedExt.includes(params.ext)) {
      err.error = { [params.field]: ValidationMessage.extNotAllowed(...params.allowedExt) };
      throw new HttpException(err, err.code);
    }

    if (params.file.byteLength > parseStringToByte(params.allowedSize)) {
      err.error = { [params.field]: ValidationMessage.maxSize(params.allowedSize) };
      throw new HttpException(err, err.code);
    }

    mkdir.sync(params.folder);
    fs.writeFileSync(params.folder + params.filename, params.file, "binary");

    return params.folder + params.filename;
  }
};

export const RollbackFile = async (file: string[] | string) => {
  if (file || file?.length) {
    if (typeof file === "object") {
      file.map((item) => {
        if (fs.existsSync(item)) fs.removeSync("./" + item);
      });
    } else {
      if (fs.existsSync(file)) fs.removeSync("./" + file);
    }
  }
};
