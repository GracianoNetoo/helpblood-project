export const DONATION_RECOVERY_DAYS = 56;

const startOfDay = (value = new Date()) => {
  const parsed = value instanceof Date ? new Date(value) : new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  parsed.setHours(0, 0, 0, 0);
  return parsed;
};

export const addDays = (value, days) => {
  const parsed = startOfDay(value);
  if (!parsed) return null;
  parsed.setDate(parsed.getDate() + days);
  return parsed;
};

export const formatEligibilityDate = (value) => {
  const parsed = startOfDay(value);
  if (!parsed) return 'Data a definir';
  return new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(parsed);
};

const getDiffInDays = (futureDate, nowDate) => {
  const future = startOfDay(futureDate);
  const now = startOfDay(nowDate);
  if (!future || !now) return 0;
  return Math.ceil((future.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
};

export const getDonationEligibility = (donor, options = {}) => {
  const now = startOfDay(options.now || new Date()) || new Date();
  const reasons = [];

  const lastDonationDate = donor?.lastDonationDate ? startOfDay(donor.lastDonationDate) : null;
  const nextEligibleDate = lastDonationDate ? addDays(lastDonationDate, DONATION_RECOVERY_DAYS) : null;

  if (nextEligibleDate && nextEligibleDate.getTime() > now.getTime()) {
    const daysUntilRecovery = getDiffInDays(nextEligibleDate, now);
    reasons.push(
      daysUntilRecovery <= 1
        ? 'Ainda está no período mínimo de recuperação de 56 dias.'
        : `Ainda faltam ${daysUntilRecovery} dias para completar o período mínimo de recuperação de 56 dias.`
    );
  }

  const temporaryDeferralUntil = donor?.temporaryDeferralUntil ? startOfDay(donor.temporaryDeferralUntil) : null;
  if (temporaryDeferralUntil && temporaryDeferralUntil.getTime() > now.getTime()) {
    reasons.push(`Elegibilidade adiada até ${formatEligibilityDate(temporaryDeferralUntil)}.`);
  }

  if (donor?.recentMedication) {
    reasons.push('Existe um bloqueio temporário por medicação recente.');
  }

  if (donor?.recentTravel) {
    reasons.push('Existe um bloqueio temporário por viagem recente.');
  }

  if (Array.isArray(donor?.eligibilityRestrictions)) {
    donor.eligibilityRestrictions
      .filter(Boolean)
      .forEach((item) => reasons.push(String(item)));
  }

  if (donor?.eligibilityNote) {
    reasons.push(String(donor.eligibilityNote));
  }

  const daysRemaining = nextEligibleDate && nextEligibleDate.getTime() > now.getTime()
    ? getDiffInDays(nextEligibleDate, now)
    : 0;

  const isEligible = reasons.length === 0;
  const countdownLabel = isEligible
    ? 'Disponível para doar hoje'
    : daysRemaining <= 1
      ? 'Disponível amanhã'
      : `Disponível em ${daysRemaining} dias`;

  return {
    isEligible,
    reasons,
    lastDonationDate,
    nextEligibleDate,
    daysRemaining,
    countdownLabel
  };
};
