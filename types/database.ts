export type databaseConfig = {
  user?: string;
  password?: string;
  host?: string;
  port?: number;
  database?: string;
  ssl?: boolean;
};

export type QueryConfig = {
  text: string;
  values?: Array<any>;
  name?: string;
  rowMode?: string;
};
