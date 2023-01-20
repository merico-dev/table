import { createPatch, schema } from './json-schema-diff';
import { describe, test } from 'vitest';

describe('createPatch', () => {
  describe('simple object', () => {
    const blogPostSchema = schema.model('blog post', {
      id: schema.id(),
      title: schema.string(),
      content: schema.string(),
      author: schema.string(),
      subTitle: schema.string(),
    });
    test('fields', () => {
      const post1 = {
        id: '1',
        title: 'Hello World',
        content: 'Welcome to my blog',
        subTitle: 'This is a subtitle',
      };
      const post2 = {
        id: '1',
        title: 'Hello China',
        content: 'Welcome to my blog',
        author: 'John Doe',
      };

      const patch = createPatch(blogPostSchema, post1, post2);
      expect(patch.toJSON()).toEqual([
        {
          path: ['title'],
          type: 'update',
          value: 'Hello China',
          schemaType: 'string',
        },
        {
          path: ['author'],
          type: 'add',
          value: 'John Doe',
          schemaType: 'string',
        },
        {
          path: ['subTitle'],
          type: 'remove',
          schemaType: 'string',
        },
      ]);
    });
    test.each([[undefined], [null], [false], [1], [new Date()], [{}], [[]], [[null]]])('diff with %o', (invalid) => {
      const post1 = {
        id: '1',
        title: 'Hello World',
        content: 'Welcome to my blog',
      };
      const patch = createPatch(blogPostSchema, post1, invalid);
      expect(patch.toJSON()).toEqual([
        {
          path: ['id'],
          schemaType: 'id',
          type: 'remove',
        },
        {
          path: ['title'],
          schemaType: 'string',
          type: 'remove',
        },
        {
          path: ['content'],
          schemaType: 'string',
          type: 'remove',
        },
      ]);
    });
  });
});
