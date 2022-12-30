export const parseDBUrl = (
  connectionString: string,
): { username: string; password: string; host: string; port: number; database: string } => {
  const parts1 = connectionString.substring(13).split(':');
  const username = parts1[0];
  const password = parts1[1].split('@')[0];
  const database = connectionString.substring(connectionString.lastIndexOf('/') + 1);
  let host: string;
  let port: number;
  if (parts1.length === 3) {
    host = parts1[1].split('@')[1];
    port = parseInt(parts1[2].split('/')[0]);
  } else {
    host = parts1[1].split('@')[1].split('/')[0];
    port = 5432;
  }
  return { username, password, host, port, database };
};
