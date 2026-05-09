import { Resource } from "halfred";

export interface AuthorityEntity {
    authority: string;
}

export interface UserEntity {
    uri?: string;
    username: string;
    email?: string;
    name?: string;
    location?: string;
    twitter?: string;
    instagram?: string;
    password?: string;
    authorities?: AuthorityEntity[];
}

export type User = UserEntity & Resource;
