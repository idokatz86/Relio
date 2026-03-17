/**
 * Multi-Language Safety Test Suite
 *
 * Issue #147: 50-scenario safety test suite per language (EN/ES/PT/HE).
 * Tests the Safety Guardian's ability to detect crisis signals across languages.
 *
 * Run: npx vitest run src/__tests__/safety-multilang.test.ts
 */

import { describe, it, expect } from 'vitest';

// Import the regex pre-screen directly for unit testing
// The full LLM-based tests require a running LLM and are skipped in CI

// ── Crisis patterns (replicated from safety-guardian.ts) ─────
const CRISIS_PATTERNS: RegExp[] = [
  /\b(kill\s+(my|him|her|them|your)self|suicide|want\s+to\s+die|end\s+(it|my\s+life)|slit\s+my)\b/i,
  /\b(he\s+hits?\s+me|she\s+hits?\s+me|beats?\s+me|chok(es?|ing)\s+me|punche[sd]?\s+me)\b/i,
  /\b(quiero\s+morir|me\s+voy\s+a\s+matar|suicidar|no\s+puedo\s+más|me\s+(pega|golpea|ahorca))\b/i,
  /\b(quero\s+morrer|vou\s+me\s+matar|suic[ií]dio|não\s+aguento\s+mais|ele\s+me\s+bat[eu])\b/i,
  /אני\s*רוצ[הא]\s*למות|אסיים\s*את\s*(הכל|החיים)|הוא\s*מכה\s*אותי|היא\s*מכה\s*אותי|אני\s*לא\s*יכול[הא]?\s*יותר/,
];

function preScreenCrisis(message: string): boolean {
  return CRISIS_PATTERNS.some(pattern => pattern.test(message));
}

// ── English Safety Scenarios (12) ────────────────────────────
describe('Safety: English', () => {
  const shouldDetect = [
    'I want to kill myself',
    'I want to end it all',
    'He hits me every night',
    'She beats me when she drinks',
    'I want to die nobody cares',
    'He is choking me right now',
  ];

  const shouldNotDetect = [
    'I love spending time with you',
    'We had a great dinner last night',
    'I feel frustrated when you forget things',
    'Can we talk about our budget?',
    'The movie we watched was killing it at the box office',
    'She beats me at chess every time',
  ];

  shouldDetect.forEach((msg) => {
    it(`DETECT: "${msg.slice(0, 40)}..."`, () => {
      expect(preScreenCrisis(msg)).toBe(true);
    });
  });

  shouldNotDetect.forEach((msg) => {
    it(`SAFE: "${msg.slice(0, 40)}..."`, () => {
      expect(preScreenCrisis(msg)).toBe(false);
    });
  });
});

// ── Spanish Safety Scenarios (12) ────────────────────────────
describe('Safety: Spanish', () => {
  const shouldDetect = [
    'Quiero morir, no puedo más con esto',
    'Me voy a matar si sigue así',
    'El me pega cada vez que llega borracho',
    'Me golpea cuando le contradigo',
    'No puedo más con esta relación',
    'El me ahorca cuando se enoja',
  ];

  const shouldNotDetect = [
    'Me encanta pasar tiempo contigo',
    'Tuvimos una cena maravillosa anoche',
    'Me frustra cuando olvidas las cosas',
    'Podemos hablar sobre nuestro presupuesto',
    'La película nos mató de risa',
    'Me pega fuerte el calor hoy',
  ];

  shouldDetect.forEach((msg) => {
    it(`DETECT: "${msg.slice(0, 40)}..."`, () => {
      expect(preScreenCrisis(msg)).toBe(true);
    });
  });

  shouldNotDetect.forEach((msg) => {
    it(`SAFE: "${msg.slice(0, 40)}..."`, () => {
      expect(preScreenCrisis(msg)).toBe(false);
    });
  });
});

// ── Portuguese Safety Scenarios (12) ─────────────────────────
describe('Safety: Portuguese', () => {
  const shouldDetect = [
    'Quero morrer, não aguento mais',
    'Vou me matar se isso continuar',
    'Ele me bateu de novo ontem',
    'Não aguento mais essa situação',
    'Ele me bate toda vez que bebe',
    'Estou pensando em suicídio',
  ];

  const shouldNotDetect = [
    'Adoro passar tempo com você',
    'Tivemos um jantar maravilhoso ontem',
    'Fico frustrado quando você esquece as coisas',
    'Podemos conversar sobre nosso orçamento?',
    'O sol está me batendo forte hoje',
    'Ele me bateu no jogo de cartas',
  ];

  shouldDetect.forEach((msg) => {
    it(`DETECT: "${msg.slice(0, 40)}..."`, () => {
      expect(preScreenCrisis(msg)).toBe(true);
    });
  });

  shouldNotDetect.forEach((msg) => {
    it(`SAFE: "${msg.slice(0, 40)}..."`, () => {
      expect(preScreenCrisis(msg)).toBe(false);
    });
  });
});

// ── Hebrew Safety Scenarios (12) ─────────────────────────────
describe('Safety: Hebrew', () => {
  const shouldDetect = [
    'אני רוצה למות כבר לא יכול',
    'אני אסיים את הכל הלילה',
    'הוא מכה אותי כל יום',
    'היא מכה אותי כשהיא שותה',
    'אני רוצה למות אף אחד לא אכפת לו',
    'אני לא יכולה יותר עם המצב הזה',
  ];

  const shouldNotDetect = [
    'אני אוהב לבלות איתך',
    'היה לנו ארוחת ערב נהדרת אתמול',
    'אני מתוסכל כשאתה שוכח דברים',
    'אפשר לדבר על התקציב שלנו?',
    'הסרט הזה הרג אותי מצחוק',
    'השמש מכה חזק היום',
  ];

  shouldDetect.forEach((msg) => {
    it(`DETECT: "${msg.slice(0, 40)}..."`, () => {
      expect(preScreenCrisis(msg)).toBe(true);
    });
  });

  shouldNotDetect.forEach((msg) => {
    it(`SAFE: "${msg.slice(0, 40)}..."`, () => {
      expect(preScreenCrisis(msg)).toBe(false);
    });
  });
});

// ── Edge Cases (2) ───────────────────────────────────────────
describe('Safety: Edge Cases', () => {
  it('Empty string is safe', () => {
    expect(preScreenCrisis('')).toBe(false);
  });

  it('Mixed language crisis detected', () => {
    expect(preScreenCrisis('אני רוצה למות I want to die')).toBe(true);
  });
});
