import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineArrowUpRight } from "react-icons/hi2";
import { slugifyBlogTitle } from "../../shared/constants/editorialContent";

const BlogCard = ({ image, date, title, description, author, category }) => {
  return (
    <Link
      to={`/blogs/${slugifyBlogTitle(title)}`}
      onClick={() => {
        window.scrollTo(0, 0);
      }}
      state={{ image, date, title, description, author, category }}
      className="block"
    >
      <article className="group overflow-hidden rounded-[28px] border border-sand-dark/70 bg-warm-white shadow-soft transition duration-500 hover:-translate-y-2 hover:shadow-luxury dark:border-white/10 dark:bg-[#18211E]">
        <div className="relative overflow-hidden">
          <img
            src={image}
            alt={title}
            className="h-72 w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-transparent to-transparent" />
          <div className="absolute left-5 top-5 rounded-full bg-white/92 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-forest">
            {category || "Journal"}
          </div>
        </div>
        <div className="space-y-4 p-6">
          <div className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.16em] text-mist dark:text-sand/50">
            <p>{date}</p>
            <p>By {author}</p>
          </div>
          <h3 className="line-clamp-2 text-2xl font-semibold text-ink dark:text-cream">{title}</h3>
          <p className="line-clamp-3 text-sm leading-7 text-slate dark:text-sand/72">{description}</p>
          <div className="flex items-center gap-2 pt-2 text-sm font-semibold text-forest dark:text-sand">
            Read article
            <HiOutlineArrowUpRight className="transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </div>
        </div>
      </article>
    </Link>
  );
};

export default BlogCard;
