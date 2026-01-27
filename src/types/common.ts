export type Identifier = string | number;

export interface BaseEntity {
    id: Identifier;
    createdAt?: string;
    updatedAt?: string;
}

export interface Dictionary<T> {
    [key: string]: T;
}
