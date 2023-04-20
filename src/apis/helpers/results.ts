import { Result } from "~/apis/interfaces/results";

const makeSuccess = (value: any) => ({
  isSuccess: () => true,
  isFail: () => false,
  success: () => value,
  fail: () => {
    throw new Error("Cannot call fail() on success.");
  },
});

const makeFail = (value: any) => ({
  isSuccess: () => false,
  isFail: () => true,
  success: () => {
    throw new Error("Cannot call success() on fail.");
  },
  fail: () => value,
});

export default {
  success: <F, S>(value: any): Result<F, S> => makeSuccess(value),
  fail: <F, S>(value: any): Result<F, S> => makeFail(value),
};
