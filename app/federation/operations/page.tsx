"use client";
import AuthGuard from "../../../components/AuthGuard";
import FederationShell, {
  useFederationData,
} from "../../../components/FederationShell";
import { phase7, t } from "../../../locales";
export default function Operations() {
  return (
    <AuthGuard role="federation">
      <FederationShell>
        <Ops />
      </FederationShell>
    </AuthGuard>
  );
}
function Ops() {
  const { bookings } = useFederationData();
  const lang =
    (typeof window !== "undefined"
      ? localStorage.getItem("sahyogsetu-language")
      : "en") || "en";
  const d = phase7[lang as keyof typeof phase7];
  const rows = bookings.filter((b) =>
    [
      "ASSIGNED",
      "ACCEPTED",
      "ON THE WAY",
      "ARRIVED",
      "INSPECTION",
      "ESTIMATE",
      "SERVICE",
    ].includes(b.status),
  );
  return (
    <section className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="text-3xl font-black">{d.operations}</h1>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {rows.map((b) => (
          <article key={b.id} className="rounded-2xl border bg-white p-5">
            <div className="flex justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500">{b.id}</p>
                <h2 className="font-black">
                  {t[lang as keyof typeof t].services.items[b.service]}
                </h2>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                {b.status}
              </span>
            </div>
            <p className="mt-3 text-sm">
              {d.assignedWorker}: {b.worker || d.unassigned}
            </p>
            <p className="text-sm text-slate-500">
              {b.location} · {b.time}
            </p>
          </article>
        ))}
        {!rows.length && (
          <div className="rounded-2xl border border-dashed bg-white p-10 text-center text-sm text-slate-500">
            {d.empty}
          </div>
        )}
      </div>
    </section>
  );
}
