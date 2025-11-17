import { IsPublishedExecutorSchema } from './schema';
import executor from './executor';

const options: IsPublishedExecutorSchema = {};

describe('IsPublished Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
