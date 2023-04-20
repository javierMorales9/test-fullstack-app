export interface CancelTokenAttr {
  cancel?: any;
  token?: any;
}

export interface FormData<FormDataValue> {
  append(name: string, value: FormDataValue, fileName?: string): void;
  set(name: string, value: FormDataValue, fileName?: string): void;
}
