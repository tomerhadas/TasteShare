export interface UserDto {
  token(arg0: string, token: any): unknown;
  id: number;
  username: string;
  email: string;
  role: string; // "Member" | "Admin"
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}
