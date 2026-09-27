"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import AuthGuard from "../../../components/AuthGuard";

import { languages, type Lang, t, phase6 } from "../../../locales";

import { readAuth } from "../../../lib/auth";
import { hasReview, saveReview } from "../../../lib/reviews";
import { notifyBooking } from "../../../lib/notifications";
import { updateBooking, syncEstimateFromBooking } from "../../../lib/store";
import { decideEstimate } from "../../../lib/estimateActions";

/*

Required because next.config.js uses:

output: "export"

Booking data is loaded from localStorage at runtime,

so there are no booking IDs available during the build.
*/
export function generateStaticParams() {
  return [];
}

const statuses = [
  "REQUESTED",
  "ASSIGNED",
  "ACCEPTED",
  "ON THE WAY",
  "ARRIVED",
  "INSPECTION",
  "ESTIMATE",
  "SERVICE",
  "COMPLETED",
  "CANCELLED",
];

function DetailContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [lang, setLang] = useState<Lang>("en");
  const [booking, setBooking] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [notice, setNotice] = useState("");

  const d = (t as any)[lang];
  const b = (t as any)[lang].booking;
  const p6 = (phase6 as any)[lang];

  useEffect(() => {
    const storedLang = localStorage.getItem(
      "sahyogsetu-language",
    ) as Lang | null;

    if (storedLang) {
      setLang(storedLang);
    }

    load();
  }, [id]);

  function load() {
    const bookings = JSON.parse(
      localStorage.getItem("sahyogsetu_bookings") || "[]",
    );

    setBooking(bookings.find((item: any) => item.id === id) || null);
  }

  function patch(p: any) {
    if (
      p.customerDecision === "ACCEPTED" ||
      p.customerDecision === "REJECTED"
    ) {
      const result = decideEstimate(id, p.customerDecision);

      if (!result.ok) {
        return;
      }

      setBooking(result.next);
      return;
    }

    const result = updateBooking(id, p);

    if (!result.ok) {
      return;
    }

    const nextBooking = result.next;

    if (p.estimateStatus || p.estimateTotal) {
      syncEstimateFromBooking(nextBooking);
    }

    setBooking(nextBooking);
  }

  function submitReview() {
    if (!booking || rating < 1) {
      setNotice("Please select a rating.");
      return;
    }

    const auth = readAuth();

    saveReview({
      reviewId: `REV-${booking.id}`,
      bookingId: booking.id,
      customerId: auth.user?.userId || booking.customerId || "CU-001",
      workerId: booking.workerId || "",
      rating,
      feedback: feedback.trim(),
      createdAt: new Date().toISOString(),
    });

    patch({
      reviewSubmitted: true,
    });

    notifyBooking("REVIEW_RECEIVED", booking, {
      customer: false,
      worker: true,
      federation: true,
    });

    setNotice("Review submitted.");
  }

  function cancelBooking() {
    if (
      !booking ||
      ["SERVICE", "COMPLETED", "CANCELLED"].includes(booking.status)
    ) {
      return;
    }

    if (!confirm(b.serviceCancelQuestion)) {
      return;
    }

    const result = updateBooking(booking.id, {
      status: "CANCELLED",
    });

    if (!result.ok) {
      return;
    }

    notifyBooking("BOOKING_CANCELLED", result.next, {
      customer: true,
      worker: true,
      federation: true,
    });

    setBooking(result.next);
    setNotice(b.cancelled);
  }

  /*

Booking is loaded from localStorage after hydration.
*/
  if (!booking) {
    return (
      <AuthGuard role="customer">
        <main className="p-8"> Booking not found. </main>{" "}
      </AuthGuard>
    );
  }

  const current =
    booking.status === "CANCELLED" ? -1 : statuses.indexOf(booking.status);

  return (
    <AuthGuard role="customer">
      <main className="min-h-screen bg-slate-50">
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
            <button
              onClick={() => router.push("/customer")}
              className="text-xl font-black text-[#16834b]"
            >
              SahyogSetu
            </button>

            <select
              value={lang}
              onChange={(e) => {
                const value = e.target.value as Lang;

                setLang(value);

                localStorage.setItem("sahyogsetu-language", value);
              }}
              className="rounded-lg border px-2 py-2"
            >
              {Object.entries(languages).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </header>

        <section className="mx-auto max-w-5xl px-5 py-8">
          <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            {/* Header */}
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500">
                  {b.bookingId}: {booking.id}
                </p>

                <h1 className="text-3xl font-black">
                  {
                    d.services.items[
                      booking.service as keyof typeof d.services.items
                    ]
                  }
                </h1>
              </div>

              <span className="rounded-full bg-green-50 px-3 py-2 text-xs font-black text-[#16834b]">
                {booking.status}
              </span>
            </div>

            {/* Status timeline */}
            <div className="mt-6 overflow-x-auto">
              <div className="flex min-w-[700px]">
                {statuses.map((status, index) => (
                  <div className="flex flex-1 items-center" key={status}>
                    <div className="text-center">
                      <div
                        className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs font-black ${
                          index <= current
                            ? "bg-[#16834b] text-white"
                            : "bg-slate-200"
                        }`}
                      >
                        {index <= current ? "✓" : index + 1}
                      </div>

                      <span className="text-[10px] font-bold">{status}</span>
                    </div>

                    {index < statuses.length - 1 && (
                      <span
                        className={`mx-1 h-0.5 flex-1 ${
                          index < current ? "bg-[#16834b]" : "bg-slate-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Booking information */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                [b.worker, booking.worker],
                [b.location, booking.location],
                [b.requirement, booking.requirement],
                [b.date, booking.date],
                [b.time, booking.time],
              ].map(([label, value]) => (
                <div className="rounded-xl bg-slate-50 p-4" key={label}>
                  <p className="text-xs text-slate-500">{label}</p>

                  <p className="font-bold">{value}</p>
                </div>
              ))}
            </div>

            {/* Cancelled */}
            {booking.status === "CANCELLED" && (
              <section className="mt-7 rounded-2xl bg-red-50 p-5">
                <h2 className="text-xl font-black">{b.cancelled}</h2>

                <p className="mt-2 text-sm text-red-800">{b.cancelled}</p>
              </section>
            )}

            {/* Estimate */}
            {booking.status === "ESTIMATE" && (
              <section className="mt-7 rounded-2xl bg-green-50 p-5">
                <h2 className="text-xl font-black">{b.serviceEstimate}</h2>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <Stat t={b.laborCost} v={booking.laborCost} />

                  <Stat t={b.materialCost} v={booking.materialCost} />

                  <Stat t={b.finalEstimate} v={booking.estimateTotal} />
                </div>

                <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm">
                  {b.chargeRule}
                </p>

                {booking.customerDecision === "ACCEPTED" ? (
                  <p className="mt-4 font-bold">{b.estimateAccepted}</p>
                ) : booking.customerDecision === "REJECTED" ? (
                  <p className="mt-4 font-bold">{b.estimateRejected}</p>
                ) : (
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={() =>
                        patch({
                          estimateStatus: "ACCEPTED",
                          customerDecision: "ACCEPTED",
                          estimateAccepted: true,
                          status: "ESTIMATE",
                        })
                      }
                      className="flex-1 rounded-xl bg-[#16834b] px-5 py-3 font-black text-white"
                    >
                      {b.acceptEstimate}
                    </button>

                    <button
                      onClick={() =>
                        patch({
                          estimateStatus: "REJECTED",
                          customerDecision: "REJECTED",
                          estimateAccepted: false,
                        })
                      }
                      className="flex-1 rounded-xl border px-5 py-3 font-black"
                    >
                      {b.rejectEstimate}
                    </button>
                  </div>
                )}
              </section>
            )}

            {/* Completed */}
            {booking.status === "COMPLETED" && (
              <section className="mt-7 rounded-2xl bg-green-50 p-5">
                <h2 className="text-xl font-black">{p6.completed}</h2>

                <p className="mt-2">
                  {p6.finalServiceAmount}:{" "}
                  <b>
                    ₹
                    {Number(booking.estimateTotal || 0).toLocaleString("en-IN")}
                  </b>
                </p>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() =>
                      router.push(`/customer/payment/${booking.id}`)
                    }
                    className="rounded-xl bg-[#16834b] px-5 py-3 font-black text-white"
                  >
                    Pay / View Payment
                  </button>

                  <button
                    onClick={() =>
                      router.push(`/customer/invoice/${booking.id}`)
                    }
                    className="rounded-xl border px-5 py-3 font-black"
                  >
                    View Invoice
                  </button>
                </div>
              </section>
            )}

            {/* Review */}
            {booking.status === "COMPLETED" && !hasReview(booking.id) && (
              <section className="mt-7 rounded-2xl border p-5">
                <h2 className="text-xl font-black">{p6.reviewPrompt}</h2>

                <div className="mt-4 flex gap-2">
                  {[1, 2, 3, 4, 5].map((number) => (
                    <button
                      key={number}
                      onClick={() => setRating(number)}
                      className={`text-4xl ${
                        number <= rating ? "text-amber-400" : "text-slate-300"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>

                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                  className="mt-4 w-full rounded-xl border p-3"
                  placeholder={p6.optionalFeedback}
                />

                <button
                  onClick={submitReview}
                  className="mt-4 w-full rounded-xl bg-[#16834b] px-5 py-3 font-black text-white"
                >
                  {p6.submitReview}
                </button>

                {notice && <p className="mt-3 text-sm font-bold">{notice}</p>}
              </section>
            )}

            {/* Cancel booking */}
            {!["SERVICE", "COMPLETED", "CANCELLED"].includes(
              booking.status,
            ) && (
              <button
                onClick={cancelBooking}
                className="mt-7 mr-3 rounded-xl border border-red-200 px-6 py-3 font-bold text-red-700"
              >
                {b.cancelBooking}
              </button>
            )}

            {/* Booking history */}
            <button
              onClick={() => router.push("/customer/bookings")}
              className="mt-7 rounded-xl border px-6 py-3 font-bold"
            >
              {p6.bookingHistory}
            </button>
          </div>
        </section>
      </main>
    </AuthGuard>
  );
}

function Stat({ t, v }: { t: string; v: any }) {
  return (
    <div className="rounded-xl bg-white p-4">
      <p className="text-xs text-slate-500">{t}</p>

      <p className="mt-1 text-lg font-black">
        ₹{Number(v || 0).toLocaleString("en-IN")}
      </p>
    </div>
  );
}

export default function Detail() {
  return <DetailContent />;
}
