import { Pool } from 'pg'
import mysql from 'mysql2/promise'
import { getEnv, buildBulkInsertQuery, buildBulkUpdateQuery, buildDeleteQuery } from './baseutils';
type Operation = 'select' | 'insert' | 'update' | 'delete';
type Row = Record<string, unknown>;

export class DBUtils {

    private pgSQL: Pool;
    private mySQL: mysql.Pool;


    constructor() {

        //configure postgres connection pool
        this.pgSQL = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASS,
            port: parseInt(process.env.DB_PORT || '5432'),
        });

        //configure mysql connection pool
        this.mySQL = mysql.createPool({
            host: getEnv('MYSQL_DB_HOST'),
            user: getEnv('MYSQL_DB_USER'),
            password: getEnv('MYSQL_DB_PASS'),
            database: getEnv('MYSQL_DB_NAME'),
            port: Number(getEnv('MYSQL_DB_PORT')),
        });


    }

    //connect postgres and mysql database and fetch data

    async getPGDBData(query: string): Promise<any> {
        const data = await this.pgSQL.query(query);
        return data.rows;
    }


    async executeQueryInPG(
        operation: Operation,
        tableName: string,
        data?: Row[],
        where?: Row
    ): Promise<unknown> {

        // Whitelist table names to prevent SQL injection on identifiers
        if (!/^[a-zA-Z_][a-zA-Z0-9_.]*$/.test(tableName)) {
            throw new Error(`Invalid table name: ${tableName}`);
        }

        switch (operation) {

            case 'select': {
                if (!where || Object.keys(where).length === 0) {
                    throw new Error("WHERE clause required for select");
                }

                const conditions = Object.keys(where)
                    .map((k, i) => `${k} = $${i + 1}`)
                    .join(' AND ');

                const result = await this.pgSQL.query(
                    `SELECT * FROM ${tableName} WHERE ${conditions}`,
                    Object.values(where)
                );

                return result.rows;
            }

            case 'insert': {
                if (!data || data.length === 0) {
                    throw new Error("Insert data required");
                }

                const insert = buildBulkInsertQuery(tableName, data);
                const result = await this.pgSQL.query(insert.query, insert.values);
                return result.rowCount;
            }

            case 'update': {
                if (!data || data.length === 0) {
                    throw new Error("Update data required");
                }
                if (!where || Object.keys(where).length === 0) {
                    throw new Error("WHERE clause required for update");
                }

                const matchKeys = Object.keys(where);
                const update = buildBulkUpdateQuery(tableName, data, matchKeys);

                // Append where values after the builder's own params
                const result = await this.pgSQL.query(
                    update.query,
                    [...update.values, ...Object.values(where)]
                );
                return result.rowCount;
            }

            case 'delete': {
                if (!where || Object.keys(where).length === 0) {
                    throw new Error("WHERE clause required for delete");
                }

                const del = buildDeleteQuery(tableName, where);
                const result = await this.pgSQL.query(del.query, del.values);
                return result.rowCount;
            }

            default:
                throw new Error(`Unsupported operation: ${operation as string}`);
        }
    }

    async executeOnlyQueryInPG(query: string): Promise<any> {
        let result: any = {};
        result = await this.pgSQL.query(query);
        return result.rows;
    }


    async InsertDataInPG(tableName: string, values: [Record<string, unknown>]): Promise<void> {
        const query = `insert into ${tableName} values (?,?)`
        await this.pgSQL.query(query, values);
    }

    async updateDataInPG(query: string, values: any[]): Promise<void> {
        await this.pgSQL.query(query, values);
    }

    async deleteDataInPG(query: string, values: any[]): Promise<void> {
        await this.pgSQL.query(query, values);
    }

    //connect mysql database and fetch data
    async getMYSQLDBData(query: string): Promise<any> {
        const [rows] = await this.mySQL.query(query);
        return rows;
    }

    async InsertDataInMYSQL(query: string, values: any[]): Promise<void> {

        if (values && values.length > 0) {
            await this.mySQL.query(query, values);
        } else {
            await this.mySQL.query(query);
        }

    }

    async updateDataInMYSQL(query: string, values: any[]): Promise<void> {
        if (values && values.length > 0) {
            await this.mySQL.query(query, values);
        } else {
            await this.mySQL.query(query, values);
        }
    }

    async deleteDataInMYSQL(query: string, values: any[]): Promise<void> {
        await this.mySQL.query(query, values);
    }

    async executeQueryInMYSQL(query: string, values?: any[]): Promise<any> {
        const [rows] = await this.mySQL.execute(query, values);
        return rows;
    }


}


