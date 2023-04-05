import { ConnectOptions } from "mongoose";
import { Buffer } from "https://deno.land/std/io/mod.ts";

export interface MongoDbSSLSettings {
  folderPath: string;
  caFileName: string;
  certFileName: string;
  keyFileName: string;
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
