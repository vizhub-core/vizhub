// Test for emoji handling in OT diff
import { describe, it, expect } from 'vitest';
import { diff, apply } from '../../ot/index.js';

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
      aiScratchpad: 'Initial content',
    };

    const after = {
      files: { 'index.html': { text: '<html></html>' } },
      aiScratchpad:
        'Initial content with emoji 🌈 in response',
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

    emojis.forEach((emoji) => {
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
    expect(
      Array.isArray(op)
        ? op.length > 0
        : Object.keys(op).length > 0,
    ).toBe(true);
  });

  it('should handle round-trip diff and apply with emojis', () => {
    // Test that emoji content can be diffed and applied correctly
    const original = {
      aiScratchpad: 'Building a rainbow component',
      files: { 'index.html': { text: '<div>Hello</div>' } },
    };

    const modified = {
      aiScratchpad:
        'Building a rainbow component 🌈 with colors',
      files: { 'index.html': { text: '<div>Hello</div>' } },
    };

    const op = diff(original, modified);
    const result = apply(original, op);

    expect(result.aiScratchpad).toBe(
      'Building a rainbow component 🌈 with colors',
    );
  });

  it('should handle emoji content without errors', () => {
    // Test that emoji content can be properly diffed and applied
    const before = { aiScratchpad: 'Creating a component' };
    const after = {
      aiScratchpad: 'Creating a component 🌈 with emojis',
    };

    const op = diff(before, after);
    const result = apply(before, op);

    expect(result.aiScratchpad).toBe(
      'Creating a component 🌈 with emojis',
    );
  });

  it('should handle specific problematic emoji sequences', () => {
    // Test emoji sequences that might cause issues
    const problematicEmojis = [
      '🏳️‍🌈', // Rainbow flag (flag + ZWJ + rainbow)
      '👨‍👩‍👧‍👦', // Family (multiple ZWJ sequences)
      '🧑🏽‍💻', // Person with skin tone + ZWJ + computer
      '🤷🏻‍♀️', // Person shrugging with skin tone and gender
    ];

    problematicEmojis.forEach((emoji) => {
      const before = { content: 'Test: ' };
      const after = { content: `Test: ${emoji}` };

      expect(() => {
        const op = diff(before, after);
        const result = apply(before, op);
        expect(result.content).toBe(`Test: ${emoji}`);
      }, `Should handle complex emoji: ${emoji}`).not.toThrow();
    });
  });
});
