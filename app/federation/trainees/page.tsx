"use client";
import AuthGuard from "../../../components/AuthGuard";
import FederationShell, { trainees } from "../../../components/FederationShell";
import { phase7 } from "../../../locales";
export default function Trainees() {
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
  const d = phase7[lang as keyof typeof phase7];;
  return (
    <section className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="text-3xl font-black">{d.traineeOverview}</h1>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {trainees.map((x: any) => (
          <article
            key={x.traineeId}
            className="rounded-2xl border bg-white p-5"
          >
            <h2 className="font-black">{x.name}</h2>
            <p className="text-xs text-slate-500">{x.traineeId}</p>
            <p className="mt-3 text-sm">
              {d.trainingProgram}: {x.trainingProgram}
            </p>
            <p className="text-sm">
              {d.trainingStatus}: {x.trainingStatus}
            </p>
            <div className="mt-3">
              <div className="flex justify-between text-xs font-bold">
                <span>{d.progress}</span>
                <span>{x.progress}%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-200">
                <div
                  className="h-2 rounded-full bg-[#16834b]"
                  style={{ width: `${x.progress}%` }}
                />
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-500">
              {d.certifications}: {x.certifications?.length || 0}
            </p>
            <p className="mt-2 text-xs font-bold text-[#16834b]">
              {d.eligible}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
