"use client";
import AuthGuard from "../../../components/AuthGuard";
import FederationShell, {
  useFederationData,
} from "../../../components/FederationShell";
import { phase7, t } from "../../../locales";
export default function Completed() {
  return (
    <AuthGuard role="federation">
      <FederationShell>
        <C />
      </FederationShell>
    </AuthGuard>
  );
}
function C() {
  const { bookings } = useFederationData();
  const lang =
    (typeof window !== "undefined"
      ? localStorage.getItem("sahyogsetu-language")
      : "en") || "en";
  const d = phase7[lang as keyof typeof phase7];
  return (
    <section className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="text-3xl font-black">{d.completed}</h1>
      <div className="mt-5 space-y-3">
        {bookings
          .filter((b) => b.status === "COMPLETED")
          .map((b) => (
            <article key={b.id} className="rounded-2xl border bg-white p-5">
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-500">{b.id}</p>
                  <h2 className="font-black">
                    {t[lang as keyof typeof t].services.items[b.service]}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {b.location} · {b.worker}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-black">
                    ₹{Number(b.estimateTotal || 0).toLocaleString("en-IN")}
                  </p>
                  <p className="text-xs text-green-700">COMPLETED</p>
                </div>
              </div>
            </article>
          ))}
      </div>
    </section>
  );
}
