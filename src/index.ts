import {Readable as ReadableStream} from "stream";

import type {GenerateOptions} from "./types";
import {HeaderStyle} from "./types";
import {convertToCell} from "./utility";
import {CsvStream} from "./CsvStream";

/**
 * Generate csv document from a set of data arrays.
 * @param data The arrays of data to convert into a csv document.
 * @param options Optional csv conversion options.
 * @returns The generated csv document as a string.
 */
export function generate(data: unknown[][], options: Partial<GenerateOptions> = {}): string{
    const stream = new CsvStream(data, options);
    let csv = "";

    let row: Buffer|null = Buffer.alloc(0);
    while(row !== null){
        csv += row.toString("utf8");
        row = stream.read();
    }

    return csv;
}

export {GenerateOptions, HeaderStyle} from "./types";
export {CsvStream} from "./CsvStream";