export const parseDBUrl = (
  connectionString: string,
): { username: string; password: string; host: string; port: number; database: string } => {
  try {
    const url = new URL(connectionString);
    const username = url.username;
    const password = url.password;
    const host = url.hostname;
    const port = url.port ? parseInt(url.port, 10) : 5432;
    const database = url.pathname.substring(1); // Remove leading '/'
    return { username, password, host, port, database };
  } catch (e) {
    throw new Error(`Invalid database connection string: ${connectionString}`);
  }
};
