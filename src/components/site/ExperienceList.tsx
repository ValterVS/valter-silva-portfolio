import type { HomeDictionary } from "@/i18n/home";
import type { HomeContent } from "./content";

// Mais recente primeiro. Mostra só o que está documentado em src/data/experience.ts.
export function ExperienceList({ jobs, ui }: { jobs: HomeContent["experience"]; ui: HomeDictionary }) {
  return (
    <ol className="-mt-8">
      {jobs.map((job) => (
        <li
          key={`${job.company}-${job.start.iso}`}
          className="grid gap-x-8 gap-y-2 border-b border-border py-8 last:border-b-0 sm:grid-cols-[10rem_minmax(0,1fr)]"
        >
          <p className="text-small text-foreground-muted tabular-nums">
            <time dateTime={job.start.iso}>{job.start.label}</time>
            {job.end && (
              <>
                {" – "}
                <time dateTime={job.end.iso}>{job.end.label}</time>
              </>
            )}
          </p>
          <div>
            <h3 className="text-heading font-semibold">{job.role}</h3>
            <p className="mt-1 text-foreground-muted">
              {job.company}
              {job.client && ` · ${ui.experience.client}: ${job.client}`}
            </p>
            <ul className="mt-4 max-w-measure space-y-2">
              {job.highlights.map((item) => (
                <li key={item} className="grid grid-cols-[1rem_minmax(0,1fr)] text-pretty">
                  <span aria-hidden="true" className="text-foreground-muted">
                    –
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ol>
  );
}
