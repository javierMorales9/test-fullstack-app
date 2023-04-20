export interface Result<F, S> {
  isSuccess(): boolean;
  isFail(): boolean;
  success(): S;
  fail(): F;
}

export interface ResultResponse {
  isSuccess(): boolean;
  isFail(): boolean;
  success(): any;
  fail(): any;
}
