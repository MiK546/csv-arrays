import {Readable as ReadableStream} from "stream";

import type {CsvOptions} from "./types";
import {HeaderStyle} from "./types";
import {convertToCell} from "./utility";

/**
 * Readable stream to convert a set of data arrays into a csv document.
 */
export class CsvStream extends ReadableStream{
    /** The source data arrays to convert into csv. */
    private readonly data: unknown[][];
    /** Full options for csv document generation. */
    private readonly options: CsvOptions;

    /** The current line of the csv document being processed. */
    private currentLine = 0;
    /** A custom header row to write to the start of the csv document. */
    private customHeader: string[]|null = null;

    /**
     * Create a stream to convert a set of data arrays into a csv document.
     * @param data The arrays of data to convert into a csv document.
     * @param options Optional csv conversion options.
     */
    public constructor(data: unknown[][], options: Partial<CsvOptions> = {}){
        super();
        // Check that all data arrays have the same length
        const targetLength = data[0].length;
        for(const dataArray of data){
            if(dataArray.length !== targetLength){
                throw new Error("All data arrays must have the same length.");
            }
        }

        this.data = data;
        this.options = {
            cellSeparator: ",",
            rowSeparator: "\n",
            headerStyle: HeaderStyle.FIRST_ROW,
            customHeader: null,
            ...options
        };

        // Validate and set the custom header row if one is set in options
        if(this.options.headerStyle === HeaderStyle.CUSTOM){
            if(!Array.isArray(this.options.customHeader) || this.options.customHeader.length !== this.data.length){
                throw new Error("Custom header array must have a header string for each row.");
            }
            this.customHeader = this.options.customHeader;
        }
    }

    /** @override */
    public _read(): void{
        // Write the custom header first if one exists
        if(this.customHeader !== null){
            const header: string[] = this.customHeader;
            this.customHeader = null;
            if(!this.push(Buffer.from(
                header.join(this.options.cellSeparator)
                + this.options.rowSeparator,
                "utf8"
            ))){
                return;
            }
        }

        let pushMore: boolean;
        do{
            pushMore = this.push(Buffer.from(
                this.data
                    .map((dataArray) => {
                        return convertToCell(dataArray[this.currentLine]);
                    })
                    .join(this.options.cellSeparator)
                + this.options.rowSeparator,
                "utf8"
            ));
            this.currentLine += 1;

            if(this.currentLine >= this.data[0].length){
                this.push(null);
                break;
            }
        }while(pushMore);
    }
}