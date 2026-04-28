import {test} from '../../main/fixture/basefixture.js'
import { DBUtils } from '../../main/utils/dbutils.js'

test("postgres db test- select", async ({dbUtils})=>{
    const data = await dbUtils.getPGDBData("SELECT * FROM users");
    console.log("Postgres Data:", data);
});

test.only("postgres db test -insert ", async ({dbUtils})=>{
    const data = await dbUtils.executeQueryInPG('insert', 'users', [
        { name: 'John Doe', email: 'johndoe123@example.com' }
    ]);
    console.log("Postgres Data:", data);
});

test("mysql db test", async ({dbUtils})=>{
    const data = await dbUtils.getMYSQLDBData("SELECT * FROM users");
    console.log("MySQL Data:", data);
});