import { describe, it, expect } from 'vitest';
import { getLicense, defaultLicense } from './getLicense';
import { primordialViz } from 'gateways/test/fixtures';
import { Content } from 'entities';

// The two tests marked with concurrent will be run in parallel
describe('getLicense', () => {
  it('should return default license if file is missing', () => {
    expect(getLicense(primordialViz.content)).toBe(defaultLicense);
  });
  it('should return default license if content is missing', () => {
    expect(getLicense(null)).toBe(defaultLicense);
  });
  it('should return default license if content is missing files', () => {
    expect(getLicense({} as Content)).toBe(defaultLicense);
  });

  it('should return specified license', () => {
    expect(
      getLicense({
        ...primordialViz.content,
        files: {
          ...primordialViz.content.files,
          '9693462': {
            name: 'package.json',
            text: '{"license": "GPL-3.0"}',
          },
        },
      }),
    ).toBe('GPL-3.0');
  });

  it('should return default license if package.json is invalid JSON', () => {
    expect(
      getLicense({
        ...primordialViz.content,
        files: {
          ...primordialViz.content.files,
          '9693462': {
            name: 'package.json',
            text: '{"license": "GPL',
          },
        },
      }),
    ).toBe(defaultLicense);
  });
});
