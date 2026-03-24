import { describe, it, expect } from 'vitest';
import { redactPII } from '../src/privacy/pii-redactor.js';
import { validateNoPiiLeak } from '../src/privacy/pii-validator.js';

describe('PII Redactor', () => {
  describe('Email detection', () => {
    it('redacts standard emails', () => {
      const { redacted, entities } = redactPII('Contact me at john@example.com please');
      expect(redacted).toBe('Contact me at [EMAIL] please');
      expect(entities).toHaveLength(1);
      expect(entities[0].type).toBe('EMAIL');
      expect(entities[0].original).toBe('john@example.com');
    });
  });

  describe('Phone detection', () => {
    it('redacts US phone numbers', () => {
      const { redacted } = redactPII('Call me at 555-123-4567');
      expect(redacted).toContain('[PHONE]');
      expect(redacted).not.toContain('555-123-4567');
    });

    it('redacts international format', () => {
      const { redacted } = redactPII('His number is +972-52-123-4567');
      expect(redacted).toContain('[PHONE]');
      expect(redacted).not.toContain('972');
    });
  });

  describe('ID number detection', () => {
    it('redacts SSN pattern', () => {
      const { redacted, entities } = redactPII('My SSN is 123-45-6789');
      expect(redacted).toBe('My SSN is [ID_NUMBER]');
      expect(entities[0].type).toBe('ID_NUMBER');
    });
  });

  describe('URL detection', () => {
    it('redacts URLs', () => {
      const { redacted } = redactPII('Check https://example.com/profile for details');
      expect(redacted).toContain('[URL]');
      expect(redacted).not.toContain('https://example.com');
    });
  });

  describe('Address detection', () => {
    it('redacts street addresses', () => {
      const { redacted } = redactPII('We met at 123 Main Street last week');
      expect(redacted).toContain('[ADDRESS]');
      expect(redacted).not.toContain('123 Main Street');
    });

    it('redacts avenue addresses', () => {
      const { redacted } = redactPII('The restaurant on 45 Park Ave was nice');
      expect(redacted).toContain('[ADDRESS]');
    });
  });

  describe('Name detection (contextual)', () => {
    it('redacts names after relationship words', () => {
      const { redacted, entities } = redactPII('My partner John never listens to me');
      expect(redacted).toBe('My partner [PERSON] never listens to me');
      expect(entities.some(e => e.type === 'PERSON' && e.original === 'John')).toBe(true);
    });

    it('redacts names after "with"', () => {
      const { redacted } = redactPII('He cheated with Sarah from work');
      expect(redacted).toContain('[PERSON]');
      expect(redacted).not.toContain('Sarah');
    });

    it('redacts names as sentence subjects', () => {
      const { redacted } = redactPII('Michael always comes home late');
      expect(redacted).toContain('[PERSON]');
      expect(redacted).not.toContain('Michael');
    });

    it('does not redact common words', () => {
      const { redacted } = redactPII('Sometimes I just want to be alone');
      expect(redacted).toBe('Sometimes I just want to be alone');
    });

    it('does not redact days of the week', () => {
      const { redacted, entities } = redactPII('Every Monday he comes home late');
      expect(entities.filter(e => e.type === 'PERSON')).toHaveLength(0);
    });
  });

  describe('No PII', () => {
    it('returns unchanged text when no PII found', () => {
      const input = 'I feel unheard when we argue about chores';
      const { redacted, entities } = redactPII(input);
      expect(redacted).toBe(input);
      expect(entities).toHaveLength(0);
    });
  });

  describe('Multiple PII types', () => {
    it('redacts mixed PII', () => {
      const input = 'My husband David (david@gmail.com, 555-123-4567) lives at 42 Oak Drive';
      const { redacted, entities } = redactPII(input);
      expect(redacted).not.toContain('David');
      expect(redacted).not.toContain('david@gmail.com');
      expect(redacted).not.toContain('555-123-4567');
      expect(redacted).not.toContain('42 Oak Drive');
      expect(entities.length).toBeGreaterThanOrEqual(3);
    });
  });
});

describe('PII Post-Flight Validator', () => {
  it('strips leaked name from Tier 3 output', () => {
    const entities = [{ type: 'PERSON' as const, original: 'John', replacement: '[PERSON]', startIndex: 0, endIndex: 4 }];
    const output = validateNoPiiLeak('It sounds like John is important to you', entities);
    expect(output).toBe('It sounds like [PERSON] is important to you');
    expect(output).not.toContain('John');
  });

  it('handles case-insensitive leaks', () => {
    const entities = [{ type: 'EMAIL' as const, original: 'Test@Example.com', replacement: '[EMAIL]', startIndex: 0, endIndex: 16 }];
    const output = validateNoPiiLeak('Reach out at test@example.com', entities);
    expect(output).not.toContain('test@example.com');
  });

  it('returns original when no entities', () => {
    const output = validateNoPiiLeak('How does that make you feel?', []);
    expect(output).toBe('How does that make you feel?');
  });

  it('returns original when no leaks found', () => {
    const entities = [{ type: 'PERSON' as const, original: 'John', replacement: '[PERSON]', startIndex: 0, endIndex: 4 }];
    const output = validateNoPiiLeak('Feeling heard matters in relationships', entities);
    expect(output).toBe('Feeling heard matters in relationships');
  });
});
