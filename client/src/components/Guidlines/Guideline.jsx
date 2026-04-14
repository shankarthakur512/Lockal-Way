import React from "react";

import { GUIDE_GUIDELINES } from "../../features/guides/constants/dashboardContent";

const Guidelines = () => {
  return (
    <div className="grid gap-4">
      {GUIDE_GUIDELINES.map((guideline, index) => (
        <div
          key={guideline}
          className="rounded-[24px] border border-sand-dark/70 bg-sand/40 p-5 shadow-sm dark:border-white/10 dark:bg-white/5"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
            Guideline {index + 1}
          </p>
          <p className="mt-3 text-sm leading-7 text-slate dark:text-sand/75">{guideline}</p>
        </div>
      ))}
    </div>
  );
};

export default Guidelines;
