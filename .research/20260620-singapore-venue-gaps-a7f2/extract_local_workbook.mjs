import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const workbookPath =
  "C:/Users/Noah Chen/Documents/BaiduSyncdisk/10 SDQ/新加坡场地资料汇总/新加坡场地综合信息表_规范化版.xlsx";
const input = await FileBlob.load(workbookPath);
const workbook = await SpreadsheetFile.importXlsx(input);
const summary = await workbook.inspect({
  kind: "sheet,table,region",
  maxChars: 20000,
  tableMaxRows: 8,
  tableMaxCols: 8,
  tableMaxCellChars: 100,
});
console.log(summary.ndjson);

const venueNames = {};
for (const sheetName of ["酒店", "餐厅", "活动场地"]) {
  const sheet = workbook.worksheets.getItem(sheetName);
  const values = sheet.getUsedRange().values;
  venueNames[sheetName] = [
    ...new Set(
      values
        .slice(2)
        .map((row) => String(row[1] || "").trim())
        .filter(Boolean),
    ),
  ];
}
console.log(`VENUE_NAMES=${JSON.stringify(venueNames)}`);
