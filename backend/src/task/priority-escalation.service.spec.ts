import { Test, TestingModule } from '@nestjs/testing';
import { PriorityEscalationService } from './priority-escalation.service';
import { PrismaService } from '../prisma/prisma.service';
import { ActivitiesService } from '../activities/activities.service';
import { createPrismaMock, PrismaMock } from '../test/prisma.mock';

describe('PriorityEscalationService', () => {
  let service: PriorityEscalationService;
  let prisma: PrismaMock;
  let activities: { log: jest.Mock };

  const now = new Date('2026-06-11T12:00:00.000Z');
  const inHours = (h: number) => new Date(now.getTime() + h * 60 * 60 * 1000);

  beforeEach(async () => {
    prisma = createPrismaMock();
    activities = { log: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PriorityEscalationService,
        { provide: PrismaService, useValue: prisma },
        { provide: ActivitiesService, useValue: activities },
      ],
    }).compile();
    service = module.get(PriorityEscalationService);
  });

  it('only scans dated, non-DONE tasks within the escalation horizon', async () => {
    prisma.task.findMany.mockResolvedValue([]);
    await service.run(now);
    expect(prisma.task.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          dueDate: expect.objectContaining({ not: null }),
          column: { type: { not: 'DONE' } },
        }),
      }),
    );
  });

  it('raises priority and logs an activity for tasks entering a tighter window', async () => {
    prisma.task.findMany.mockResolvedValue([
      {
        id: 't1',
        priority: 'MEDIUM',
        basePriority: 'MEDIUM',
        dueDate: inHours(3),
        title: 'Soon',
        column: { boardId: 'b1' },
      },
    ]);

    const changed = await service.run(now);

    expect(changed).toBe(1);
    expect(prisma.task.update).toHaveBeenCalledWith({
      where: { id: 't1' },
      data: { priority: 'HIGH' },
    });
    expect(activities.log).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'TASK_UPDATED',
        taskId: 't1',
        metadata: expect.objectContaining({ auto: true, reason: 'deadline' }),
      }),
    );
  });

  it('leaves tasks whose effective priority is unchanged', async () => {
    prisma.task.findMany.mockResolvedValue([
      {
        id: 't2',
        priority: 'HIGH',
        basePriority: 'MEDIUM',
        dueDate: inHours(3), // floor is HIGH, already HIGH
        title: 'Already high',
        column: { boardId: 'b1' },
      },
    ]);

    const changed = await service.run(now);

    expect(changed).toBe(0);
    expect(prisma.task.update).not.toHaveBeenCalled();
    expect(activities.log).not.toHaveBeenCalled();
  });
});
