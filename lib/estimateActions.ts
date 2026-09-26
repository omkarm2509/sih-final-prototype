'use client';

import { notifyBooking } from './notifications';
import { getBooking, syncEstimateFromBooking, updateBooking } from './store';

export type EstimateDecision = 'ACCEPTED' | 'REJECTED';

export function decideEstimate(bookingId: string, decision: EstimateDecision) {
  const booking = getBooking(bookingId);
  if (!booking || booking.status !== 'ESTIMATE') {
    return { ok: false as const, error: 'INVALID_ESTIMATE_STATE' as const };
  }
  if (booking.estimateStatus === decision && booking.customerDecision === decision) {
    return { ok: true as const, next: booking };
  }
  const result = updateBooking(bookingId, {
    estimateStatus: decision,
    customerDecision: decision,
    estimateAccepted: decision === 'ACCEPTED',
    status: 'ESTIMATE',
  });
  if (!result.ok) return result;
  syncEstimateFromBooking(result.next);
  notifyBooking(
    decision === 'ACCEPTED' ? 'ESTIMATE_ACCEPTED' : 'ESTIMATE_REJECTED',
    result.next,
    { customer: false, worker: true, federation: true },
  );
  return result;
}

export function startServiceAfterEstimateApproval(bookingId: string) {
  const booking = getBooking(bookingId);
  if (!booking) return { ok: false as const, error: 'BOOKING_NOT_FOUND' as const };
  if (booking.status !== 'ESTIMATE' || booking.customerDecision !== 'ACCEPTED') {
    return { ok: false as const, error: 'ESTIMATE_NOT_ACCEPTED' as const };
  }
  const result = updateBooking(bookingId, {
    status: 'SERVICE',
    serviceStartedAt: new Date().toISOString(),
  });
  if (!result.ok) return result;
  notifyBooking('SERVICE_STARTED', result.next, { customer: true, worker: false, federation: true });
  return result;
}
