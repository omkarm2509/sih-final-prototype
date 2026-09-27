"use client";
import AuthGuard from "../../../components/AuthGuard";
import FederationShell from "../../../components/FederationShell";
import { federation } from "../../../data/federation";
import { phase7 } from "../../../locales";
export default function Profile() {
  return (
    <AuthGuard role="federation">
      <FederationShell>
        <C />
      </FederationShell>
    </AuthGuard>
  );
}
function C() {
  const lang =
    (typeof window !== "undefined"
      ? localStorage.getItem("sahyogsetu-language")
      : "en") || "en";
  const d = phase7[lang as keyof typeof phase7];
  return (
    <section className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-3xl font-black">{d.profileTitle}</h1>
      <div className="mt-5 rounded-3xl border bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            [d.role, federation.name],
            [d.federationId, federation.federationId],
            [d.region, federation.region],
            [d.coordinator, federation.coordinatorName],
          ].map(([a, b]) => (
            <div key={a} className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold text-slate-500">{a}</p>
              <p className="mt-1 font-black">{b}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-bold text-slate-500">{d.serviceAreas}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {federation.serviceAreas.map((a) => (
              <span
                key={a}
                className="rounded-full bg-white px-3 py-2 text-sm font-bold"
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
