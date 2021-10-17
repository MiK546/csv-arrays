import type {GenerateOptions} from "./types";
import {HeaderStyle} from "./types";
import {convertToCell} from "./utility";

/**
 * Generate csv document from a set of data arrays.
 * @param data The arrays of data to convert into a csv document.
 * @param options Optional csv conversion options.
 * @returns The generated csv document as a string.
 */
export function generate(data: unknown[][], options: Partial<GenerateOptions> = {}): string{
    let csv = "";
    const finalOptions: GenerateOptions = {
        cellSeparator: ",",
        rowSeparator: "\n",
        headerStyle: HeaderStyle.FIRST_ROW,
        customHeader: null,
        ...options
    };

    // Check that all data arrays have the same length
    const targetLength = data[0].length;
    for(const dataArray of data){
        if(dataArray.length !== targetLength){
            throw new Error("All data arrays must have the same length.");
        }
    }

    // Generate the header row if a non-standard one is set in options
    if(finalOptions.headerStyle === HeaderStyle.CUSTOM){
        if(!Array.isArray(finalOptions.customHeader) || finalOptions.customHeader.length !== data.length){
            throw new Error("Custom header array must have a header string for each row.");
        }
        csv += finalOptions.customHeader.join(finalOptions.cellSeparator);
        csv += finalOptions.rowSeparator;
    }

    // Generate all data rows
    for(let i = 0; i < data[0].length; ++i){
        csv += data
            .map((dataArray) => {
                return convertToCell(dataArray[i]);
            })
            .join(finalOptions.cellSeparator);
        csv += finalOptions.rowSeparator;
    }

    // Don't return the last row change
    return csv.substring(0, csv.length - finalOptions.rowSeparator.length);
}

export {GenerateOptions, HeaderStyle} from "./types";