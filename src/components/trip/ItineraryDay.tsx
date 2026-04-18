"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Clock, MapPin } from "lucide-react";

interface Activity {
  time: string;
  title: string;
  description: string;
  duration: string;
  location: string;
  cost: string;
}

interface Meal {
  type: string;
  suggestion: string;
  estimatedCost: string;
}

interface ItineraryItem {
  id: string;
  day: number;
  date: string;
  title: string;
  estimatedCost: number;
  activities: Activity[];
  meals: Meal[];
  summary: string;
}

interface ItineraryDayProps {
  item: ItineraryItem;
}

export default function ItineraryDay({ item }: ItineraryDayProps) {
  const [open, setOpen] = useState(item.day === 1);

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Day {item.day}</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">{item.title}</h3>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span>{item.date}</span>
            <span>•</span>
            <span>${item.estimatedCost}</span>
          </div>
        </div>
        <ChevronDown className={`h-5 w-5 transition ${open ? "rotate-180" : "rotate-0"}`} />
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-6 border-t border-slate-200 px-6 py-6">
              <p className="text-sm leading-7 text-slate-600">{item.summary}</p>

              <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-4">
                  {item.activities.map((activity) => (
                    <div key={activity.time} className="rounded-3xl border border-slate-200 bg-white p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{activity.title}</p>
                          <p className="mt-2 text-sm text-slate-500">{activity.description}</p>
                        </div>
                        <div className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">
                          {activity.duration}
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-4 w-4" /> {activity.time}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-4 w-4" /> {activity.location}
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{activity.cost}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="rounded-3xl border border-slate-200 bg-white p-5">
                    <p className="text-sm font-semibold text-slate-900">Meals</p>
                    <div className="mt-4 space-y-3">
                      {item.meals.map((meal) => (
                        <div key={meal.type} className="rounded-2xl bg-slate-50 p-3">
                          <p className="text-sm font-semibold text-slate-900">{meal.type}</p>
                          <p className="mt-1 text-sm text-slate-600">{meal.suggestion}</p>
                          <p className="mt-2 text-xs font-medium uppercase tracking-[0.24em] text-slate-500">{meal.estimatedCost}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-5">
                    <p className="text-sm font-semibold text-slate-900">Day Highlights</p>
                    <ul className="mt-4 space-y-3 text-sm text-slate-600">
                      <li className="flex items-start gap-3">
                        <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-orange-500" />
                        Seamless transfers and curated local experiences throughout the day.
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-orange-500" />
                        Balance of guided activities and free time for personal exploration.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
