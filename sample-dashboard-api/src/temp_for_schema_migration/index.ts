// NOTE: Keep versions in order
const versions = [
  '2.0.0',
  // ... future versions
]

function findNextVersion(currentVersion: string) {
  if (!currentVersion) {
    return versions[0];
  }

  const currentIndex = versions.findIndex(v => v === currentVersion)
  if (currentIndex < versions.length - 1) {
    return versions[currentIndex + 1]
  }

  return null; // currentVersion is the lastest version
}

async function findHandler(currentVersion: string) {
  const nextVersion = findNextVersion(currentVersion);
  if (!nextVersion) {
    return;
  }

  return import (`./handlers/${nextVersion}.ts`);
}

async function main(schema) {
  const handler = await findHandler(schema.version);
  if (!handler) {
    return;
  }

  const newSchema = handler(schema)
  // update dashboard.content with newSchema
}