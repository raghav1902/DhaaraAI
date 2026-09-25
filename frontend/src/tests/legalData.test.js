import { describe, it, expect } from 'vitest';
import { FALLBACK_CONCORDANCE_DB } from '../data/concordanceData';
import { HELPLINES, RIGHTS_TOPICS } from '../data/citizenRightsData';
import { STAMP_DUTY_RATES, TRAFFIC_VIOLATIONS } from '../data/feeCalculatorData';

describe('Real Indian Legal Datasets Verification', () => {
  it('should contain verified BNS 2023 concordance mappings', () => {
    expect(FALLBACK_CONCORDANCE_DB.length).toBeGreaterThanOrEqual(10);
    const theft = FALLBACK_CONCORDANCE_DB.find(i => i.ipc_section?.includes('379'));
    expect(theft).toBeDefined();
    expect(theft?.bns_section).toContain('303');
    expect(theft?.bns_act).toContain('Bharatiya Nyaya Sanhita');
  });

  it('should contain genuine government emergency helplines', () => {
    expect(HELPLINES.length).toBeGreaterThan(5);
    const cyber = HELPLINES.find(h => h.number === '1930');
    expect(cyber).toBeDefined();
    expect(cyber?.title).toContain('Cyber');

    const police = HELPLINES.find(h => h.number === '112');
    expect(police).toBeDefined();
  });

  it('should contain statutory citizen rights playbooks', () => {
    expect(RIGHTS_TOPICS.length).toBeGreaterThan(3);
    const arrestTopic = RIGHTS_TOPICS.find(t => t.id === 'police_arrest');
    expect(arrestTopic).toBeDefined();
    expect(arrestTopic?.rules.length).toBeGreaterThan(0);
    const sec35Rule = arrestTopic?.rules.find(r => r.section?.includes('35') || r.heading.includes('Notice'));
    expect(sec35Rule).toBeDefined();
  });

  it('should contain realistic stamp duty and MV Act fine schedules', () => {
    expect(STAMP_DUTY_RATES['Delhi']).toBeDefined();
    expect(STAMP_DUTY_RATES['Maharashtra']).toBeDefined();
    expect(TRAFFIC_VIOLATIONS.length).toBeGreaterThan(5);
    const helmetViolation = TRAFFIC_VIOLATIONS.find(v => v.id === 'helmet');
    expect(helmetViolation?.fine).toBe(1000);
  });
});
