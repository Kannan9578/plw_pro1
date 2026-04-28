export function getEnv(key: string): string {
    const value = process.env[key];
    if (!value) throw new Error(`Missing env: ${key}`);
    return value;
}

export function buildBulkInsertQuery(table: string, data: Record<string, any>[]) {

    if (!data || data.length === 0) {
        throw new Error("Data array is empty");
    }

    const keys = Object.keys(data[0]!);
    const columns = keys.join(', ');
    let values: any[] = [];
    const valueGroups: string[] = [];

    data.forEach((row, rowIndex) => {
        const placeholders = keys.map((_, colIndex) => {
            return `$${rowIndex * keys.length + colIndex + 1}`;
        });

        valueGroups.push(`(${placeholders.join(', ')})`);
        values.push(...keys.map(k => row[k]));
    });

    const query = `INSERT INTO ${table} (${columns}) VALUES ${valueGroups.join(', ')}`;
    return { query, values };
}

export function buildInsertQuery(table: string, data: Record<string, any>) {
    const keys = Object.keys(data);
    const values = Object.values(data);

    // Safety check
    if (keys.length === 0) {
        throw new Error("No data provided");
    }

    // Build columns
    const columns = keys.join(', ');

    // Build placeholders: $1, $2, $3...
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

    const query = `
        INSERT INTO ${table} (${columns})
        VALUES (${placeholders})
    `;

    return { query, values };
}

export function buildUpdateQuery(
    table: string,
    data: Record<string, any>,
    where: Record<string, any>
) {
    const dataKeys = Object.keys(data);
    const whereKeys = Object.keys(where);

    if (dataKeys.length === 0) {
        throw new Error("No data to update");
    }

    if (whereKeys.length === 0) {
        throw new Error("WHERE condition is required");
    }

    // SET clause
    const setClause = dataKeys
        .map((key, i) => `${key} = $${i + 1}`)
        .join(', ');

    // WHERE clause
    const whereClause = whereKeys
        .map((key, i) => `${key} = $${dataKeys.length + i + 1}`)
        .join(' AND ');

    const query = `
        UPDATE ${table}
        SET ${setClause}
        WHERE ${whereClause}
    `;

    const values = [
        ...dataKeys.map(k => data[k]),
        ...whereKeys.map(k => where[k])
    ];

    return { query, values };
}

export function buildBulkUpdateQuery(
    table: string,
    data: Record<string, any>[],
    matchKeys: string[]
) {
    if (!data || data.length === 0) {
        throw new Error("No data provided");
    }

    const keys = Object.keys(data[0]!);

    let values: any[] = [];
    let valueRows: string[] = [];

    data.forEach((row, rowIndex) => {
        const placeholders = keys.map((_, colIndex) => {
            return `$${rowIndex * keys.length + colIndex + 1}`;
        });

        valueRows.push(`(${placeholders.join(', ')})`);
        values.push(...keys.map(k => row[k]));
    });

    const aliasCols = keys.join(', ');

    const setClause = keys
        .filter(k => !matchKeys.includes(k))
        .map(k => `${k} = v.${k}`)
        .join(', ');

    const whereClause = matchKeys
        .map(k => `u.${k} = v.${k}`)
        .join(' AND ');

    const query = `
        UPDATE ${table} u
        SET ${setClause}
        FROM (
            VALUES ${valueRows.join(', ')}
        ) AS v(${aliasCols})
        WHERE ${whereClause}
    `;

    return { query, values };
}

export function buildDeleteQuery(
    table: string,
    where: Record<string, any>
) {
    const whereKeys = Object.keys(where);

    if (whereKeys.length === 0) {
        throw new Error("DELETE without WHERE is not allowed");
    }

    // WHERE clause
    const whereClause = whereKeys
        .map((key, i) => `${key} = $${i + 1}`)
        .join(' AND ');

    const values = whereKeys.map(k => where[k]);

    const query = `
        DELETE FROM ${table}
        WHERE ${whereClause}
    `;

    return { query, values };
}