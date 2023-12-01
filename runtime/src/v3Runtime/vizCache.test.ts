import { describe, it, expect, vi } from 'vitest';
import { Content, Snapshot } from 'entities';
import { fakeSnapshot } from 'entities/test/fixtures';
import { createVizCache } from './vizCache';

// Sample content for testing imports
const sampleContent: Content = {
  id: 'sampleContent',
  files: {
    '7548392': {
      name: 'index.js',
      text: `
        import { innerMessage } from './message';
        export const message = "Outer " + innerMessage;
      `,
    },
    '6714854': {
      name: 'message.js',
      text: `
        export const innerMessage = "Inner";
      `,
    },
  },
  title: 'Sample Content for Exporting',
};

describe('VizCache', () => {
  describe('VizCache - get method', () => {
    it('should return content from cache if available', async () => {
      const vizCache = createVizCache({
        initialContents: [sampleContent],
        handleCacheMiss: vi.fn(),
      });
      const content = await vizCache.get(sampleContent.id);
      expect(content).toEqual(sampleContent);
      expect(vi.fn()).toHaveBeenCalledTimes(0); // handleCacheMiss should not be called
    });

    it('should fetch content on cache miss and store it', async () => {
      const handleCacheMissMock = vi
        .fn()
        .mockResolvedValue(sampleContent);
      const vizCache = createVizCache({
        initialContents: [],
        handleCacheMiss: handleCacheMissMock,
      });

      const content = await vizCache.get(sampleContent.id);
      expect(handleCacheMissMock).toHaveBeenCalledWith(
        sampleContent.id,
      );
      expect(content).toEqual(sampleContent);
      // Verify that the cache now contains the fetched content
      const cachedContent = await vizCache.get(
        sampleContent.id,
      );
      expect(cachedContent).toEqual(sampleContent);
    });

    it('should throw an error if handleCacheMiss does not return content', async () => {
      const handleCacheMissMock = vi
        .fn()
        .mockResolvedValue(undefined);
      const vizCache = createVizCache({
        initialContents: [],
        handleCacheMiss: handleCacheMissMock,
      });

      await expect(
        vizCache.get('nonexistentId'),
      ).rejects.toThrow(
        'Unresolved import from vizId nonexistentId',
      );
    });

    // Add tests for set
  });
  describe('VizCache - set method', () => {
    it('should add new content to the cache', async () => {
      const vizCache = createVizCache({
        initialContents: [],
        handleCacheMiss: vi.fn(),
      });

      const newContent: Content = {
        id: 'newContent',
        files: {},
        title: 'New Content',
      };

      vizCache.set(newContent);

      // Verify new content is added
      const content = await vizCache.get(newContent.id);
      expect(content).toEqual(newContent);
    });

    it('should update existing content in the cache', async () => {
      const updatedContent: Content = {
        ...sampleContent,
        title: 'Updated Content Title',
      };

      const vizCache = createVizCache({
        initialContents: [sampleContent],
        handleCacheMiss: vi.fn(),
      });

      // Update existing content
      vizCache.set(updatedContent);

      // Verify content is updated
      const content = await vizCache.get(updatedContent.id);
      expect(content).toEqual(updatedContent);
    });

    it('should keep the cache consistent after multiple set operations', async () => {
      const vizCache = createVizCache({
        initialContents: [],
        handleCacheMiss: vi.fn(),
      });

      // Adding multiple contents
      const contentA: Content = {
        id: 'contentA',
        files: {},
        title: 'Content A',
      };

      const contentB: Content = {
        id: 'contentB',
        files: {},
        title: 'Content B',
      };

      vizCache.set(contentA);
      vizCache.set(contentB);

      // Verify both contents are retrievable
      const retrievedA = await vizCache.get(contentA.id);
      const retrievedB = await vizCache.get(contentB.id);

      expect(retrievedA).toEqual(contentA);
      expect(retrievedB).toEqual(contentB);
    });
  });
});
