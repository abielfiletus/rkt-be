import { applyDecorators, SetMetadata } from "@nestjs/common";

export const IS_PUBLIC_KEY = "isPublic";
export const BYPASS_KEY = "bypass";
export const Public = (bypass = true) =>
  applyDecorators(SetMetadata(IS_PUBLIC_KEY, true), SetMetadata(BYPASS_KEY, bypass));
