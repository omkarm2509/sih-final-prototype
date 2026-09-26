export type PaymentContext = 'INSPECTION' | 'SERVICE';

type PaymentBooking = {
  inspectionCharge?: number;
  initialCharge?: number;
  estimateTotal?: number;
  customerDecision?: string;
};

export function getPaymentContext(booking: PaymentBooking): PaymentContext {
  return booking.customerDecision === 'ACCEPTED' && Number(booking.estimateTotal) > 0 ? 'SERVICE' : 'INSPECTION';
}

export function getPaymentAmount(booking: PaymentBooking, context: PaymentContext = getPaymentContext(booking)): number {
  if (context === 'SERVICE') {
    const estimate = Number(booking.estimateTotal);
    return Number.isFinite(estimate) && estimate > 0 ? estimate : 0;
  }
  const inspection = Number(booking.inspectionCharge ?? booking.initialCharge ?? 100);
  return Number.isFinite(inspection) && inspection >= 0 ? inspection : 100;
}
