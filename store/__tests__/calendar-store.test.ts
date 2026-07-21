import AsyncStorage from '@react-native-async-storage/async-storage';

import { calendarStorage } from '@/storage';
import { useCalendarStore, type NewBlockInput } from '@/store';

const store = () => useCalendarStore.getState();
const H = (h: number, m = 0) => h * 60 + m;

const workBlock: NewBlockInput = {
  dayOfWeek: 'monday',
  startMinutes: H(9),
  endMinutes: H(13),
  category: 'work',
  title: '  Oficina  ',
};

describe('useCalendarStore', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    await store().resetCalendar();
  });

  it('ensureSchedule creates and persists an empty schedule', async () => {
    const schedule = await store().ensureSchedule();
    expect(schedule.blocks).toEqual([]);
    expect(await calendarStorage.getSchedule()).not.toBeNull();
  });

  it('addBlock trims the title and persists', async () => {
    const block = await store().addBlock(workBlock);
    expect(block.title).toBe('Oficina');
    expect(store().schedule?.blocks).toHaveLength(1);
    const persisted = await calendarStorage.getSchedule();
    expect(persisted?.blocks[0].startMinutes).toBe(H(9));
  });

  it('updateBlock and removeBlock work', async () => {
    const block = await store().addBlock(workBlock);
    await store().updateBlock(block.id, { endMinutes: H(14) });
    expect(store().schedule?.blocks[0].endMinutes).toBe(H(14));
    await store().removeBlock(block.id);
    expect(store().schedule?.blocks).toHaveLength(0);
  });

  it('moveBlock preserves duration', async () => {
    const block = await store().addBlock(workBlock); // 4h
    await store().moveBlock(block.id, H(15));
    const moved = store().schedule?.blocks[0];
    expect(moved?.startMinutes).toBe(H(15));
    expect(moved?.endMinutes).toBe(H(19));
  });

  it('copyBlockToDay copies when free and reports a conflict otherwise', async () => {
    const block = await store().addBlock(workBlock);
    const ok = await store().copyBlockToDay(block.id, 'tuesday');
    expect(ok).toEqual({ copied: 1, skipped: 0 });
    // Copying again onto Tuesday now conflicts.
    const clash = await store().copyBlockToDay(block.id, 'tuesday');
    expect(clash).toEqual({ copied: 0, skipped: 1 });
  });

  it('copyDayToDays copies to Mon–Fri and skips conflicts', async () => {
    await store().addBlock(workBlock);
    // Pre-place a conflicting block on Wednesday.
    await store().addBlock({ ...workBlock, dayOfWeek: 'wednesday', startMinutes: H(10), endMinutes: H(11) });
    const report = await store().copyDayToDays('monday', ['tuesday', 'wednesday', 'thursday', 'friday']);
    // Tuesday, Thursday, Friday copy (3); Wednesday conflicts (1 skipped).
    expect(report.copied).toBe(3);
    expect(report.skipped).toBe(1);
  });

  it('clearDay and resetWeek remove blocks', async () => {
    await store().addBlock(workBlock);
    await store().addBlock({ ...workBlock, dayOfWeek: 'tuesday' });
    await store().clearDay('monday');
    expect(store().schedule?.blocks.every((b) => b.dayOfWeek !== 'monday')).toBe(true);
    await store().resetWeek();
    expect(store().schedule?.blocks).toHaveLength(0);
  });

  it('persists and re-hydrates blocks and selected day', async () => {
    await store().addBlock(workBlock);
    store().setSelectedDay('friday');
    // Simulate relaunch.
    useCalendarStore.setState({ schedule: null, isHydrated: false });
    await store().hydrate();
    expect(store().schedule?.blocks).toHaveLength(1);
    expect(store().selectedDay).toBe('friday');
  });

  it('completeSetup persists the setup flag', async () => {
    await store().completeSetup();
    expect(store().meta.setupCompleted).toBe(true);
    expect((await calendarStorage.getMeta()).setupCompleted).toBe(true);
  });

  it('resetCalendar clears memory and storage', async () => {
    await store().addBlock(workBlock);
    await store().completeSetup();
    await store().resetCalendar();
    expect(store().schedule).toBeNull();
    expect(store().meta.setupCompleted).toBe(false);
    expect(await calendarStorage.getSchedule()).toBeNull();
  });
});
