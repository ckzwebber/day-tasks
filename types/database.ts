export type databaseConfig = {
  user?: string;
  password?: string;
  host?: string;
  port?: number;
  database?: string;
};

export type QueryConfig = {
  text: string;
  values?: Array<any>;
  name?: string;
  rowMode?: string;
};
