import React from "react";

import { GUIDE_RECENT_ACTIVITY_COPY } from "../../features/guides/constants/dashboardContent";

const RecentComponent = ({ activities = [] }) => {
  return (
    <div className="grid gap-3">
      {activities.length > 0 ? (
        activities.map((activity, index) => (
          <article
            key={`${activity.description}-${index}`}
            className="rounded-[24px] border border-sand-dark/70 bg-sand/40 p-5 shadow-sm dark:border-white/10 dark:bg-white/5"
          >
            <p className="text-sm leading-7 text-forest dark:text-cream">
              {activity.description}
            </p>
            <small className="mt-2 block text-xs uppercase tracking-[0.2em] text-mist dark:text-sand/50">
              {activity.date}
            </small>
          </article>
        ))
      ) : (
        <div className="flex min-h-56 items-center justify-center rounded-[24px] border border-dashed border-sand-dark bg-sand/30 px-6 text-center text-sm text-slate dark:border-white/10 dark:bg-white/5 dark:text-sand/75">
          {GUIDE_RECENT_ACTIVITY_COPY.empty}
        </div>
      )}
    </div>
  );
};

export default RecentComponent;
