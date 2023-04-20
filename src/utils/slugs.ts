import {
  numericValidatorOptions,
  stringValidatorOptions,
} from "~/components/Automation/constants";
import { getSlugsAPI } from "../apis/slugs";

let instance;

class SlugsStore {
  slugs: any[];

  constructor() {
    if (instance) {
      throw new Error("New instance can't be created");
    }
    instance = this;
    instance.slugs = [];
    getSlugsAPI().then((res) => {
      if (res.success()) instance.slugs.push(...res.success());
    });
  }
}

let slugHolder = Object.freeze(new SlugsStore());

export function getSlugOptions(_slugs) {
  return _slugs.map((f) => ({
    label: f.name,
    id: f.name,
  }));
}

export function getSlugType(slugs, slugName) {
  const filtered = slugs.filter((s) => s.name === slugName);
  return filtered.length ? filtered[0].type : "";
}

export function getValidatorOptions(slugType) {
  switch (slugType) {
    case SlugTypes.NPS:
      return numericValidatorOptions;
    case SlugTypes.CTA:
      return [];
    case SlugTypes.OPENTEXT:
      return stringValidatorOptions;
    case SlugTypes.SELECT:
      return stringValidatorOptions;
    default:
      return [];
  }
}

const SlugTypes = {
  NPS: "nps-response",
  CTA: "cta-response",
  OPENTEXT: "opentext-response",
  SELECT: "select-response",
};

export default slugHolder;
