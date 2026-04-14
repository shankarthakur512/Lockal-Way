import React from "react";
import {
  IoGlobeOutline,
  IoLocationOutline,
  IoPeopleOutline,
  IoWalletOutline,
} from "react-icons/io5";

import { GUIDE_WORK_WITH_US_COPY } from "../../features/guides/constants/dashboardContent";

const benefitIcons = [IoWalletOutline, IoPeopleOutline, IoGlobeOutline];

function WorkwithUs() {
  return (
    <section className="mt-12 rounded-[36px] bg-[linear-gradient(180deg,#17332C_0%,#102520_100%)] px-6 py-12 text-sand shadow-luxury sm:px-10 sm:py-14">
      <div className="mx-auto max-w-4xl text-center">
        <span className="eyebrow-label">{GUIDE_WORK_WITH_US_COPY.eyebrow}</span>
        <h2 className="mt-6 flex items-center justify-center gap-2 text-3xl font-semibold text-cream sm:text-4xl">
          {GUIDE_WORK_WITH_US_COPY.title}
          <IoLocationOutline className="text-gold" />
        </h2>
        <p className="mt-5 text-sm leading-8 text-sand/75 sm:text-base">
          {GUIDE_WORK_WITH_US_COPY.body}
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {GUIDE_WORK_WITH_US_COPY.items.map((item, index) => {
          const Icon = benefitIcons[index];

          return (
            <article
              key={item.title}
              className="rounded-[28px] border border-white/10 bg-white/10 p-6 backdrop-blur-md"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white/10 p-3 text-gold">
                  <Icon className="text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-cream">{item.title}</h3>
              </div>
              <p className="mt-4 text-sm leading-7 text-sand/78">{item.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default WorkwithUs;
