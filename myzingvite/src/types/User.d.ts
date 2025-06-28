export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  gender: string;
  picture: string;
  deleted: boolean;
  role: "USER" | "ADMIN";
}

export interface UserRegister {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  gender: string;
}