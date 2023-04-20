export interface LoginAttr {
  email: string;
  password: string;
}

export interface RegisterAttr {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface ForgotPasswordAttr {
  email: string;
}

export interface ResetPasswordAttr {
  password: string;
}
