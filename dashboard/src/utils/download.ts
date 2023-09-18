import { AsyncParser } from '@json2csv/whatwg';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

const parser = new AsyncParser({ withBOM: true });

export async function makeCSV(data: TQueryData) {
  if (!Array.isArray(data) || data.length === 0) {
    // Not dealing with object-typed data for now
    return '';
  }

  // @ts-expect-error Property 'promise' does not exist on type 'ReadableStream<string>'.ts(2339)
  const csv = await parser.parse(data).promise();
  return csv;
}

export async function downloadDataAsCSV(id: string, data: TQueryData) {
  const csv = await makeCSV(data);
  const blob = new Blob([csv], { type: 'text/csv' });
  saveAs(blob, `${id}.csv`);
}

export function downloadDataListAsZip(idDataList: Array<{ id: string; data: TQueryData }>) {
  const zip = new JSZip();
  idDataList.forEach(({ id, data }) => {
    zip.file(`${id}.csv`, makeCSV(data));
  });
  zip.generateAsync({ type: 'blob' }).then((content) => {
    saveAs(content, 'dashboard_data.zip');
  });
}

export function downloadJSON(name: string, json: string) {
  const blob = new Blob([json], { type: 'application/json' });
  saveAs(blob, `${name}.json`);
}
