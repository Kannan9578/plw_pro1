import * as fs from 'fs/promises';
import * as path from 'path';
import ExcelJS from 'exceljs';

export class FileUtils {

    async readFile(filePath: string): Promise<string> {
        try {
            const data = await fs.readFile(filePath, 'utf-8');
            return data;
        } catch (error) {
            console.error(`Error reading file at ${filePath}:`, error);
            throw error;
        }
    }

    async writeFile(filePath: string, data: string): Promise<void> {
        try {
            await fs.writeFile(filePath, data, 'utf-8');
        } catch (error) {
            console.error(`Error writing file at ${filePath}:`, error);
            throw error;
        }
    }

    async appendToFile(filePath: string, data: string): Promise<void> {
        try {
            const dir = path.dirname(filePath);
            // Ensure directory exists
            await fs.mkdir(dir, { recursive: true });
            await fs.appendFile(filePath, data, 'utf-8');
        } catch (error) {
            console.error(`Error appending to file at ${filePath}:`, error);
            throw error;
        }
    }

    async readExcelFile(filePath: string): Promise<any> {
        try {
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(filePath);
            const worksheet = workbook.worksheets[0];
            const data: any[] = [];
            const header: string[] = [];
            worksheet?.eachRow((row, rowNumber) => {
                if (rowNumber === 1) {
                    row.eachCell((cell, colNumber) => {
                        header[colNumber] = String(cell.value);
                    });
                    return;
                }
                const rowData: Record<string, any> = {};
                row.eachCell((cell, colNumber) => {
                    const key = header[colNumber];
                    if (key) {
                        rowData[key] = cell.value;
                    }
                });
                data.push(rowData);
            }
            );
            return data;

        } catch (error) {
            console.error(`Error reading Excel file at ${filePath}:`, error);
            throw error;
        }

    }

}