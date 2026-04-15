import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Mocks ────────────────────────────────────────────────────────────────

const mockSelectRows = vi.fn();
const mockInsertRows = vi.fn();
const mockUpdateRows = vi.fn();
const mockInvokeRpc = vi.fn();

vi.mock('@/core/supabase/client', () => ({
  isSupabaseConfigured: true,
  selectRows: (...args) => mockSelectRows(...args),
  insertRows: (...args) => mockInsertRows(...args),
  updateRows: (...args) => mockUpdateRows(...args),
  invokeRpc: (...args) => mockInvokeRpc(...args)
}));

import {
  listRewardRows,
  createRewardRow,
  updateRewardRow,
  listRewardAttemptRows,
  listRewardAttemptsByDonorId,
  listAllRewardAttempts,
  getMyRewardStatus,
  claimRewardAttempt
} from '../api';

// ── Tests ────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Rewards API', () => {
  describe('listRewardRows', () => {
    it('selects from rewards with default ordering', async () => {
      mockSelectRows.mockResolvedValue([]);
      await listRewardRows();

      expect(mockSelectRows).toHaveBeenCalledWith(
        'rewards',
        expect.objectContaining({
          select: '*',
          order: 'is_active.desc,created_at.desc'
        }),
        {}
      );
    });

    it('passes custom filters', async () => {
      mockSelectRows.mockResolvedValue([]);
      await listRewardRows({ is_active: 'eq.true' }, { accessToken: 'tok' });

      expect(mockSelectRows).toHaveBeenCalledWith(
        'rewards',
        expect.objectContaining({ is_active: 'eq.true' }),
        { accessToken: 'tok' }
      );
    });
  });

  describe('createRewardRow', () => {
    it('inserts a reward', async () => {
      const payload = { title: 'Test Reward' };
      mockInsertRows.mockResolvedValue([{ id: '1', ...payload }]);

      await createRewardRow(payload, { accessToken: 'tok' });

      expect(mockInsertRows).toHaveBeenCalledWith('rewards', payload, { accessToken: 'tok' });
    });
  });

  describe('updateRewardRow', () => {
    it('updates a reward by id', async () => {
      const patch = { title: 'Updated' };
      mockUpdateRows.mockResolvedValue([{ id: 'r-1', ...patch }]);

      await updateRewardRow('r-1', patch, { accessToken: 'tok' });

      expect(mockUpdateRows).toHaveBeenCalledWith(
        'rewards',
        { id: 'eq.r-1' },
        patch,
        { accessToken: 'tok' }
      );
    });
  });

  describe('listRewardAttemptRows', () => {
    it('selects attempts with default ordering', async () => {
      mockSelectRows.mockResolvedValue([]);
      await listRewardAttemptRows();

      expect(mockSelectRows).toHaveBeenCalledWith(
        'reward_attempts',
        expect.objectContaining({
          select: '*',
          order: 'attempted_at.desc,created_at.desc'
        }),
        {}
      );
    });

    it('passes limit as a string in filters', async () => {
      mockSelectRows.mockResolvedValue([]);
      await listRewardAttemptRows({}, { limit: 25 });

      expect(mockSelectRows).toHaveBeenCalledWith(
        'reward_attempts',
        expect.objectContaining({
          limit: '25'
        }),
        {}
      );
    });

    it('does not include limit when zero or undefined', async () => {
      mockSelectRows.mockResolvedValue([]);
      await listRewardAttemptRows({}, {});

      const call = mockSelectRows.mock.calls[0];
      expect(call[1]).not.toHaveProperty('limit');
    });
  });

  describe('listRewardAttemptsByDonorId', () => {
    it('filters by donor_id and supports limit', async () => {
      mockSelectRows.mockResolvedValue([]);
      await listRewardAttemptsByDonorId('donor-123', { accessToken: 'tok', limit: 50 });

      expect(mockSelectRows).toHaveBeenCalledWith(
        'reward_attempts',
        expect.objectContaining({
          donor_id: 'eq.donor-123',
          limit: '50'
        }),
        { accessToken: 'tok' }
      );
    });
  });

  describe('listAllRewardAttempts', () => {
    it('fetches all attempts with limit', async () => {
      mockSelectRows.mockResolvedValue([]);
      await listAllRewardAttempts({ accessToken: 'tok', limit: 30 });

      expect(mockSelectRows).toHaveBeenCalledWith(
        'reward_attempts',
        expect.objectContaining({
          limit: '30'
        }),
        { accessToken: 'tok' }
      );
    });
  });

  describe('getMyRewardStatus', () => {
    it('invokes the RPC function', async () => {
      mockInvokeRpc.mockResolvedValue({ available_attempts: 3 });
      const result = await getMyRewardStatus({ accessToken: 'tok' });

      expect(mockInvokeRpc).toHaveBeenCalledWith('get_my_reward_status', {}, { accessToken: 'tok' });
      expect(result.available_attempts).toBe(3);
    });
  });

  describe('claimRewardAttempt', () => {
    it('invokes the claim RPC function', async () => {
      mockInvokeRpc.mockResolvedValue({ status: 'ganhou' });
      const result = await claimRewardAttempt({ accessToken: 'tok' });

      expect(mockInvokeRpc).toHaveBeenCalledWith('claim_reward_attempt', {}, { accessToken: 'tok' });
      expect(result.status).toBe('ganhou');
    });
  });
});
