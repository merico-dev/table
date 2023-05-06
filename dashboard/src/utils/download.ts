import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const BOM = '\uFEFF';

export function downloadCSV(id: string, csv: string) {
  const blob = new Blob([BOM + csv], { type: 'text/csv' });
  saveAs(blob, `${id}.csv`);
}

export function downloadJSON(name: string, json: string) {
  const blob = new Blob([json], { type: 'application/json' });
  saveAs(blob, `${name}.json`);
}

export function downloadDataListAsZip(idDataList: Array<{ id: string; data: TVizData }>) {
  const zip = new JSZip();
  idDataList.forEach(({ id, data }) => {
    zip.file(`${id}.csv`, makeCSV(data));
  });
  zip.generateAsync({ type: 'blob' }).then((content) => {
    saveAs(content, 'dashboard_data.zip');
  });
}

function escapeComma(v: string) {
  if (v.includes(',')) {
    return `"${v}"`;
  }
  return v;
}

export function makeCSV(data: TVizData) {
  if (!Array.isArray(data) || data.length === 0) {
    // Not dealing with object-typed data for now
    return '';
  }

  const csvRows = [];
  const headers = Object.keys(data[0]).map(escapeComma);
  csvRows.push(headers.join(','));

  data.forEach((row) => {
    const values = Object.values(row).map(escapeComma).join(',');
    csvRows.push(values);
  });

  return BOM + csvRows.join('\n');
}
