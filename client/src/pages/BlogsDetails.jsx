import React, { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";

import BlogsComp from "../components/Blogs/BlogsComp";
import { BLOGS_DATA, slugifyBlogTitle } from "../shared/constants/editorialContent";

const BlogsDetails = () => {
  const location = useLocation();
  const { id } = useParams();

  const blog = useMemo(() => {
    const stateBlog = location.state;

    if (stateBlog?.title) {
      return (
        BLOGS_DATA.find((item) => slugifyBlogTitle(item.title) === slugifyBlogTitle(stateBlog.title)) ||
        stateBlog
      );
    }

    return BLOGS_DATA.find((item) => slugifyBlogTitle(item.title) === id) || BLOGS_DATA[0];
  }, [id, location.state]);

  return (
    <div className="min-h-screen bg-cream px-4 pb-20 pt-32 dark:bg-charcoal">
      <div className="section-shell">
        <article className="overflow-hidden rounded-[36px] border border-sand-dark/70 bg-warm-white shadow-soft dark:border-white/10 dark:bg-[#18211E]">
          <div className="relative h-[300px] overflow-hidden sm:h-[420px]">
            <img
              src={blog.image}
              alt={blog.title}
              className="h-full w-full object-cover transition duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-sand/75">
                <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2">
                  {blog.category || "Journal"}
                </span>
                <span>{blog.date}</span>
                <span>By {blog.author}</span>
              </div>
              <h1 className="mt-5 max-w-4xl text-3xl font-semibold leading-tight text-cream sm:text-5xl">
                {blog.title}
              </h1>
            </div>
          </div>

          <div className="grid gap-8 p-6 sm:p-8 xl:grid-cols-[0.85fr_1.15fr]">
            <aside className="rounded-[28px] border border-sand-dark bg-sand/35 p-6 dark:border-white/10 dark:bg-white/5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
                Why this matters
              </p>
              <p className="mt-4 text-sm leading-8 text-slate dark:text-sand/75">
                {blog.description}
              </p>
            </aside>

            <div className="space-y-6">
              {blog.body?.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-base leading-8 text-slate dark:text-sand/75"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </article>
      </div>

      <BlogsComp
        variant="compact"
        title="Keep exploring the journal."
        copy="A few more editorial pieces that support the same travel direction."
      />
    </div>
  );
};

export default BlogsDetails;
