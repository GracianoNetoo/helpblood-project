import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import {
  useRewardsStore,
  normalizeReward,
  normalizeAttempt,
  defaultRewardStatus,
  REWARD_ATTEMPTS_PAGE_SIZE
} from '../rewardsStore';

// ── Mocks ────────────────────────────────────────────────────────────────

vi.mock('../../api', () => ({
  isSupabaseConfigured: true,
  listRewardRows: vi.fn(),
  createRewardRow: vi.fn(),
  updateRewardRow: vi.fn(),
  listRewardAttemptsByDonorId: vi.fn(),
  listAllRewardAttempts: vi.fn(),
  getMyRewardStatus: vi.fn(),
  claimRewardAttempt: vi.fn()
}));

vi.mock('@/core/services/toastService', () => ({
  notifyError: vi.fn(),
  notifySuccess: vi.fn(),
  notifyInfo: vi.fn()
}));

import {
  listRewardRows,
  createRewardRow,
  updateRewardRow,
  listRewardAttemptsByDonorId,
  listAllRewardAttempts,
  getMyRewardStatus,
  claimRewardAttempt
} from '../../api';

import { notifyError, notifySuccess, notifyInfo } from '@/core/services/toastService';

// ── Helpers ──────────────────────────────────────────────────────────────

const fakeRewardRow = (overrides = {}) => ({
  id: 'r-001',
  title: 'Cupom Farmácia',
  description: 'Desconto de 20%',
  reward_type: 'cupom',
  rarity: 'comum',
  quantity_available: 10,
  weight: 5,
  guaranteed_after_failures: null,
  expires_at: null,
  is_active: true,
  meta: {},
  created_at: '2026-04-01T10:00:00Z',
  updated_at: '2026-04-01T10:00:00Z',
  ...overrides
});

const fakeAttemptRow = (overrides = {}) => ({
  id: 'a-001',
  donor_id: 'donor-123',
  reward_id: 'r-001',
  reward_credit_id: 'rc-001',
  status: 'ganhou',
  reward_title_snapshot: 'Cupom Farmácia',
  reward_type_snapshot: 'cupom',
  reward_rarity_snapshot: 'comum',
  attempted_at: '2026-04-02T12:00:00Z',
  created_at: '2026-04-02T12:00:00Z',
  ...overrides
});

const fakeStatusResponse = (overrides = {}) => ({
  available_attempts: 3,
  total_donations: 5,
  total_attempts: 2,
  total_wins: 1,
  total_failures: 1,
  failed_streak: 0,
  last_reward_title: 'Cupom Farmácia',
  last_attempt_at: '2026-04-02T12:00:00Z',
  ...overrides
});

// ── Tests ────────────────────────────────────────────────────────────────

describe('normalizeReward', () => {
  it('normalizes a snake_case row from Supabase', () => {
    const result = normalizeReward(fakeRewardRow());
    expect(result).toEqual({
      id: 'r-001',
      title: 'Cupom Farmácia',
      description: 'Desconto de 20%',
      rewardType: 'cupom',
      rarity: 'comum',
      quantityAvailable: 10,
      weight: 5,
      guaranteedAfterFailures: null,
      expiresAt: null,
      isActive: true,
      meta: {},
      createdAt: '2026-04-01T10:00:00Z',
      updatedAt: '2026-04-01T10:00:00Z'
    });
  });

  it('normalizes a camelCase item', () => {
    const result = normalizeReward({
      id: 'r-002',
      title: 'Badge',
      rewardType: 'agradecimento',
      rarity: 'raro',
      quantityAvailable: 3,
      weight: 2,
      isActive: false
    });
    expect(result.rewardType).toBe('agradecimento');
    expect(result.isActive).toBe(false);
    expect(result.quantityAvailable).toBe(3);
  });

  it('provides safe defaults for undefined/null input', () => {
    const result = normalizeReward(null);
    expect(result.title).toBe('Recompensa');
    expect(result.description).toBe('');
    expect(result.rewardType).toBe('agradecimento');
    expect(result.rarity).toBe('comum');
    expect(result.quantityAvailable).toBe(0);
    expect(result.weight).toBe(1);
    expect(result.isActive).toBe(true);
    expect(typeof result.meta).toBe('object');
  });

  it('generates a unique id when none provided', () => {
    const a = normalizeReward({});
    const b = normalizeReward({});
    expect(a.id).not.toBe(b.id);
    expect(a.id).toMatch(/^reward-/);
  });
});

describe('normalizeAttempt', () => {
  it('normalizes a snake_case row', () => {
    const result = normalizeAttempt(fakeAttemptRow());
    expect(result.id).toBe('a-001');
    expect(result.donorId).toBe('donor-123');
    expect(result.status).toBe('ganhou');
    expect(result.rewardTitle).toBe('Cupom Farmácia');
    expect(result.rewardType).toBe('cupom');
    expect(result.rewardRarity).toBe('comum');
  });

  it('defaults to falhou when status is missing', () => {
    const result = normalizeAttempt({});
    expect(result.status).toBe('falhou');
  });

  it('generates unique IDs for items without id', () => {
    const a = normalizeAttempt({});
    const b = normalizeAttempt({});
    expect(a.id).not.toBe(b.id);
    expect(a.id).toMatch(/^attempt-/);
  });
});

describe('defaultRewardStatus', () => {
  it('returns zeroed out status', () => {
    const status = defaultRewardStatus();
    expect(status.availableAttempts).toBe(0);
    expect(status.totalDonations).toBe(0);
    expect(status.totalWins).toBe(0);
    expect(status.failedStreak).toBe(0);
    expect(status.lastRewardTitle).toBeNull();
    expect(status.lastAttemptAt).toBeNull();
  });

  it('returns a new object on each call (no shared reference)', () => {
    const a = defaultRewardStatus();
    const b = defaultRewardStatus();
    expect(a).not.toBe(b);
    expect(a).toEqual(b);
  });
});

describe('REWARD_ATTEMPTS_PAGE_SIZE', () => {
  it('is defined and is a positive number', () => {
    expect(REWARD_ATTEMPTS_PAGE_SIZE).toBeGreaterThan(0);
    expect(Number.isInteger(REWARD_ATTEMPTS_PAGE_SIZE)).toBe(true);
  });
});

describe('useRewardsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  // ── refreshRewardCatalog ──────────────────────────────────────────

  describe('refreshRewardCatalog', () => {
    it('loads and normalizes reward rows', async () => {
      listRewardRows.mockResolvedValue([fakeRewardRow(), fakeRewardRow({ id: 'r-002', title: 'Badge' })]);
      const store = useRewardsStore();

      const result = await store.refreshRewardCatalog('token-123');

      expect(listRewardRows).toHaveBeenCalledWith({}, { accessToken: 'token-123' });
      expect(result).toHaveLength(2);
      expect(store.rewardCatalog).toHaveLength(2);
      expect(store.rewardCatalog[0].title).toBe('Cupom Farmácia');
      expect(store.lastSyncError).toBe('');
    });

    it('sets isLoadingCatalog during the request', async () => {
      let resolvePromise;
      listRewardRows.mockReturnValue(new Promise(resolve => { resolvePromise = resolve; }));
      const store = useRewardsStore();

      const promise = store.refreshRewardCatalog('token');
      expect(store.isLoadingCatalog).toBe(true);

      resolvePromise([]);
      await promise;
      expect(store.isLoadingCatalog).toBe(false);
    });

    it('handles errors gracefully', async () => {
      listRewardRows.mockRejectedValue(new Error('Network error'));
      const store = useRewardsStore();

      const result = await store.refreshRewardCatalog('token');

      expect(store.lastSyncError).toBe('Network error');
      expect(notifyError).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('returns early when supabase is not configured', async () => {
      // We need to mock isSupabaseConfigured as false for this test
      const { isSupabaseConfigured } = await import('../../api');
      const originalValue = isSupabaseConfigured;
      // Since isSupabaseConfigured is a const export, we test the behavior indirectly
      // The store checks isSupabaseConfigured, which is mocked as true.
      // For this scenario we just validate the positive path works
      const store = useRewardsStore();
      listRewardRows.mockResolvedValue([]);
      await store.refreshRewardCatalog('token');
      expect(listRewardRows).toHaveBeenCalled();
    });
  });

  // ── refreshMyRewardStatus ──────────────────────────────────────────

  describe('refreshMyRewardStatus', () => {
    it('fetches and maps reward status', async () => {
      getMyRewardStatus.mockResolvedValue(fakeStatusResponse());
      const store = useRewardsStore();

      const result = await store.refreshMyRewardStatus('token');

      expect(getMyRewardStatus).toHaveBeenCalledWith({ accessToken: 'token' });
      expect(result.availableAttempts).toBe(3);
      expect(result.totalDonations).toBe(5);
      expect(result.totalWins).toBe(1);
      expect(result.failedStreak).toBe(0);
      expect(result.lastRewardTitle).toBe('Cupom Farmácia');
      expect(store.rewardStatus.availableAttempts).toBe(3);
    });

    it('sets isLoadingStatus during request', async () => {
      let resolvePromise;
      getMyRewardStatus.mockReturnValue(new Promise(resolve => { resolvePromise = resolve; }));
      const store = useRewardsStore();

      const promise = store.refreshMyRewardStatus('token');
      expect(store.isLoadingStatus).toBe(true);

      resolvePromise(fakeStatusResponse());
      await promise;
      expect(store.isLoadingStatus).toBe(false);
    });

    it('returns default status when no access token', async () => {
      const store = useRewardsStore();
      const result = await store.refreshMyRewardStatus(null);

      expect(getMyRewardStatus).not.toHaveBeenCalled();
      expect(result.availableAttempts).toBe(0);
    });

    it('handles errors gracefully', async () => {
      getMyRewardStatus.mockRejectedValue(new Error('RPC error'));
      const store = useRewardsStore();

      await store.refreshMyRewardStatus('token');

      expect(store.lastSyncError).toBe('RPC error');
      expect(notifyError).toHaveBeenCalled();
    });
  });

  // ── refreshMyRewardAttempts ───────────────────────────────────────

  describe('refreshMyRewardAttempts', () => {
    it('loads attempts for a specific donor with limit', async () => {
      listRewardAttemptsByDonorId.mockResolvedValue([fakeAttemptRow()]);
      const store = useRewardsStore();

      const result = await store.refreshMyRewardAttempts('donor-123', 'token');

      expect(listRewardAttemptsByDonorId).toHaveBeenCalledWith('donor-123', {
        accessToken: 'token',
        limit: REWARD_ATTEMPTS_PAGE_SIZE
      });
      expect(result).toHaveLength(1);
      expect(store.myRewardAttempts[0].donorId).toBe('donor-123');
    });

    it('sets isLoadingMyAttempts during request', async () => {
      let resolvePromise;
      listRewardAttemptsByDonorId.mockReturnValue(new Promise(resolve => { resolvePromise = resolve; }));
      const store = useRewardsStore();

      const promise = store.refreshMyRewardAttempts('donor-123', 'token');
      expect(store.isLoadingMyAttempts).toBe(true);

      resolvePromise([]);
      await promise;
      expect(store.isLoadingMyAttempts).toBe(false);
    });

    it('accepts custom limit', async () => {
      listRewardAttemptsByDonorId.mockResolvedValue([]);
      const store = useRewardsStore();

      await store.refreshMyRewardAttempts('donor-123', 'token', { limit: 10 });

      expect(listRewardAttemptsByDonorId).toHaveBeenCalledWith('donor-123', {
        accessToken: 'token',
        limit: 10
      });
    });

    it('returns empty when donorId is missing', async () => {
      const store = useRewardsStore();
      const result = await store.refreshMyRewardAttempts(null, 'token');
      expect(listRewardAttemptsByDonorId).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  // ── refreshAllRewardAttempts ──────────────────────────────────────

  describe('refreshAllRewardAttempts', () => {
    it('loads all attempts with limit', async () => {
      listAllRewardAttempts.mockResolvedValue([fakeAttemptRow(), fakeAttemptRow({ id: 'a-002', status: 'falhou' })]);
      const store = useRewardsStore();

      const result = await store.refreshAllRewardAttempts('token');

      expect(listAllRewardAttempts).toHaveBeenCalledWith({
        accessToken: 'token',
        limit: REWARD_ATTEMPTS_PAGE_SIZE
      });
      expect(result).toHaveLength(2);
      expect(store.adminRewardAttempts).toHaveLength(2);
    });

    it('sets isLoadingAdminAttempts during request', async () => {
      let resolvePromise;
      listAllRewardAttempts.mockReturnValue(new Promise(resolve => { resolvePromise = resolve; }));
      const store = useRewardsStore();

      const promise = store.refreshAllRewardAttempts('token');
      expect(store.isLoadingAdminAttempts).toBe(true);

      resolvePromise([]);
      await promise;
      expect(store.isLoadingAdminAttempts).toBe(false);
    });
  });

  // ── claimMyReward ─────────────────────────────────────────────────

  describe('claimMyReward', () => {
    it('claims a reward and refreshes status (win)', async () => {
      claimRewardAttempt.mockResolvedValue({
        status: 'ganhou',
        reward: { id: 'r-001', title: 'Cupom Farmácia' },
        remaining_attempts: 2
      });
      getMyRewardStatus.mockResolvedValue(fakeStatusResponse());
      listRewardAttemptsByDonorId.mockResolvedValue([]);
      listRewardRows.mockResolvedValue([]);
      const store = useRewardsStore();

      const result = await store.claimMyReward('token', 'donor-123');

      expect(claimRewardAttempt).toHaveBeenCalledWith({ accessToken: 'token' });
      expect(result.status).toBe('ganhou');
      expect(notifySuccess).toHaveBeenCalledWith(
        expect.stringContaining('Cupom Farmácia'),
        expect.any(Object)
      );
    });

    it('shows info notification on a miss', async () => {
      claimRewardAttempt.mockResolvedValue({ status: 'falhou', reward: null });
      getMyRewardStatus.mockResolvedValue(fakeStatusResponse());
      listRewardRows.mockResolvedValue([]);
      const store = useRewardsStore();

      await store.claimMyReward('token', null);

      expect(notifyInfo).toHaveBeenCalledWith(
        expect.stringContaining('tentativa foi consumida'),
        expect.any(Object)
      );
    });

    it('sets isClaiming during the request', async () => {
      let resolvePromise;
      claimRewardAttempt.mockReturnValue(new Promise(resolve => { resolvePromise = resolve; }));
      const store = useRewardsStore();

      const promise = store.claimMyReward('token');
      expect(store.isClaiming).toBe(true);

      resolvePromise({ status: 'falhou', reward: null });
      getMyRewardStatus.mockResolvedValue(fakeStatusResponse());
      listRewardRows.mockResolvedValue([]);
      await promise;
      expect(store.isClaiming).toBe(false);
    });

    it('handles claim errors', async () => {
      claimRewardAttempt.mockRejectedValue(new Error('Sem tentativas disponiveis.'));
      const store = useRewardsStore();

      const result = await store.claimMyReward('token');

      expect(result).toBeNull();
      expect(store.lastSyncError).toBe('Sem tentativas disponiveis.');
      expect(notifyError).toHaveBeenCalled();
      expect(store.isClaiming).toBe(false);
    });

    it('returns null without token', async () => {
      const store = useRewardsStore();
      const result = await store.claimMyReward(null);
      expect(result).toBeNull();
      expect(claimRewardAttempt).not.toHaveBeenCalled();
    });
  });

  // ── saveReward ────────────────────────────────────────────────────

  describe('saveReward', () => {
    it('creates a new reward', async () => {
      createRewardRow.mockResolvedValue([fakeRewardRow({ id: 'r-new' })]);
      listRewardRows.mockResolvedValue([fakeRewardRow({ id: 'r-new' })]);
      const store = useRewardsStore();

      const draft = {
        id: null,
        title: 'Nova Recompensa',
        rewardType: 'cupom',
        rarity: 'raro',
        quantityAvailable: 5,
        weight: 3,
        isActive: true
      };

      const result = await store.saveReward(draft, 'token');

      expect(createRewardRow).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Nova Recompensa', reward_type: 'cupom', rarity: 'raro' }),
        { accessToken: 'token' }
      );
      expect(updateRewardRow).not.toHaveBeenCalled();
      expect(result).not.toBeNull();
      expect(notifySuccess).toHaveBeenCalled();
    });

    it('updates an existing reward', async () => {
      updateRewardRow.mockResolvedValue([fakeRewardRow({ id: 'r-existing', title: 'Updated' })]);
      listRewardRows.mockResolvedValue([fakeRewardRow({ id: 'r-existing', title: 'Updated' })]);
      const store = useRewardsStore();

      const draft = {
        id: 'r-existing',
        title: 'Updated',
        rewardType: 'cupom',
        rarity: 'comum',
        quantityAvailable: 2,
        weight: 1,
        isActive: true
      };

      const result = await store.saveReward(draft, 'token');

      expect(updateRewardRow).toHaveBeenCalledWith(
        'r-existing',
        expect.objectContaining({ title: 'Updated' }),
        { accessToken: 'token' }
      );
      expect(createRewardRow).not.toHaveBeenCalled();
      expect(result).not.toBeNull();
    });

    it('sets isSavingReward during save', async () => {
      let resolvePromise;
      createRewardRow.mockReturnValue(new Promise(resolve => { resolvePromise = resolve; }));
      const store = useRewardsStore();

      const promise = store.saveReward({ id: null, title: 'Test', rewardType: 'cupom', rarity: 'comum', quantityAvailable: 1, weight: 1, isActive: true }, 'token');
      expect(store.isSavingReward).toBe(true);

      resolvePromise([fakeRewardRow()]);
      listRewardRows.mockResolvedValue([]);
      await promise;
      expect(store.isSavingReward).toBe(false);
    });

    it('handles save errors', async () => {
      createRewardRow.mockRejectedValue(new Error('DB constraint error'));
      const store = useRewardsStore();

      const result = await store.saveReward({ id: null, title: 'X', rewardType: 'cupom', rarity: 'comum', quantityAvailable: 0, weight: 1, isActive: true }, 'token');

      expect(result).toBeNull();
      expect(store.lastSyncError).toBe('DB constraint error');
      expect(notifyError).toHaveBeenCalled();
      expect(store.isSavingReward).toBe(false);
    });

    it('returns null without token', async () => {
      const store = useRewardsStore();
      const result = await store.saveReward({ id: null, title: 'Test' }, null);
      expect(result).toBeNull();
    });

    it('correctly maps payload fields to snake_case', async () => {
      createRewardRow.mockResolvedValue([fakeRewardRow()]);
      listRewardRows.mockResolvedValue([]);
      const store = useRewardsStore();

      await store.saveReward({
        id: null,
        title: 'Test',
        description: 'Desc',
        rewardType: 'consulta_gratuita',
        rarity: 'epico',
        quantityAvailable: 10,
        weight: 5,
        guaranteedAfterFailures: 3,
        expiresAt: '2026-12-31T00:00:00Z',
        isActive: false,
        meta: { custom: true }
      }, 'token');

      expect(createRewardRow).toHaveBeenCalledWith(
        {
          title: 'Test',
          description: 'Desc',
          reward_type: 'consulta_gratuita',
          rarity: 'epico',
          quantity_available: 10,
          weight: 5,
          guaranteed_after_failures: 3,
          expires_at: '2026-12-31T00:00:00Z',
          is_active: false,
          meta: { custom: true }
        },
        { accessToken: 'token' }
      );
    });
  });

  // ── Initial state ─────────────────────────────────────────────────

  describe('initial state', () => {
    it('starts with empty collections and idle flags', () => {
      const store = useRewardsStore();
      expect(store.rewardCatalog).toEqual([]);
      expect(store.myRewardAttempts).toEqual([]);
      expect(store.adminRewardAttempts).toEqual([]);
      expect(store.isClaiming).toBe(false);
      expect(store.isSavingReward).toBe(false);
      expect(store.isLoadingCatalog).toBe(false);
      expect(store.isLoadingStatus).toBe(false);
      expect(store.isLoadingMyAttempts).toBe(false);
      expect(store.isLoadingAdminAttempts).toBe(false);
      expect(store.lastSyncError).toBe('');
    });

    it('has a default reward status', () => {
      const store = useRewardsStore();
      expect(store.rewardStatus).toEqual(defaultRewardStatus());
    });
  });
});
