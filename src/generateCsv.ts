import type {CsvOptions} from "./types";
import {CsvStream} from "./CsvStream";

/**
 * Generate csv document from a set of data arrays.
 * @param data The arrays of data to convert into a csv document.
 * @param options Optional csv conversion options.
 * @returns The generated csv document as a string.
 */
export function generateCsv(data: unknown[][], options: Partial<CsvOptions> = {}): string{
    const stream = new CsvStream(data, options);
    let csv = "";

    let row: Buffer|null = Buffer.alloc(0);
    while(row !== null){
        csv += row.toString("utf8");
        row = <Buffer|null>stream.read();
    }

    return csv;
}