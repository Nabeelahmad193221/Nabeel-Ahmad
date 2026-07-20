import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileSpreadsheet, BarChart3, Database, Check, Award, Layout, 
  Settings, Workflow, Activity, Target
} from 'lucide-react';

interface SkillsVisualizerProps {
  theme: 'dark' | 'light';
}

const mainSkills = [
  { 
    id: 'analytics',
    name: "Advanced Data Analytics", 
    icon: FileSpreadsheet, 
    level: 90, 
    color: "from-emerald-400 to-emerald-600", 
    radialColor: "#10b981",
    desc: "Excel & DAX",
    extended: [
      { name: "Complex DAX Functions", score: 92 },
      { name: "Power Query / M Language Tuning", score: 88 },
      { name: "Data Modeling Structure", score: 90 },
      { name: "Financial & Statistical Modeling", score: 85 }
    ]
  },
  { 
    id: 'bi',
    name: "Business Intelligence", 
    icon: BarChart3, 
    level: 85, 
    color: "from-indigo-400 to-violet-600", 
    radialColor: "#6366f1",
    desc: "Power BI",
    extended: [
      { name: "Row-Level Security (RLS)", score: 85 },
      { name: "Custom Report Storytelling", score: 90 },
      { name: "Automated Refresh Schedules", score: 88 },
      { name: "Python Visualizations Overlay", score: 78 }
    ]
  },
  { 
    id: 'erp',
    name: "ERP & Operations", 
    icon: Database, 
    level: 75, 
    color: "from-cyan-400 to-blue-500", 
    radialColor: "#06b6d4",
    desc: "SAP ERP",
    extended: [
      { name: "SAP RFC Data Extraction", score: 82 },
      { name: "Production Planning Integration", score: 75 },
      { name: "Material Management Reports", score: 80 },
      { name: "SQL Query Integration", score: 78 }
    ]
  },
];

export default function SkillsVisualizer({ theme }: SkillsVisualizerProps) {
  const [selectedSkill, setSelectedSkill] = useState<string>('analytics');

  const activeSkill = useMemo(() => {
    return mainSkills.find(s => s.id === selectedSkill) || mainSkills[0];
  }, [selectedSkill]);

  function useMemo(fn: () => any, deps: any[]) {
    return React.useMemo(fn, deps);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Skill Cards Stack */}
      <div className="col-span-1 lg:col-span-5 space-y-4">
        {mainSkills.map((skill) => {
          const isSelected = skill.id === selectedSkill;
          const Icon = skill.icon;
          return (
            <motion.div
              key={skill.id}
              onClick={() => setSelectedSkill(skill.id)}
              whileHover={{ x: 6 }}
              className={`p-6 rounded-[2rem] border transition-all duration-300 cursor-pointer ${
                isSelected
                  ? theme === 'dark' 
                    ? 'border-indigo-500/50 bg-indigo-500/5 shadow-[0_0_20px_rgba(99,102,241,0.15)] bg-slate-900/60'
                    : 'border-indigo-500/50 bg-indigo-50/40 shadow-xl shadow-indigo-100'
                  : theme === 'dark'
                    ? 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900'
                    : 'bg-white border-slate-200 shadow-md shadow-slate-100 hover:shadow-lg'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${skill.color} text-white shadow-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest">{skill.desc}</span>
                  <h4 className={`text-lg font-bold truncate mt-0.5 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {skill.name}
                  </h4>
                </div>
                
                {/* Visual Circle Meter */}
                <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                  <svg className="absolute w-full h-full transform -rotate-90">
                    <circle
                      cx="24"
                      cy="24"
                      r="18"
                      stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'}
                      strokeWidth="3.5"
                      fill="none"
                    />
                    <motion.circle
                      cx="24"
                      cy="24"
                      r="18"
                      stroke={skill.radialColor}
                      strokeWidth="3.5"
                      fill="none"
                      strokeDasharray={113}
                      initial={{ strokeDashoffset: 113 }}
                      animate={{ strokeDashoffset: 113 - (113 * skill.level) / 100 }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                    />
                  </svg>
                  <span className={`text-xs font-mono font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-900'}`}>
                    {skill.level}%
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Expanded sub-skill gauge details */}
      <div className="col-span-1 lg:col-span-7">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedSkill}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`p-8 rounded-[2.5rem] border ${
              theme === 'dark' ? 'glass-card border-slate-800' : 'bg-white border-slate-200 shadow-2xl shadow-slate-100'
            }`}
          >
            <div className="flex items-center gap-3.5 mb-6">
              <Activity className="w-5 h-5 text-indigo-500 animate-pulse" />
              <h5 className={`font-display text-xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Sub-Competence Visualization
              </h5>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              Granular breakdown representing verified knowledge metrics used at Haier Pakistan to deploy real-time monitoring:
            </p>

            <div className="space-y-6">
              {activeSkill.extended.map((sub, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>{sub.name}</span>
                    <span className="font-mono text-indigo-500 dark:text-indigo-400 font-bold">{sub.score}%</span>
                  </div>
                  
                  {/* Gauge horizontal progress */}
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-950 rounded-full border border-slate-200 dark:border-slate-900 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${sub.score}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.1, ease: 'easeOut' }}
                      className={`h-full bg-gradient-to-r ${activeSkill.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Quick target recommendation check */}
            <div className={`mt-8 p-4 rounded-2xl border flex items-center gap-3 ${
              theme === 'dark' ? 'bg-slate-950/40 border-slate-800/80' : 'bg-slate-50 border-slate-100'
            }`}>
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500">
                <Target className="w-4 h-4" />
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Proven to deploy metrics that boosted reported production throughput by <strong className="text-slate-800 dark:text-slate-200">12%</strong>.
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
