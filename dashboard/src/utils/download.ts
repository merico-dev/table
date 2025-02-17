import { AsyncParser } from '@json2csv/whatwg';
import { notifications } from '@mantine/notifications';
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

export async function downloadDataAsCSV(filename: string, data: TQueryData) {
  const csv = await makeCSV(data);
  const blob = new Blob([csv], { type: 'text/csv' });
  saveAs(blob, `${filename}.csv`);
}

export function downloadDataListAsZip(filename: string, idDataList: Array<{ id: string; data: TQueryData }>) {
  const zip = new JSZip();
  const promises = idDataList.map(async ({ id, data }) => {
    const csv = await makeCSV(data);
    zip.file(`${id}.csv`, csv);
  });
  Promise.all(promises)
    .then(() => {
      zip.generateAsync({ type: 'blob' }).then((content) => {
        saveAs(content, `${filename}.zip`);
      });
    })
    .catch((err) => {
      console.error(err);
      notifications.show({
        color: 'red',
        title: 'Failed to download data',
        message: err.message,
      });
    });
}

export function downloadJSON(name: string, json: string) {
  const blob = new Blob([json], { type: 'application/json' });
  saveAs(blob, `${name}.json`);
}
