/** The style of the csv document header row. */
export enum HeaderStyle{
    /** The first row of data is also the header. This is the same as no header. */
    FIRST_ROW = "firstRow",
    /** Read headers from the custom array in the csv generation options. */
    CUSTOM = "custom"
}

/** Options for the csv generation. */
export interface CsvOptions{
    /** Separator used between all columns in any single row. */
    columnSeparator: string;
    /** Separator used between rows. Usually the type of newline your system uses. */
    rowSeparator: string;
    /** The style of header to generate. */
    headerStyle: HeaderStyle;
    /** If header style is set to custom, this must contain a title for each provided data array. */
    customHeader: string[]|null;
    /** A custom converter function that all cell values are converted with. */
    cellValueConverter: (cell: unknown) => string;
}