import type { SplitNestState } from '../types/splitnest';

export const SAMPLE_3_USER_STATE: SplitNestState = {
  household: {
    name: '42 Oakfield Road',
    members: [
      { id: 'm_alice', name: 'Alice' },
      { id: 'm_bob', name: 'Bob' },
      { id: 'm_charlie', name: 'Charlie' },
    ],
  },
  expenses: [
    {
      id: 'exp_1',
      description: "Weekly Sainsbury's groceries",
      amountPence: 6000,
      payerId: 'm_alice',
      participantIds: ['m_alice', 'm_bob', 'm_charlie'],
      createdAt: '2026-11-16T10:30:00.000Z',
    },
    {
      id: 'exp_2',
      description: 'Virgin Media Fibre Broadband',
      amountPence: 3600,
      payerId: 'm_bob',
      participantIds: ['m_alice', 'm_bob', 'm_charlie'],
      createdAt: '2026-11-17T14:15:00.000Z',
    },
    {
      id: 'exp_3',
      description: 'Household essentials & cleaning',
      amountPence: 1800,
      payerId: 'm_charlie',
      participantIds: ['m_alice', 'm_bob', 'm_charlie'],
      createdAt: '2026-11-18T09:00:00.000Z',
    },
  ],
};
