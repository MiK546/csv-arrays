import {expect} from "chai";

import {generateCsv} from "../src/generateCsv";
import {HeaderStyle} from "../src/types";

describe("generateCsv", () => {
    it("should generate csv synchronously", () => {
        const csvResult = generateCsv([[1, 2], ["a", "b"]]);

        expect(csvResult).to.equal("1,a\n2,b\n");
    });

    it("should generate csv with all supported parameters", () => {
        const headers = [
            "Header 1",
            "Header 2"
        ];
        const csvResult = generateCsv([[1], [2]], {
            columnSeparator: "\t",
            rowSeparator: "\r\n",
            headerStyle: HeaderStyle.CUSTOM,
            customHeader: headers
        });

        expect(csvResult).to.equal(`${headers.join("\t")}\r\n1\t2\r\n`);
    });
});