import {expect} from "chai";
import {Readable as ReadableStream} from "stream";

import {CsvStream} from "../src/CsvStream";
import {HeaderStyle} from "../src/types";

describe("CsvStream", () => {
    it("should be a Readable stream", () => {
        expect(new CsvStream([[1]])).to.be.an.instanceOf(ReadableStream);
    });

    describe("input validation", () => {
        // Few of the tests require casting arguments as they test using the library without TypeScript
        it("should require input data to be an array", () => {
            expect(() => {
                new CsvStream(<unknown[][]><unknown>"");
            }).to.throw("Input data must consist of an array of arrays.");
        });

        it("should require input data array to not be empty", () => {
            expect(() => {
                new CsvStream([]);
            }).to.throw("Input data must consist of an array of arrays.");
        });

        it("should require input data array to contain arrays", () => {
            expect(() => {
                new CsvStream(<unknown[][]><unknown>[[], "data"]);
            }).to.throw("Input data must consist of an array of arrays.");
        });

        it("should require all input arrays have the same length", () => {
            expect(() => {
                new CsvStream([[1, 2], [1, 2], [1, 2, 3]]);
            }).to.throw("All data arrays must have the same length.");
        });

        it("should allow passing an empty dataset with the correct format", () => {
            new CsvStream([[]]);
        });

        it("should accept a custom header of correct length", () => {
            new CsvStream([[1]], {
                headerStyle: HeaderStyle.CUSTOM,
                customHeader: ["Title"]
            });
        });

        it("should require a custom header if header type is set to CUSTOM", () => {
            expect(() => {
                new CsvStream([[1]], {
                    headerStyle: HeaderStyle.CUSTOM
                });
            }).to.throw("Custom header array must have a header string for each row.");
        });

        it("should require a custom header of correct length if header type is set to CUSTOM", () => {
            expect(() => {
                new CsvStream([[1]], {
                    headerStyle: HeaderStyle.CUSTOM,
                    customHeader: ["Title 1", "Title 2"]
                });
            }).to.throw("Custom header array must have a header string for each row.");
        });

        it("should not validate the custom header if header type is not set to CUSTOM", () => {
            new CsvStream([[1]], {
                customHeader: ["Title 1", "Title 2"]
            });
        });
    });

    describe("csv generation", () => {
        const testData = [
            [1, 2, 3, 4, 5],
            ["aa", "bb", "cc", "dd", "ee"],
            [1, 2, 3, 4, 5],
            ["aa", "bb", "cc", "dd", "ee"]
        ];

        // eslint-disable-next-line jsdoc/require-jsdoc
        function getTestResult(columnSeparator: string, rowSeparator: string): string{
            return `1${columnSeparator}aa${columnSeparator}1${columnSeparator}aa${rowSeparator}2${columnSeparator}bb${columnSeparator}2${columnSeparator}bb${rowSeparator}3${columnSeparator}cc${columnSeparator}3${columnSeparator}cc${rowSeparator}4${columnSeparator}dd${columnSeparator}4${columnSeparator}dd${rowSeparator}5${columnSeparator}ee${columnSeparator}5${columnSeparator}ee${rowSeparator}`;
        }

        it("should generate correct cvs data with default settings", () => {
            const stream = new CsvStream(testData);
            let result = "";

            let chunk: Buffer|null = Buffer.alloc(0);
            while(chunk !== null){
                result += chunk.toString("utf8");
                chunk = <Buffer|null>stream.read();
            }

            expect(result).to.equal(getTestResult(",", "\n"));
        });

        it("should generate correct cvs data with custom column separator", () => {
            const separator = "\t";
            const stream = new CsvStream(testData, {columnSeparator: separator});
            let result = "";

            let chunk: Buffer|null = Buffer.alloc(0);
            while(chunk !== null){
                result += chunk.toString("utf8");
                chunk = <Buffer|null>stream.read();
            }

            expect(result).to.equal(getTestResult(separator, "\n"));
        });

        it("should generate correct cvs data with custom row separator", () => {
            const separator = "\t";
            const stream = new CsvStream(testData, {rowSeparator: separator});
            let result = "";

            let chunk: Buffer|null = Buffer.alloc(0);
            while(chunk !== null){
                result += chunk.toString("utf8");
                chunk = <Buffer|null>stream.read();
            }

            expect(result).to.equal(getTestResult(",", separator));
        });

        it("should add a custom header to the data", () => {
            const headers = [
                "Title 1",
                "Title 2",
                "Title 3",
                "Title 4"
            ];
            const stream = new CsvStream(testData, {
                headerStyle: HeaderStyle.CUSTOM,
                customHeader: headers
            });
            let result = "";

            let chunk: Buffer|null = Buffer.alloc(0);
            while(chunk !== null){
                result += chunk.toString("utf8");
                chunk = <Buffer|null>stream.read();
            }

            expect(result).to.equal(`${headers.join(",")}\n${getTestResult(",", "\n")}`);
        });

        it("should add custom header even if it alone fills read stream buffer", () => {
            const headers = [
                Buffer.alloc(16384).toString(), // 16384 is default stream internal buffer size
                "",
                "",
                ""
            ];
            const stream = new CsvStream(testData, {
                headerStyle: HeaderStyle.CUSTOM,
                customHeader: headers
            });
            let result = "";

            let chunk: Buffer|null = Buffer.alloc(0);
            while(chunk !== null){
                result += chunk.toString("utf8");
                chunk = <Buffer|null>stream.read();
            }

            expect(result).to.equal(`${headers.join(",")}\n${getTestResult(",", "\n")}`);
        });

        it("should generate csv document even if stream internal buffer temporarily fills", () => {
            const data = [[
                Buffer.alloc(16384).toString("utf8"),
                Buffer.alloc(16384).toString("utf8"),
                Buffer.alloc(16384).toString("utf8")
            ]];
            const stream = new CsvStream(data);
            let result = "";

            let chunk: Buffer|null = Buffer.alloc(0);
            while(chunk !== null){
                result += chunk.toString("utf8");
                chunk = <Buffer|null>stream.read();
            }

            expect(result).to.equal(`${data[0].join("\n")}\n`);
        });
    });
});