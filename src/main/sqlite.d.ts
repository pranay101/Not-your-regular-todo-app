declare module "sqlite3" {
  export const Database: any;
  export const Statement: any;
}

declare module "sqlite" {
  export function open(config: any): Promise<any>;
}

declare module "better-sqlite3" {
  interface Database {
    prepare(sql: string): Statement;
    transaction(fn: Function): Function;
    pragma(pragma: string, options?: { simple?: boolean }): any;
    checkpoint(databaseName?: string): void;
    function(name: string, fn: Function): void;
    aggregate(
      name: string,
      options: { start: Function; step: Function; result: Function }
    ): void;
    loadExtension(path: string): void;
    exec(sql: string): void;
    close(): void;
    defaultSafeIntegers(toggleState?: boolean): Database;
    backup(
      destination: string | Database,
      options?: { attached?: string; progress?: Function }
    ): Promise<void>;
  }

  interface Statement {
    run(...params: any[]): {
      changes: number;
      lastInsertRowid: number | bigint;
    };
    get(...params: any[]): any;
    all(...params: any[]): any[];
    iterate(...params: any[]): IterableIterator<any>;
    pluck(toggleState?: boolean): Statement;
    expand(toggleState?: boolean): Statement;
    raw(toggleState?: boolean): Statement;
    bind(...params: any[]): Statement;
    columns(): { name: string; column: string | null }[];
    safeIntegers(toggleState?: boolean): Statement;
  }

  export default function (
    filename: string,
    options?: {
      readonly?: boolean;
      fileMustExist?: boolean;
      timeout?: number;
      verbose?: Function;
    }
  ): Database;
}

declare module "sqlite3" {
  export const OPEN_READONLY: number;
  export const OPEN_READWRITE: number;
  export const OPEN_CREATE: number;
  export const OPEN_FULLMUTEX: number;
  export const OPEN_URI: number;
  export const OPEN_SHAREDCACHE: number;
  export const OPEN_PRIVATECACHE: number;
  export const OPEN_NOFOLLOW: number;

  export class Database {
    constructor(
      filename: string,
      mode?: number,
      callback?: (err: Error | null) => void
    );
    run(
      sql: string,
      params?: any,
      callback?: (err: Error | null) => void
    ): this;
    get(
      sql: string,
      params?: any,
      callback?: (err: Error | null, row: any) => void
    ): this;
    all(
      sql: string,
      params?: any,
      callback?: (err: Error | null, rows: any[]) => void
    ): this;
    each(
      sql: string,
      params?: any,
      callback?: (err: Error | null, row: any) => void,
      complete?: (err: Error | null, count: number) => void
    ): this;
    exec(sql: string, callback?: (err: Error | null) => void): this;
    prepare(
      sql: string,
      params?: any,
      callback?: (err: Error | null, statement: Statement) => void
    ): Statement;
    close(callback?: (err: Error | null) => void): void;
    configure(option: string, value: any): void;
    serialize(callback?: () => void): void;
    parallelize(callback?: () => void): void;
  }

  export class Statement {
    bind(params: any, callback?: (err: Error | null) => void): this;
    reset(callback?: (err: Error | null) => void): this;
    finalize(callback?: (err: Error | null) => void): void;
    run(params?: any, callback?: (err: Error | null) => void): this;
    get(params?: any, callback?: (err: Error | null, row: any) => void): this;
    all(
      params?: any,
      callback?: (err: Error | null, rows: any[]) => void
    ): this;
    each(
      params?: any,
      callback?: (err: Error | null, row: any) => void,
      complete?: (err: Error | null, count: number) => void
    ): this;
  }
}

declare module "sqlite" {
  export interface Database {
    open(): Promise<Database>;
    close(): Promise<void>;
    exec(sql: string): Promise<void>;
    get(sql: string, params?: any): Promise<any>;
    all(sql: string, params?: any): Promise<any[]>;
    run(
      sql: string,
      params?: any
    ): Promise<{ lastID: number; changes: number }>;
    each(
      sql: string,
      params?: any,
      callback?: (err: Error | null, row: any) => void
    ): Promise<number>;
    prepare(sql: string, params?: any): Promise<Statement>;
    migrate(options: {
      force?: boolean;
      migrationsPath?: string;
    }): Promise<void>;
  }

  export interface Statement {
    bind(params: any): Promise<Statement>;
    reset(): Promise<Statement>;
    finalize(): Promise<void>;
    run(params?: any): Promise<{ lastID: number; changes: number }>;
    get(params?: any): Promise<any>;
    all(params?: any): Promise<any[]>;
    each(
      params?: any,
      callback?: (err: Error | null, row: any) => void
    ): Promise<number>;
  }

  export function open(
    filename: string,
    options?: { mode?: number; verbose?: boolean; promise?: typeof Promise }
  ): Promise<Database>;
}
