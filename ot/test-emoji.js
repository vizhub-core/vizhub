import { diff } from './index.js';

// Test case that simulates what happens in editWithAI.ts
const testEmojiDiff = () => {
  console.log('Testing emoji handling in OT diff...');

  // This simulates the scenario in editWithAI.ts where aiScratchpad is updated with emoji content
  const before = {
    files: { 'index.html': { text: '<html></html>' } },
    aiScratchpad: 'Some initial content',
  };

  const after = {
    files: { 'index.html': { text: '<html></html>' } },
    aiScratchpad:
      'Some initial content with emoji 🌈 and more text',
  };

  try {
    const op = diff(before, after);
    console.log(
      '✅ Emoji diff succeeded:',
      JSON.stringify(op),
    );
    return true;
  } catch (error) {
    console.error('❌ Emoji diff failed:', error);
    return false;
  }
};

// Test with various emoji types
const testVariousEmojis = () => {
  console.log('Testing various emoji types...');

  const emojis = [
    '🌈', // Rainbow
    '🎉', // Party
    '💻', // Computer
    '🚀', // Rocket
    '❤️', // Heart with variation selector
    '👨‍💻', // Man technologist (compound emoji)
    '🏳️‍🌈', // Rainbow flag (compound emoji with zero-width joiner)
  ];

  for (const emoji of emojis) {
    const before = { content: 'Hello' };
    const after = { content: `Hello ${emoji}` };

    try {
      const op = diff(before, after);
      console.log(`✅ ${emoji} handled successfully`);
    } catch (error) {
      console.error(`❌ ${emoji} failed:`, error.message);
      return false;
    }
  }

  return true;
};

// Run tests
testEmojiDiff();
testVariousEmojis();
