export class UserRequest {
  public id?: string;
  public firstName: string;
  public lastName: string;
  public email: string;
  public password: string;

  constructor(data: any) {
    if (
      !data.firstName ||
      typeof data.firstName !== "string" ||
      !data.lastName ||
      typeof data.lastName !== "string" ||
      !data.email ||
      typeof data.email !== "string" ||
      !data.password ||
      typeof data.password !== "string"
    )
      throw new Error("Bad user data");

    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.password = data.password;
    this.id = data.id;
  }
}
