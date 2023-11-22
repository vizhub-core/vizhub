import { describe, it, expect, assert } from 'vitest';
import { initGateways } from './initGateways';
import {
  sampleFolder,
  folder2,
  folder3,
} from 'entities/test/fixtures';

export const getFolderAncestorsTest = () => {
  describe('getFolderAncestors', () => {
    it('getFolderAncestors level 1', async () => {
      const gateways = await initGateways();
      const { saveFolder, getFolderAncestors } = gateways;
      await saveFolder(sampleFolder);
      const result = await getFolderAncestors(
        sampleFolder.id,
      );
      assert(result.outcome === 'success');
      expect(result.value).toEqual([sampleFolder]);
    });

    it('getFolderAncestors error case not found', async () => {
      const gateways = await initGateways();
      const result =
        await gateways.getFolderAncestors('bogus-id');
      expect(result.outcome).toEqual('failure');
      assert(result.outcome === 'failure');
      expect(result.error.code).toEqual('resourceNotFound');
      expect(result.error.message).toEqual(
        'Resource (Folder) not found with id: bogus-id',
      );
    });

    it('getFolderAncestors level 2', async () => {
      const gateways = await initGateways();
      const { saveFolder, getFolderAncestors } = gateways;

      await saveFolder(sampleFolder);
      await saveFolder(folder2);

      const result = await getFolderAncestors(folder2.id);
      assert(result.outcome === 'success');
      expect(result.value.length).toEqual(2);
      expect(result.value).toEqual([sampleFolder, folder2]);
    });

    it('getFolderAncestors level 3', async () => {
      const gateways = await initGateways();
      const { saveFolder, getFolderAncestors } = gateways;

      await saveFolder(sampleFolder);
      await saveFolder(folder2);
      await saveFolder(folder3);

      const result = await getFolderAncestors(folder3.id);
      assert(result.outcome === 'success');
      expect(result.value.length).toEqual(3);
      expect(result.value).toEqual([
        sampleFolder,
        folder2,
        folder3,
      ]);
    });
  });
};
