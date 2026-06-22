import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const paths = [
  "C:/Users/Noah Chen/Documents/BaiduSyncdisk/1 ACT Creative/4 项目/Pico Japan/Monad token 2049/Venue Requirments.xlsx",
  "C:/Users/Noah Chen/Documents/BaiduSyncdisk/1 ACT Creative/4 项目/Pico Japan/Singapore_Location_Permit_Comparison.xlsx",
  "C:/Users/Noah Chen/Documents/BaiduSyncdisk/1 ACT Creative/4 项目/Pico Japan/Singapore_Venue_Rescreened_20m_OpenToSky.xlsx",
  "C:/Users/Noah Chen/Documents/BaiduSyncdisk/1 ACT Creative/4 项目/Pico Japan/Singapore_Venue_Shortlist_Executive_Summary_v3.xlsx",
];

for (const path of paths) {
  const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(path));
  const result = await workbook.inspect({
    kind: "sheet,region",
    maxChars: 10000,
    tableMaxRows: 30,
    tableMaxCols: 12,
    tableMaxCellChars: 100,
  });
  console.log(`FILE=${path}`);
  console.log(result.ndjson);
}
