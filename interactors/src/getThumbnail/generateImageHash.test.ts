import { generateImageHash } from './generateImageHash';
import { describe, it, expect } from 'vitest';

describe('generateImageHash', () => {
  it('should generate a consistent hash for the same buffer', () => {
    const buffer = Buffer.from('test image data');
    const hash1 = generateImageHash(buffer);
    const hash2 = generateImageHash(buffer);
    expect(hash1).toBe(hash2);
  });

  it('should generate different hashes for different buffers', () => {
    const buffer1 = Buffer.from('test image data 1');
    const buffer2 = Buffer.from('test image data 2');
    const hash1 = generateImageHash(buffer1);
    const hash2 = generateImageHash(buffer2);
    expect(hash1).not.toBe(hash2);
  });

  it('should handle empty buffer', () => {
    const buffer = Buffer.from('');
    const hash = generateImageHash(buffer);
    expect(hash).toBeDefined();
    expect(hash).not.toBe('');
  });

  it('should produce a valid hex string', () => {
    const buffer = Buffer.from('test image data');
    const hash = generateImageHash(buffer);
    expect(hash).toMatch(/^[a-f0-9]{64}$/); // SHA-256 produces a 64-character hex string
  });
});
