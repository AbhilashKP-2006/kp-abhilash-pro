import test from 'node:test';
import assert from 'node:assert/strict';
import { easeOutCubic, shouldIncludePixel, computeSwarmStart, evaluateParticleMotion } from './particleMath';
import { sanitizeUserMessage, checkRateLimit, SYSTEM_PROMPT } from './chatHelpers';
import { CERTIFICATES, PROJECTS, ACHIEVEMENTS, PERSONAL_INFO } from '../data/portfolioData';

test('particleMath: easeOutCubic is bounded between 0 and 1 and monotonic', () => {
  assert.equal(easeOutCubic(0), 0);
  assert.equal(easeOutCubic(1), 1);
  assert.ok(easeOutCubic(0.5) > 0.5);
  assert.ok(easeOutCubic(0.8) > easeOutCubic(0.5));
});

test('particleMath: shouldIncludePixel rejects low alpha and accepts alpha > 160 for clean edges', () => {
  assert.equal(shouldIncludePixel(0), false);
  assert.equal(shouldIncludePixel(160), false);
  assert.equal(shouldIncludePixel(161), true);
  assert.equal(shouldIncludePixel(255), true);
});

test('particleMath: computeSwarmStart produces swarm coordinates around perimeter', () => {
  const swarm = computeSwarmStart(1000, 800, 10, 100);
  assert.ok(Number.isFinite(swarm.startX));
  assert.ok(Number.isFinite(swarm.startY));
  assert.ok(swarm.delay >= 0 && swarm.delay <= 0.4);
  assert.ok(swarm.curveK >= -0.45 && swarm.curveK <= 0.45);
});

test('particleMath: evaluateParticleMotion lands accurately at target when t >= 1.0', () => {
  const sx = 100, sy = 200, tx = 500, ty = 600;
  const delay = 0.2, curveK = 0.3;
  // At t = 1.0 (after total duration 3.6s), p = clamp((1.0 - 0.2)/0.6) = 1.0
  const finalPos = evaluateParticleMotion(sx, sy, tx, ty, delay, curveK, 1.0);
  assert.equal(finalPos.p, 1);
  assert.ok(Math.abs(finalPos.x - tx) < 0.001);
  assert.ok(Math.abs(finalPos.y - ty) < 0.001);
});

test('chatHelpers: sanitizeUserMessage properly validates input', () => {
  assert.equal(sanitizeUserMessage('').valid, false);
  assert.equal(sanitizeUserMessage('   ').valid, false);
  
  const validMsg = sanitizeUserMessage('Tell me about your projects');
  assert.equal(validMsg.valid, true);
  assert.equal(validMsg.text, 'Tell me about your projects');

  const longMsg = 'a'.repeat(600);
  const sanitizedLong = sanitizeUserMessage(longMsg);
  assert.equal(sanitizedLong.valid, false);
});

test('chatHelpers: checkRateLimit enforces 20 messages per client', () => {
  const testClient = 'test-client-' + Date.now();
  for (let i = 0; i < 20; i++) {
    const res = checkRateLimit(testClient, 20);
    assert.equal(res.allowed, true);
  }
  const blocked = checkRateLimit(testClient, 20);
  assert.equal(blocked.allowed, false);
});

test('portfolioData: strict adherence to facts and counts', () => {
  // Exactly 15 certificates as requested
  assert.equal(CERTIFICATES.length, 15);

  // Check no duplicate certificate names
  const certNames = new Set(CERTIFICATES.map(c => c.name));
  assert.equal(certNames.size, 15);

  // Check BYTEATHON 2026 is Top 30 Finalist
  const byteathon = ACHIEVEMENTS.find(a => a.id === 'byteathon-2026');
  assert.ok(byteathon);
  assert.equal(byteathon?.badge, 'TOP 30 FINALIST');

  // Check Projects are marked CONCEPT or HACKATHON
  PROJECTS.forEach(p => {
    assert.ok(p.tag === 'CONCEPT' || p.tag === 'HACKATHON');
  });

  // Check Abhilash name is in system prompt
  assert.ok(SYSTEM_PROMPT.includes('ABHILASH K P'));
  assert.ok(SYSTEM_PROMPT.includes('TOP 30 FINALIST'));
});
