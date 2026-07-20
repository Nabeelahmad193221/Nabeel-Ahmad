import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, Calendar, MapPin, CheckCircle, ChevronDown, Award } from 'lucide-react';

interface TimelineProps {
  theme: 'dark' | 'light';
}

const timelineData = [
  {
    type: 'experience',
    role: "Data Analyst",
    company: "Haier Pakistan",
    period: "March 2025 – Present",
    location: "Lahore, Pakistan",
    icon: Briefcase,
    highlights: [
      "Manufacturing Intelligence: Developed dynamic dashboards to monitor Units Per Hour (UPH) and production efficiency.",
      "SAP Integration: Streamlined data extraction from SAP ERP to ensure 100% accuracy in inventory reporting.",
      "Downtime Reduction: Analyzed machine breakdown data to provide actionable insights, reducing production delays.",
      "Process Engineering: Implemented 6S Discipline through data-driven performance monitoring."
    ]
  },
  {
    type: 'education_cert',
    role: "Core Analytics Specialist",
    company: "Excel, SQL & BI Certifications",
    period: "2024",
    location: "Verified Academics",
    icon: Award,
    highlights: [
      "Microsoft Excel Dashboarding credentials verifying visual modeling standards.",
      "HR Analytics Courses focusing on workforce utilization optimization metrics.",
      "Databricks SQL & standard structured querying for big data engineering fundamentals.",
      "Advanced statistics for predicting maintenance cycles and machine MTBF."
    ]
  }
];

export default function Timeline({ theme }: TimelineProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 md:ml-8 space-y-12 py-4">
      {timelineData.map((item, idx) => {
        const Icon = item.icon;
        const isExpanded = expandedIndex === idx;

        return (
          <div key={idx} className="relative pl-8 md:pl-12">
            {/* Pulsing timeline node */}
            <div className={`absolute -left-[13px] top-6 w-6 h-6 rounded-full border-4 flex items-center justify-center transition-all ${
              isExpanded 
                ? 'bg-indigo-500 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)]'
                : 'bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800'
            }`}>
              {isExpanded && <span className="absolute w-2 h-2 bg-white rounded-full animate-ping" />}
            </div>

            {/* Glowing item container */}
            <motion.div
              layout
              className={`p-6 md:p-8 rounded-[2.5rem] border transition-all duration-300 relative overflow-hidden cursor-pointer ${
                isExpanded
                  ? theme === 'dark'
                    ? 'border-indigo-500/30 bg-indigo-500/5 shadow-[0_0_20px_rgba(99,102,241,0.1)]'
                    : 'border-indigo-500/30 bg-indigo-50/20 shadow-xl shadow-indigo-100'
                  : theme === 'dark'
                    ? 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900'
                    : 'bg-white border-slate-200 shadow-md shadow-slate-100'
              }`}
              onClick={() => setExpandedIndex(isExpanded ? null : idx)}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3.5">
                  <div className={`p-2.5 rounded-xl border ${
                    isExpanded 
                      ? 'bg-indigo-500 text-white border-indigo-400' 
                      : 'bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={`text-xl font-bold font-display ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      {item.role}
                    </h4>
                    <p className={`font-semibold text-sm ${isExpanded ? 'text-indigo-500 dark:text-indigo-400' : 'text-slate-500'}`}>
                      {item.company}
                    </p>
                  </div>
                </div>

                <div className="flex md:flex-col items-start md:items-end gap-2 md:gap-1 pl-12 md:pl-0">
                  <div className={`px-4 py-1 rounded-full text-xs font-mono font-bold border flex items-center gap-1.5 ${
                    isExpanded 
                      ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-500 dark:text-indigo-400' 
                      : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500'
                  }`}>
                    <Calendar className="w-3.5 h-3.5" />
                    {item.period}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {item.location}
                  </div>
                </div>
              </div>

              {/* Collapsible details section */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-slate-150 dark:border-slate-850 pt-6 mt-6">
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {item.highlights.map((highlight, j) => (
                          <motion.li
                            key={j}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: j * 0.08 }}
                            className="flex items-start gap-3 text-sm leading-relaxed"
                          >
                            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>
                              {highlight}
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Expansion Indicator */}
              <div className="flex justify-center mt-3 pt-2">
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                  isExpanded ? 'rotate-180 text-indigo-500' : ''
                }`} />
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
