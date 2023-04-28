import { ConnectOptions } from "mongoose";
import { Buffer } from "buffer";

export interface MongoDbSSLSettings {
  folderPath: string;
  caFileName: string;
  certFileName: string;
  keyFileName: string;
}

export type PaginatedList<T> = {
  docs: Array<T>;
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface SSL_Certs {
  certificateAuthority: Buffer;
  domainCertificate: Buffer;
  privateKey: Buffer;
}

export interface MongoConfigOptions {
  host: string;
  port: number;
  sslEnabled: boolean;
  auth: {
    username: string;
    password: string;
  };
  dbName: string;
}

export enum ENV_VARIABLE_TYPE {
  string = "string",
  number = "number",
  boolean = "boolean",
}

export type OdmConnectionParams = {
  uri: string;
  options: ConnectOptions | undefined;
};

export type EnvValue = string | number | boolean | undefined;
