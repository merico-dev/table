export function validateDashboardJSONFile(e: ProgressEvent<FileReader>) {
  if (e.target === null) {
    throw new Error('FileReader failed with null result');
  }

  if (typeof e.target.result !== 'string') {
    throw new Error(`Unparsable file content of type: ${typeof e.target.result}`);
  }

  let content = JSON.parse(e.target.result);
  if ('content' in content) {
    content = content.content;
  }

  return content;
}
