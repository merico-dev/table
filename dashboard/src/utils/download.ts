export function downloadCSV(id: string, csv: string) {
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', `${id}.csv`);
  a.click();
}

export function makeCSV(data: any | any[]) {
  if (!Array.isArray(data)) {
    // Not dealing with object-typed data for now
    return '';
  }

  const csvRows = [];
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(','));

  data.forEach((row) => {
    const values = Object.values(row).join(',');
    csvRows.push(values);
  });

  return csvRows.join('\n');
}
