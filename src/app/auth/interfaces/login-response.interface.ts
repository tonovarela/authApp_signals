import { User } from ".";



export interface LoginResponse {
    user:  User;
    token: string;
}

