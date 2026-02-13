export const MAX_EMAILS_PER_DAY = parseInt(
  process.env.CRM_MAX_EMAILS_PER_DAY ?? "50",
  10
);
export const MAX_EMAILS_PER_HOUR = parseInt(
  process.env.CRM_MAX_EMAILS_PER_HOUR ?? "20",
  10
);

export function getSendingLimits() {
  return {
    perDay: MAX_EMAILS_PER_DAY,
    perHour: MAX_EMAILS_PER_HOUR,
  };
}
