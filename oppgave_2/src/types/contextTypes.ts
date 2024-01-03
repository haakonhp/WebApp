import {type User} from "@/types/user";

export type resourceRequestById = { params: { id: string } };
export type resourceByUserAndTemplate = { params: { user: string, template: string } }
export type resourceByIdAndTemplate = { params: { id: string, template: string } }
export type UserChange = Partial<User> & {
    id: string
}