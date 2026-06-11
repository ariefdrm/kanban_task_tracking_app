import { deadlineFloor, escalatePriority } from './priority-escalation';

const now = new Date('2026-06-11T12:00:00.000Z');
const hours = (h: number) => new Date(now.getTime() + h * 60 * 60 * 1000);

describe('deadlineFloor', () => {
  it('imposes no floor without a due date', () => {
    expect(deadlineFloor(null, now)).toBeNull();
  });

  it('imposes no floor when the deadline is far away (> 72h)', () => {
    expect(deadlineFloor(hours(73), now)).toBeNull();
  });

  it('floors to MEDIUM within 72h', () => {
    expect(deadlineFloor(hours(72), now)).toBe('MEDIUM');
    expect(deadlineFloor(hours(48), now)).toBe('MEDIUM');
  });

  it('floors to HIGH within 24h', () => {
    expect(deadlineFloor(hours(24), now)).toBe('HIGH');
    expect(deadlineFloor(hours(1), now)).toBe('HIGH');
  });

  it('floors overdue tasks to HIGH', () => {
    expect(deadlineFloor(hours(-5), now)).toBe('HIGH');
  });
});

describe('escalatePriority', () => {
  it('raises LOW to MEDIUM as the 72h window is entered', () => {
    expect(escalatePriority('LOW', hours(48), now)).toBe('MEDIUM');
  });

  it('raises to HIGH inside 24h', () => {
    expect(escalatePriority('LOW', hours(12), now)).toBe('HIGH');
  });

  it('never lowers a manual priority below its baseline', () => {
    // Manual HIGH stays HIGH even with a distant deadline.
    expect(escalatePriority('HIGH', hours(200), now)).toBe('HIGH');
    expect(escalatePriority('HIGH', null, now)).toBe('HIGH');
    // 72h window would suggest MEDIUM, but manual HIGH wins.
    expect(escalatePriority('HIGH', hours(48), now)).toBe('HIGH');
  });

  it('leaves priority untouched when no deadline pressure applies', () => {
    expect(escalatePriority('LOW', hours(200), now)).toBe('LOW');
    expect(escalatePriority('MEDIUM', null, now)).toBe('MEDIUM');
  });
});
