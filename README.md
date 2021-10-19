## csv-arrays
`csv-arrays` is a Node.js library to convert a set of arrays into a csv formatted document. There
specialty of this implementation is that it is designed to handle the input data as arrays of
columns. In addition to this `csv-arrays` aims to be a well-documented, simple and easy-to-use csv
conversion library for Node.js.

For example, if you have measured the temperature of your office every day and have stored the dates
in an array and the temperatures of those dates in an another array like this:

```
["2021-10-01", "2021-10-02", "2021-10-03", "2021-10-04"]
[20, 23, 19, 24]
```

You could save the data into a csv-formatted document using `csv-arrays` like this:

```ts
import fs from "fs";
import util from "util";
import stream from "stream";
import {CsvStream} from "csv-arrays";

const pipeline = util.promisify(stream.pipeline);

const dates: string[] = [];
const temperatures: number[] = [];

async function main(): Promise<void>{
    await pipeline(
        new CsvStream([dates, temperatures]),
        fs.createWriteStream("temperatures.csv")
    );
}

main();
```

This produces a `temperatures.csv` file containing the temperature data.

```csv
2021-10-01,20
2021-10-02,23
2021-10-03,19
2021-10-04,24
```

## Usage
For full API documentation, see https://mik546.github.io/csv-arrays/.

`csv-arrays` exposes two modes of usage. You can create a readable stream by creating an instance of
the `CsvStream` class. This way the result data doesn't need to be stored in memory and can instead
be streamed directly to for example a file. The other way to use `csv-arrays` is to use the
`generateCsv` function that takes the data and synchronously generates and returns the csv-document.
Behind the scenes `generateCsv` is just a utility function feeding the data into a CsvStream and
reading all of the output into memory.

Both the `CsvStream` constructor and `generateCsv` function accept the same two parameters. The
first parameter is an array containing arrays of data. Each of the inner arrays becomes a column
in the csv-document. All of the inner arrays must have the same length. The individual data items
inside the inner arrays can by default have any type except a function or an object. By using a
custom cell value converter function however any types of data can be used.

The second argument is the options object that can be used to define additional options for
generating the csv document. All options are optional.

|Option               |Default   |Description |
|---------------------|----------|------------|
|`columnSeparator`    |`","`     |The separator used between columns. To output tab-separated csv for example, set this otpion to `"\t"`. |
|`rowSeparator`       |`\n`      |The separator used between rows. If you want to use the output file on Widows, set this to `\n\r` for Windows style newlines. |
|`headerStyle`        |FIRST_ROW |Sets the style of header (first) row used in the csv document. See the HeaderStyle enum for options. |
|`customHeader`       |null      |An array containing title strings for a custom header row. If set, must have the same length as the outer data array. For this to affect the output, you must set `headerStyle` to CUSTOM. |
|`cellValueConverter` |          |Set a custom function that is used to convert all cell data items into strings. If none is set, the default converter is used. The default converter does not support functions or objects. |