/**
 * Change any supported data types into strings, throw otherwise.
 * @param cell The unknown cell item to convert.
 * @throws {Error} Thrown if the cell item type is unsupported.
 * @returns A string representation of the input.
 */
export function convertToCell(cell: unknown): string{
    switch(typeof cell){
        case "string":
            return cell;
        case "number":
        case "boolean":
        case "bigint":
            return String(cell);
        case "symbol":
            return cell.description !== undefined ? cell.description : "";
        case "undefined":
            return "undefined";
        case "function":
        case "object":
        default:
            if(cell === null){
                return "null";
            }else{
                throw new Error(`Encountered an invalid type "${typeof cell}" array member.`);
            }
    }
}