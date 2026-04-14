import React from "react";

import BlogCard from "./BlogCard";
import { BLOGS_DATA } from "../../shared/constants/editorialContent";

const BlogsComp = ({
  title = "Stories, planning ideas, and local insight worth saving.",
  copy =
    "A lighter editorial layer for the product: useful advice, destination inspiration, and a stronger sense of brand taste.",
  variant = "default",
}) => {
  const isCompact = variant === "compact";

  return (
    <section className={isCompact ? "py-12 sm:py-16" : "py-20 sm:py-24"}>
      <div className="section-shell">
        <div className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="eyebrow-label">Travel Journal</span>
            <h2 className="section-heading mt-5 dark:text-cream">{title}</h2>
            <p className="section-copy mt-4 dark:text-sand/75">{copy}</p>
          </div>
          {!isCompact && (
            <p className="max-w-sm text-sm leading-7 text-slate dark:text-sand/70">
              These stories help the product feel more trustworthy and aspirational, not just transactional.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {BLOGS_DATA.map((item) => (
            <BlogCard key={item.id} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogsComp;
