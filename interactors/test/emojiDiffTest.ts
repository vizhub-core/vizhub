// Test for emoji handling in OT diff
import { describe, it, expect } from 'vitest';
import { diff } from '../../ot/index.js';

export const emojiDiffTest = () => {
  describe('Emoji handling in OT diff', () => {
    it('should handle simple emoji in text diff', () => {
      const before = { content: 'Hello world' };
      const after = { content: 'Hello world 🌈' };
      
      // This should not throw an error
      expect(() => {
        const op = diff(before, after);
      }).not.toThrow();
    });

    it('should handle emoji in aiScratchpad scenario', () => {
      // This mimics the scenario in editWithAI.ts where aiScratchpad contains emoji
      const before = {
        files: { 'index.html': { text: '<html></html>' } },
        aiScratchpad: 'Initial content'
      };
      
      const after = {
        files: { 'index.html': { text: '<html></html>' } },
        aiScratchpad: 'Initial content with emoji 🌈 in response'
      };
      
      // This should not throw an error
      expect(() => {
        const op = diff(before, after);
      }).not.toThrow();
    });

    it('should handle various emoji types', () => {
      const emojis = [
        '🌈', // Basic emoji
        '👨‍💻', // Compound emoji with ZWJ
        '❤️', // Emoji with variation selector
        '🏳️‍🌈', // Complex compound emoji
      ];
      
      emojis.forEach(emoji => {
        const before = { text: 'Start' };
        const after = { text: `Start ${emoji}` };
        
        expect(() => {
          const op = diff(before, after);
        }, `Should handle emoji: ${emoji}`).not.toThrow();
      });
    });

    it('should correctly compute diff for emoji content', () => {
      const before = { message: 'Hello' };
      const after = { message: 'Hello 🎉' };
      
      const op = diff(before, after);
      
      // Verify the operation is valid (not empty)
      expect(op).toBeDefined();
      expect(Array.isArray(op) ? op.length > 0 : Object.keys(op).length > 0).toBe(true);
    });
  });
};