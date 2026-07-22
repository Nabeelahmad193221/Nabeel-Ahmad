import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, ReferenceLine, LineChart, Line
} from 'recharts';
import { 
  TrendingUp, Play, Pause, AlertTriangle, CheckCircle, RefreshCcw, 
  Workflow, Cpu, Sparkles, Filter, ChevronRight
} from 'lucide-react';

import dashboardImg from '../assets/images/manufacturing_kpi_dashboard_1784573540023.jpg';

interface InteractiveDashboardProps {
  theme: 'dark' | 'light';
}

// Simulated Live Production Run data mimicking Nabeel's Haier Pakistan UPH monitoring
const uphData = [
  { hour: '08:00', actual: 420, target: 450, efficiency: 93.3, defectRate: 0.11 },
  { hour: '09:00', actual: 445, target: 450, efficiency: 98.8, defectRate: 0.08 },
  { hour: '10:00', actual: 462, target: 450, efficiency: 102.6, defectRate: 0.05 },
  { hour: '11:00', actual: 410, target: 450, efficiency: 91.1, defectRate: 0.18 }, // bottleneck interval
  { hour: '12:00', actual: 455, target: 450, efficiency: 101.1, defectRate: 0.09 },
  { hour: '13:00', actual: 450, target: 450, efficiency: 100.0, defectRate: 0.07 },
  { hour: '14:00', actual: 470, target: 450, efficiency: 104.4, defectRate: 0.04 },
  { hour: '15:00', actual: 480, target: 450, efficiency: 106.6, defectRate: 0.03 },
  { hour: '16:00', actual: 435, target: 450, efficiency: 96.6, defectRate: 0.12 },
];

// Machine breakdown analytics data mimicking Nabeel's breakdown analysis project
const breakdownData = [
  { machine: 'Line 1 Injector', downtimeHours: 14.5, count: 8, mtbfDays: 14 },
  { machine: 'Assembly B-Press', downtimeHours: 24.2, count: 18, mtbfDays: 6 },
  { machine: 'Line 3 Compressor', downtimeHours: 8.4, count: 4, mtbfDays: 22 },
  { machine: 'Wrapper S-200', downtimeHours: 18.1, count: 12, mtbfDays: 11 },
  { machine: 'Main conveyor unit', downtimeHours: 32.8, count: 22, mtbfDays: 5 },
];

// Pre-calculated stats
const totalActualUnits = uphData.reduce((acc, curr) => acc + curr.actual, 0);
const avgEfficiency = +(uphData.reduce((acc, curr) => acc + curr.efficiency, 0) / uphData.length).toFixed(1);
const avgDefectRate = +(uphData.reduce((acc, curr) => acc + curr.defectRate, 0) / uphData.length).toFixed(2);

export default function InteractiveDashboard({ theme }: InteractiveDashboardProps) {
  const [activeTab, setActiveTab] = useState<'throughput' | 'breakdowns' | 'quality'>('throughput');
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const [simulatedLive, setSimulatedLive] = useState(true);
  const [highlightAnomaly, setHighlightAnomaly] = useState(false);

  // Custom tooltips styling matching theme
  const tooltipStyle = useMemo(() => {
    return theme === 'dark' 
      ? { contentStyle: { backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#f8fafc' } }
      : { contentStyle: { backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a' } };
  }, [theme]);

  // Insights Engine client-side recommendations
  const insights = useMemo(() => {
    return [
      {
        id: 1,
        type: 'critical',
        title: 'High Breakdown Machine Pinpointed',
        msg: 'Main Conveyor Unit accounts for 32.8 hours of downtime (22 occurrences). Recommending visual predictive maintenance intervals every 4 days.',
        tags: ['SQL Analysis', 'Breakdowns']
      },
      {
        id: 2,
        type: 'warning',
        title: 'Throughput Drop Triggered at 11:00',
        msg: 'Hourly standard production fell below targeted 450 units. Associated with a spike in defect rate (0.18%). Bottleneck identified in materials feed.',
        tags: ['Pandas Process', 'Efficiency']
      },
      {
        id: 3,
        type: 'success',
        title: 'Haier UPH Standard Optimized',
        msg: 'Overall line efficiency stabilized at 98.4% through automation of SAP live reports.',
        tags: ['SAP ERP Integration', 'Power BI']
      }
    ];
  }, []);

  return (
    <div className={`p-6 md:p-8 rounded-[2.5rem] border transition-all duration-300 relative overflow-hidden shadow-2xl ${
      theme === 'dark' ? 'glass-card border-slate-800' : 'bg-white border-slate-200'
    }`}>
      {/* Absolute ambient lights inside dashboard container */}
      <div className={`absolute top-0 right-0 w-[400px] h-[400px] blur-[150px] rounded-full pointer-events-none opacity-20 transition-all ${
        theme === 'dark' ? 'bg-indigo-500/20' : 'bg-indigo-300/15'
      }`} />
      
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-slate-200/50 dark:border-slate-800/50">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400">
              Interactive Industrial Mock Station
            </span>
          </div>
          <h3 className={`text-2xl md:text-3xl font-extrabold font-display leading-tight ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Haier Pakistan Manufacturing KPI Simulator
          </h3>
          <p className="text-sm text-slate-500 mt-1 dark:text-slate-400 max-w-xl">
            Click tabs and interact with charts to explore live analytics telemetry and breakdown correlations.
          </p>
        </div>

        {/* Dashboard Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setHighlightAnomaly(!highlightAnomaly)}
            className={`px-4 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              highlightAnomaly 
                ? 'bg-rose-500/10 border-rose-500/50 text-rose-500 shadow-sm' 
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Highlight Bottlenecks
          </button>
          
          <button
            onClick={() => setSimulatedLive(!simulatedLive)}
            className={`px-4 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              simulatedLive 
                ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500 shadow-sm' 
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full bg-emerald-500 ${simulatedLive ? 'animate-ping' : ''}`} />
            Live Sim {simulatedLive ? 'Active' : 'Paused'}
          </button>
        </div>
      </div>

      {/* KPI Overviews Container with Live Count-up simulation */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Units Per Hour (UPH)', value: simulatedLive ? `${uphData[uphData.length - 1].actual}` : '453', change: '+5.4% from Target', trend: true },
          { label: 'Weekly Throughput', value: `${totalActualUnits.toLocaleString()}`, change: 'Accumulated shifts', trend: true },
          { label: 'Line Efficiency', value: `${avgEfficiency}%`, change: 'Optimal threshold', trend: true },
          { label: 'Downtime Ratio', value: '1.24%', change: '-0.33% from last cycle', trend: false }
        ].map((kpi, kIdx) => (
          <motion.div
            key={kIdx}
            whileHover={{ y: -4 }}
            className={`p-5 rounded-2xl border ${
              theme === 'dark' ? 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-900' : 'bg-slate-50 border-slate-100 hover:bg-white hover:shadow-lg hover:shadow-slate-100'
            } transition-all duration-300`}
          >
            <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">{kpi.label}</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className={`text-2xl md:text-3xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {kpi.value}
              </span>
              <span className="text-[10px] font-mono text-emerald-500 flex items-center gap-0.5">
                <TrendingUp className="w-2.5 h-2.5" />
                {kpi.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main interactive chart section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4 gap-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTab('throughput')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'throughput'
                    ? 'bg-indigo-500 text-white shadow-xl shadow-indigo-500/25'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                Output Performance (UPH)
              </button>
              <button
                onClick={() => setActiveTab('breakdowns')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'breakdowns'
                    ? 'bg-indigo-500 text-white shadow-xl shadow-indigo-500/25'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                Breakdown Distribution
              </button>
              <button
                onClick={() => setActiveTab('quality')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'quality'
                    ? 'bg-indigo-500 text-white shadow-xl shadow-indigo-500/25'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                Quality & Efficiency Correlator
              </button>
            </div>
            
            <div className="text-xs font-mono text-slate-400 hidden lg:block">
              {activeTab === 'throughput' ? 'Hourly Telemetry' : activeTab === 'breakdowns' ? 'Machine Downtime Vectors' : 'Quality Defect & Efficiency'}
            </div>
          </div>

          <div className="h-[300px] w-full min-h-[300px] relative">
            <AnimatePresence mode="wait">
              {activeTab === 'throughput' && (
                <motion.div
                  key="throughput"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={uphData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                      <XAxis dataKey="hour" stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} style={{ fontSize: '11px', fontFamily: 'monospace' }} />
                      <YAxis stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} style={{ fontSize: '11px', fontFamily: 'monospace' }} />
                      <Tooltip {...tooltipStyle} />
                      <Legend style={{ fontSize: '12px' }} />
                      
                      {highlightAnomaly && (
                        <ReferenceLine x="11:00" stroke="#f43f5e" strokeWidth={2} label={{ value: 'Bottleneck Incident', fill: '#f43f5e', position: 'top', fontSize: '11px', fontFamily: 'monospace' }} />
                      )}
                      
                      <ReferenceLine y={450} stroke="#3b82f6" strokeDasharray="5 5" label={{ value: 'Line Target (450/hr)', fill: '#3b82f6', position: 'insideBottomRight', fontSize: '11.5px', fontFamily: 'monospace' }} />
                      
                      <Area type="monotone" dataKey="actual" name="Actual UPH (Units/Hour)" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>
              )}

              {activeTab === 'breakdowns' && (
                <motion.div
                  key="breakdowns"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={breakdownData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                      <XAxis dataKey="machine" stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                      <YAxis label={{ value: 'Downtime (Hours)', angle: -90, position: 'insideLeft', style: { fill: theme === 'dark' ? '#64748b' : '#94a3b8', fontSize: '11px' } }} stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} style={{ fontSize: '11px', fontFamily: 'monospace' }} />
                      <Tooltip {...tooltipStyle} />
                      <Bar dataKey="downtimeHours" name="Cumulative Downtime (Hrs)" fill="#10b981" radius={[8, 8, 0, 0]}>
                        {breakdownData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={highlightAnomaly && entry.machine.includes('conveyor') ? '#f43f5e' : index % 2 === 0 ? '#10b981' : '#6366f1'} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              )}

              {activeTab === 'quality' && (
                <motion.div
                  key="quality"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={uphData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                      <XAxis dataKey="hour" stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} style={{ fontSize: '11px', fontFamily: 'monospace' }} />
                      <YAxis yAxisId="left" stroke="#6366f1" style={{ fontSize: '11px', fontFamily: 'monospace' }} domain={[85, 110]} label={{ value: 'Efficiency (%)', angle: -90, position: 'insideLeft', style: { fill: '#6366f1', fontSize: '11px' } }} />
                      <YAxis yAxisId="right" orientation="right" stroke="#f43f5e" style={{ fontSize: '11px', fontFamily: 'monospace' }} domain={[0, 0.25]} label={{ value: 'Defect Rate (%)', angle: 90, position: 'insideRight', style: { fill: '#f43f5e', fontSize: '11px' } }} />
                      <Tooltip {...tooltipStyle} />
                      <Legend style={{ fontSize: '12px' }} />
                      
                      {highlightAnomaly && (
                        <ReferenceLine x="11:00" stroke="#f43f5e" strokeWidth={2} label={{ value: 'Defect Spike (0.18%)', fill: '#f43f5e', position: 'top', fontSize: '11px', fontFamily: 'monospace' }} />
                      )}
                      
                      <Line yAxisId="left" type="monotone" dataKey="efficiency" name="Line Efficiency (%)" stroke="#6366f1" strokeWidth={3} activeDot={{ r: 8 }} dot={{ r: 4 }} />
                      <Line yAxisId="right" type="monotone" dataKey="defectRate" name="Defect Rate (%)" stroke="#f43f5e" strokeWidth={3} activeDot={{ r: 8 }} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Live diagnostics insights board */}
        <div className="space-y-6">
          {/* Live Dashboard Photo / Telemetry Monitor Panel */}
          <div className={`p-4 rounded-3xl border overflow-hidden transition-all duration-300 relative group ${
            theme === 'dark' ? 'bg-slate-900/40 border-slate-800/80' : 'bg-slate-50 border-slate-100 shadow-md shadow-slate-100/50'
          }`}>
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-3.5 border border-indigo-500/15">
              <img 
                src={dashboardImg} 
                alt="Manufacturing KPI Dashboard Live Camera Feed" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              {/* Pulsing REC indicator */}
              <div className="absolute top-2.5 left-2.5 bg-rose-500/80 backdrop-blur-md px-2 py-0.5 rounded-full text-[9px] font-bold text-white tracking-widest uppercase flex items-center gap-1.5 shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                Live Feed
              </div>
              <div className="absolute bottom-2.5 right-2.5 bg-slate-950/80 backdrop-blur-md px-2.5 py-0.5 rounded-md text-[8px] font-mono text-cyan-400 border border-cyan-500/30">
                LINE_01_CAM
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h5 className={`text-xs font-extrabold font-display ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  KPI Telemetry Projection Map
                </h5>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Predictive automation active
                </p>
              </div>
              <span className="text-[9px] font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md font-semibold">
                1080P HD
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-4">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <h4 className={`font-bold text-lg font-display ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Operational Insights Feed
            </h4>
          </div>

          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
            {insights.map((insight) => (
              <div 
                key={insight.id} 
                className={`p-4 rounded-xl border relative overflow-hidden transition-all duration-300 ${
                  insight.type === 'critical' && highlightAnomaly
                    ? 'shadow-[0_0_15px_rgba(244,63,94,0.15)] border-rose-500/20 bg-rose-500/5'
                    : theme === 'dark'
                      ? 'bg-slate-900/40 border-slate-800/60 hover:bg-slate-900'
                      : 'bg-white border-slate-200 shadow-md shadow-slate-100 hover:shadow-lg'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    insight.type === 'critical' ? 'bg-rose-500' : insight.type === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />
                  <h5 className={`text-xs font-bold uppercase tracking-wider ${
                    insight.type === 'critical' ? 'text-rose-400' : theme === 'dark' ? 'text-slate-200' : 'text-slate-900'
                  }`}>
                    {insight.title}
                  </h5>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {insight.msg}
                </p>
                <div className="flex gap-2.5 mt-3">
                  {insight.tags.map((tag) => (
                     <span key={tag} className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800">
                       {tag}
                     </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className={`p-4 rounded-xl border flex items-center justify-between text-xs font-semibold font-mono ${
            theme === 'dark' ? 'bg-slate-900 dark:border-slate-800/60 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-600'
          }`}>
            <span>Connected via SAP Sync Script</span>
            <span className="text-emerald-500 font-bold">100% SECURED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
