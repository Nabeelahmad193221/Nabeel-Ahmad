import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { GoogleGenAI } from "@google/genai";
import ThreeDBackground from "./components/ThreeDBackground";

// Import custom redesigned modular components
import DashboardLoader from "./components/DashboardLoader";
import CustomCursor from "./components/CustomCursor";
import InteractiveDashboard from "./components/InteractiveDashboard";
import SkillsVisualizer from "./components/SkillsVisualizer";
import Timeline from "./components/Timeline";
import TiltCard from "./components/TiltCard";

import { 
  Database, 
  FileSpreadsheet, 
  BarChart3, 
  Terminal, 
  Mail, 
  Github,
  Briefcase,
  User,
  Zap,
  Settings,
  FolderGit2,
  Layers,
  ChevronRight,
  ChevronLeft,
  Award,
  ExternalLink,
  FileText,
  MessageSquare,
  Send,
  X,
  Loader2,
  Bot,
  Sun,
  Moon,
  Calendar,
  Check,
  Menu,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Cpu
} from "lucide-react";

const certificates = [
  { 
    name: "Microsoft Excel Dashboard", 
    url: "https://simpli-web.app.link/e/hNJxfK7PD1b",
    pdf: "/Excel Dashboard for Beginners.pdf"
  },
  { 
    name: "HR Analyst", 
    url: "https://simpli-web.app.link/e/iqn3xz9PD1b",
    pdf: "/HR Analytics Course.pdf"
  },
  { 
    name: "Databricks SQL for Data Analysis", 
    url: "https://simpli-web.app.link/e/xbb8yZnQD1b",
    pdf: "/Get Started with SQL Analytics and BI on Databrick.pdf"
  },
  { 
    name: "SQL Data Analysis", 
    url: "https://simpli-web.app.link/e/R528anlQD1b",
    pdf: "/SQL for Data Analysis.pdf"
  }
];

const projects = [
  { 
    name: "Manufacturing KPI Dashboard", 
    url: "https://github.com/nabeelahmad193221/manufacturing-kpi",
    overview: "A comprehensive dashboard for real-time monitoring of manufacturing performance dynamically.",
    problem: "Production managers lacked visibility into real-time UPH (Units Per Hour) and line efficiency, leading to delayed decision-making.",
    steps: ["Data extraction from SAP ERP", "Data cleaning using Python (Pandas)", "Dashboard design in Power BI", "Implementation of automated refresh cycles"],
    tools: ["Power BI", "Python", "SAP ERP", "SQL"],
    outcome: "Reduced reporting time by 80% and improved production throughput by 12% through real-time bottleneck identification.",
    image: "https://images.unsplash.com/photo-1551288049-bbbda536639a?auto=format&fit=crop&q=80&w=800",
    impact: "80% Time Saving"
  },
  { 
    name: "Machine Breakdown Analysis", 
    url: "https://github.com/nabeelahmad193221/machine-breakdown-analysis",
    overview: "In-depth analysis of machine downtime to identify root causes and preventive maintenance patterns.",
    problem: "Frequent unscheduled machine breakdowns were causing significant production losses and high maintenance costs.",
    steps: ["Historical downtime data collection", "Root cause analysis (RCA)", "Predictive maintenance scheduling", "Visualization of breakdown frequency and MTBF"],
    tools: ["Python", "Pandas", "Matplotlib", "Excel"],
    outcome: "Identified top 3 critical machines responsible for 60% of downtime, leading to a 15% reduction in unscheduled maintenance.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
    impact: "15% Less Downtime"
  }
];

const services = [
  {
    title: "Data Cleaning & Transformation",
    desc: "Converting raw, messy data into structured, analysis-ready formats using Python and SQL.",
    icon: Database,
    color: "text-blue-500 dark:text-blue-400"
  },
  {
    title: "Exploratory Data Analysis (EDA)",
    desc: "Uncovering hidden patterns, trends, and anomalies to drive hypothesis-led investigations.",
    icon: Zap,
    color: "text-amber-500 dark:text-amber-400"
  },
  {
    title: "Data Visualization & Storytelling",
    desc: "Creating compelling visual narratives that translate complex metrics into actionable insights.",
    icon: BarChart3,
    color: "text-emerald-500 dark:text-emerald-400"
  },
  {
    title: "Interactive Dashboard Creation",
    desc: "Building dynamic Power BI and Excel dashboards for real-time performance tracking.",
    icon: Layers,
    color: "text-indigo-500 dark:text-indigo-400"
  },
  {
    title: "Predictive Modeling",
    desc: "Leveraging statistical techniques to forecast future trends and optimize business processes.",
    icon: Terminal,
    color: "text-cyan-500 dark:text-cyan-400"
  }
];

const mainStatsList = [
  { value: "02+", label: "Years Experience", description: "In Manufacturing Intelligence & SAP Systems" },
  { value: "100%", label: "Accuracy Rate", description: "Maintained in SAP data synchronization pipelines" },
  { value: "12%", label: "Throughput Boost", description: "Added to output lines through real-time monitoring" },
];

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const { scrollY } = useScroll();
  const gridY = useTransform(scrollY, [0, 1500], [0, 150]);
  const orb1Y = useTransform(scrollY, [0, 1500], [0, -80]);
  const orb2Y = useTransform(scrollY, [0, 1500], [0, 100]);
  const [currentCertIndex, setCurrentCertIndex] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: "Hi! I'm Nabeel's AI assistant. Ask me anything about his experience, core skills, or breakdown forecasting projects!" }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [formState, setFormState] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [projectFilter, setProjectFilter] = useState<'All' | 'Power BI' | 'Python' | 'SQL' | 'Excel'>('All');
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Fallback: Open mailto in new tab
    const mailtoUrl = `mailto:nabeelahmad193221@gmail.com?subject=${encodeURIComponent(formState.subject || "Portfolio Inquiry")}&body=${encodeURIComponent(`Name: ${formState.name}\nEmail: ${formState.email}\n\n${formState.message}`)}`;
    window.location.href = mailtoUrl;

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormState({ name: "", email: "", subject: "", message: "" });
    
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentCertIndex((prev) => (prev + 1) % certificates.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Sticky header scroll and back-to-top handler
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);

      // Simple active section locator
      const sections = ["home", "about", "services", "skills", "experience", "dashboard", "projects", "certificates", "contact"];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
    }
  }, [chatMessages, isChatOpen]);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = userInput.trim();
    setUserInput("");
    setChatMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      const model = "gemini-3-flash-preview";
      
      const context = `
        You are Nabeel Ahmad's personal AI Assistant.
        About Nabeel Ahmad:
        - Role: Data Analyst at Haier Pakistan (Lahore, Pakistan). Joined March 2025.
        - Core expertise: Manufacturing Intelligence, line efficiency monitoring, UPH (Units Per Hour), and downtime RCA.
        - Tech Stack: Excel (Expert), Power BI, SAP ERP, Python (Advanced Pandas/NumPy), SQL Database Querying.
        - High-impact Achievements: Developed SAP ERP synchronized analytics reports, identified root machine failures reducing downtime by 15%, automated refresh cycles decreasing manual reporting time by 80%.
        - Certifications: Microsoft Excel Dashboard, HR Analyst, Databricks SQL, SQL Data Analysis.
        - Communication tone: Concise, authoritative on analytics, supportive, and friendly. Never hallucinate fake facts.
      `;

      const response = await ai.models.generateContent({
        model,
        contents: [
          { role: 'user', parts: [{ text: `${context}\n\nUser Question: ${userMessage}` }] }
        ],
      });

      const aiResponse = response.text || "I apologize, but I count not parse that output. Please verify coordinates.";
      setChatMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setChatMessages(prev => [...prev, { role: 'ai', text: "Data sync offset. I am having trouble connecting to my models right now. Please test again shortly!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const nextCert = () => setCurrentCertIndex((prev) => (prev + 1) % certificates.length);
  const prevCert = () => setCurrentCertIndex((prev) => (prev - 1 + certificates.length) % certificates.length);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const navLinks = [
    { name: "About", href: "#about", id: "about" },
    { name: "Services", href: "#services", id: "services" },
    { name: "Skills", href: "#skills", id: "skills" },
    { name: "Experience", href: "#experience", id: "experience" },
    { name: "Dashboard", href: "#dashboard", id: "dashboard" },
    { name: "Case Studies", href: "#projects", id: "projects" },
    { name: "Certificates", href: "#certificates", id: "certificates" },
    { name: "Contact", href: "#contact", id: "contact" }
  ];

  // Filtering projects
  const filteredProjects = projects.filter(project => {
    if (projectFilter === 'All') return true;
    return project.tools.includes(projectFilter);
  });

  return (
    <>
      <AnimatePresence>
        {!isLoadingComplete && (
          <DashboardLoader onComplete={() => setIsLoadingComplete(true)} />
        )}
      </AnimatePresence>

      <CustomCursor />

      <div className={`min-h-screen transition-colors duration-500 font-sans ${
        theme === 'dark' ? 'bg-slate-950 text-slate-300' : 'bg-slate-50 text-slate-900'
      }`}>
        
        {/* Navigation Bar */}
        <nav className={`fixed top-0 left-0 right-0 z-40 backdrop-blur-md border-b transition-all duration-300 ${
          theme === 'dark' ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-200/60 shadow-sm shadow-slate-100/50'
        }`}>
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 cursor-pointer animate-fade-in"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20 overflow-hidden shrink-0 group transition-all duration-300 hover:scale-105 active:scale-95">
                <div className="w-full h-full rounded-full overflow-hidden bg-slate-950 flex items-center justify-center">
                  <span className="text-white text-xs font-bold font-mono">NA</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className={`font-bold tracking-tight text-sm font-display ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  NABEEL AHMAD
                </span>
                <span className="text-[10px] font-mono text-indigo-500 font-bold tracking-widest uppercase">
                  DATA ANALYST
                </span>
              </div>
            </motion.div>

            {/* Desktop Nav Actions */}
            <div className="flex items-center gap-8">
              <div className="hidden xl:flex items-center gap-1.5 bg-slate-100/80 dark:bg-slate-900/50 p-1.5 rounded-full border border-slate-200/40 dark:border-slate-800/40">
                {navLinks.map((link) => {
                  const isActive = activeSection === link.id;
                  return (
                    <a 
                      key={link.name}
                      href={link.href}
                      className={`text-xs font-semibold px-4 py-2 rounded-full transition-all tracking-wide ${
                        isActive
                          ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                          : theme === 'dark'
                            ? 'text-slate-400 hover:text-white'
                            : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {link.name}
                    </a>
                  );
                })}
              </div>

              {/* Utility Panel */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={toggleTheme}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    theme === 'dark' 
                      ? 'bg-slate-900 border-slate-800 text-amber-400 hover:border-amber-400/50' 
                      : 'bg-white border-slate-200 text-indigo-600 hover:border-indigo-600/50 shadow-sm'
                  }`}
                  aria-label="Toggle visual theme"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className={`xl:hidden p-2.5 rounded-xl border transition-all cursor-pointer ${
                    theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                  }`}
                >
                  <Menu className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`xl:hidden border-t overflow-hidden ${
                  theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className="p-6 flex flex-col gap-3">
                  {navLinks.map((link) => (
                    <a 
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`text-sm font-semibold p-3.5 rounded-xl transition-all ${
                        activeSection === link.id
                          ? 'bg-indigo-500/10 text-indigo-500'
                          : theme === 'dark'
                            ? 'text-slate-400 hover:bg-slate-900 hover:text-white'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Outer Background Interactive Grids & Node Arrays with Deep Parallax */}
        <div id="home" className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Dynamic Parallax Background Slide Container */}
          <motion.div style={{ y: gridY }} className="absolute inset-x-0 -top-40 h-[220vh] pointer-events-none">
            <div className={`absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] ${
              theme === 'dark' ? 'opacity-30' : 'opacity-[0.06]'
            }`} />
            
            {/* Animated node matrix */}
            <svg className={`absolute inset-0 w-full h-full ${theme === 'dark' ? 'opacity-25' : 'opacity-[0.04]'}`}>
              <pattern id="nodes-mesh" x="0" patternUnits="userSpaceOnUse" width="120" height="120">
                <circle cx="10" cy="10" r="1.5" fill="#6366f1" />
                <line x1="10" y1="10" x2="110" y2="10" stroke="#6366f1" strokeWidth="0.5" strokeDasharray="4 4" />
                <line x1="10" y1="10" x2="10" y2="110" stroke="#6366f1" strokeWidth="0.5" strokeDasharray="4 4" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#nodes-mesh)" />
            </svg>
          </motion.div>

          {/* Glowing Animated Gradient Orbs in Background */}
          <motion.div 
            style={{ y: orb1Y }}
            animate={{ 
              scale: [1, 1.15, 1],
              opacity: [0.18, 0.28, 0.18]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute top-[18%] left-[8%] w-[380px] h-[380px] rounded-full blur-[130px] mix-blend-screen pointer-events-none ${
              theme === 'dark' ? 'bg-indigo-600/40' : 'bg-indigo-200/30'
            }`} 
          />
          <motion.div 
            style={{ y: orb2Y }}
            animate={{ 
              scale: [1.15, 1, 1.15],
              opacity: [0.12, 0.22, 0.12]
            }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute top-[55%] right-[8%] w-[480px] h-[480px] rounded-full blur-[150px] mix-blend-screen pointer-events-none ${
              theme === 'dark' ? 'bg-cyan-600/40' : 'bg-cyan-200/30'
            }`} 
          />
        </div>

        {/* Hero Landing Core */}
        <header className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-16 overflow-hidden">
          <ThreeDBackground />

          <div className="text-center max-w-5xl mx-auto relative z-10">
            {/* Holographic Spinning Metrics Hub */}
            <div className="mb-10 relative inline-block">
              {/* Spinning outer orbit */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="w-48 h-48 md:w-56 md:h-56 rounded-full border border-indigo-500/25 flex items-center justify-center relative pointer-events-none"
              >
                <div className="absolute inset-0 rounded-full border-t-2 border-indigo-500/40 animate-spin" style={{ animationDuration: '4s' }} />
                <div className="absolute inset-3 rounded-full border-b-2 border-cyan-500/40 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }} />
                
                {/* Satellite data orbit points */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.9)]"
                    style={{
                      transformOrigin: `center ${85 + i * 15}px`,
                      top: -12
                    }}
                  />
                ))}
              </motion.div>

              {/* Absolute Centered static profile photo replacement with high-tech logo & hover animations */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.04, 1] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  whileHover={{ scale: 1.12 }}
                  className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-indigo-500/80 bg-slate-950 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.45)] cursor-pointer relative z-20 group"
                >
                  {/* Digital Grid Pattern Background */}
                  <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:10px_10px]" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-transparent to-cyan-500/20" />
                  
                  {/* Techy glowing initials */}
                  <div className="relative flex flex-col items-center justify-center z-10 select-none">
                    <span className="text-4xl md:text-5xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-tr from-indigo-400 via-cyan-300 to-white font-display drop-shadow-[0_0_15px_rgba(99,102,241,0.6)]">
                      NA
                    </span>
                    <Terminal className="w-4 h-4 text-cyan-400/80 mt-1 animate-pulse" />
                  </div>
                  
                  {/* Subtle technical overlay scan lines/reflection */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-white/10 pointer-events-none" />
                </motion.div>
              </div>
            </div>

            {/* Glowing Tagline Pill */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className={`inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border backdrop-blur-md shadow-2xl ${
                theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
              <span className="text-indigo-600 dark:text-indigo-400 text-xs font-mono font-bold uppercase tracking-wider">
                Active Analyst at Haier Pakistan
              </span>
            </motion.div>

            {/* Magnificent Typography Title */}
            <h1 className={`text-5xl md:text-8xl lg:text-9xl font-black tracking-tight mb-6 font-display leading-[1] ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              NABEEL <span className="text-gradient">AHMAD</span>
            </h1>

            <p className={`text-base md:text-xl max-w-3xl mx-auto font-light leading-relaxed mb-10 ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Designing operational intelligence pipelines. Transforming factory downtime, SAP logs, and supply records into optimal KPI architectures.
            </p>

            {/* Primary Action Buttons with premium hover indicators */}
            <div className="flex flex-wrap justify-center gap-4 relative z-10">
              <motion.a 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                href="#dashboard" 
                className="flex items-center gap-2.5 px-8 py-4 rounded-xl bg-indigo-500 text-white font-bold hover:bg-indigo-400 transition-colors shadow-lg shadow-indigo-500/25 cursor-pointer text-sm md:text-base"
              >
                <Cpu className="w-5 h-5 animate-pulse" /> View Live Simulator
              </motion.a>
              
              <motion.a 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                href="#projects" 
                className="flex items-center gap-2.5 px-8 py-4 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/25 cursor-pointer text-sm md:text-base"
              >
                <FolderGit2 className="w-5 h-5" /> Explore Case Studies
              </motion.a>

              <motion.a 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                href="/Nabeel_Ahmad_Resume.pdf" 
                download
                className={`flex items-center gap-2.5 px-8 py-4 rounded-xl font-bold transition-all shadow-md text-sm md:text-base ${
                  theme === 'dark' ? 'bg-slate-800 text-white border border-slate-700 hover:bg-slate-700' : 'bg-white text-slate-800 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <FileText className="w-5 h-5" /> Download Resume
              </motion.a>
            </div>
          </div>
        </header>

        {/* Global Dashboard Main Core */}
        <main className="relative z-10 max-w-7xl mx-auto px-6 py-20 space-y-36">

          {/* Section: Dynamic Stat counters */}
          <section className="scroll-mt-28">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mainStatsList.map((stat, sIdx) => (
                <div 
                  key={sIdx} 
                  className={`p-8 rounded-[2rem] border transition-all duration-300 relative overflow-hidden ${
                    theme === 'dark' ? 'bg-slate-900/40 border-slate-850 hover:bg-slate-900' : 'bg-white border-slate-200 shadow-xl'
                  }`}
                >
                  <p className="text-3xl lg:text-5xl font-black font-display text-indigo-500 dark:text-indigo-400 mb-2">
                    {stat.value}
                  </p>
                  <h4 className={`text-base font-bold font-display ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {stat.label}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
          
          {/* Section: Executive Summary (About Me) */}
          <motion.section 
            id="about" 
            className="scroll-mt-28"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 mb-12">
              <div className={`p-3 rounded-xl border glow-indigo ${
                theme === 'dark' ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-200'
              }`}>
                <User className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
              </div>
              <h2 className={`text-3xl lg:text-4xl font-extrabold font-display ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Executive Summary
              </h2>
              <div className={`h-px flex-1 bg-gradient-to-r ml-4 ${
                theme === 'dark' ? 'from-slate-800 to-transparent' : 'from-slate-200 to-transparent'
              }`} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Profile Card */}
              <TiltCard className="lg:col-span-4 flex rounded-[2.5rem]">
                <div className={`p-8 rounded-[2.5rem] border shadow-xl relative overflow-hidden flex flex-col items-center justify-center text-center w-full h-full group ${
                  theme === 'dark' ? 'glass-card border-slate-800/80' : 'bg-white border-slate-200'
                }`}>
                  <div className={`absolute -right-12 -top-12 w-44 h-44 blur-[80px] rounded-full mix-blend-screen pointer-events-none opacity-20 ${
                    theme === 'dark' ? 'bg-indigo-500' : 'bg-indigo-300'
                  }`} />
                  
                  <div className="relative w-44 h-44 md:w-48 md:h-48 rounded-full p-1 bg-gradient-to-tr from-indigo-500 via-cyan-400 to-indigo-600 shadow-[0_0_25px_rgba(99,102,241,0.25)] group-hover:shadow-[0_0_40px_rgba(99,102,241,0.45)] transition-all duration-500 mb-6 shrink-0 flex items-center justify-center">
                    <div className="w-full h-full rounded-full overflow-hidden bg-slate-950 flex flex-col items-center justify-center relative">
                      {/* Grid overlay */}
                      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:8px_8px]" />
                      <User className="w-16 h-16 text-indigo-400/80 mb-1 group-hover:scale-110 transition-transform duration-300" />
                      <span className="text-2xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-cyan-200">
                        NA
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className={`text-2xl font-extrabold font-display tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      Nabeel Ahmad
                    </h3>
                    <p className="text-xs font-mono font-bold text-indigo-500 dark:text-indigo-400 mt-1 uppercase tracking-widest">
                      Data Analyst
                    </p>
                    <p className={`text-xs mt-3 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                      Haier Pakistan Co. • Lahore
                    </p>
                  </div>
                </div>
              </TiltCard>

              {/* Executive Summary */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-6">
                <TiltCard className="rounded-[2.5rem] flex-grow">
                  <div className={`p-8 md:p-10 rounded-[2.5rem] border leading-relaxed shadow-xl relative overflow-hidden h-full group ${
                    theme === 'dark' ? 'glass-card border-slate-800/80' : 'bg-white border-slate-200'
                  }`}>
                    <div className={`absolute -right-20 -top-20 w-64 h-64 blur-[100px] rounded-full mix-blend-screen pointer-events-none opacity-20 ${
                      theme === 'dark' ? 'bg-indigo-505' : 'bg-indigo-301'
                    }`} />
                    
                    <h3 className={`text-2xl font-extrabold mb-4 font-display ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      Strategic Analyst @ Haier
                    </h3>
                    <div className={`space-y-4 text-sm md:text-base ${theme === 'dark' ? 'text-slate-400' : 'text-slate-650'}`}>
                      <p>
                        I specialize in <span className="text-indigo-500 dark:text-indigo-400 font-semibold italic">Manufacturing Intelligence</span>—where raw factory data meets strategic decision-making. My work at Haier Pakistan involves optimizing production efficiency through real-time KPI monitoring and SAP ERP integration.
                      </p>
                      <p>
                        With architectural precision, I build data pipelines that transform fragmented metrics into cohesive narratives, focusing on <span className="font-bold underline decoration-indigo-400 decoration-2">tangible operations</span>.
                      </p>
                    </div>
                  </div>
                </TiltCard>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Exp", value: "2+ Years" },
                    { label: "City", value: "Lahore" },
                    { label: "Active", value: "Available" }
                  ].map((stat, i) => (
                    <div key={i} className={`p-4 rounded-3xl border text-center ${
                      theme === 'dark' ? 'bg-slate-900/50 border-slate-850' : 'bg-slate-50 border-slate-100'
                    }`}>
                      <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-0.5">{stat.label}</p>
                      <p className={`text-xs font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specializations */}
              <TiltCard className="lg:col-span-3 flex rounded-[2.5rem]">
                <div className={`p-8 rounded-[2.5rem] border shadow-xl relative overflow-hidden flex flex-col justify-between h-full w-full group ${
                  theme === 'dark' ? 'bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800/80' : 'bg-white border-slate-200'
                }`}>
                  <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full -mr-16 -mt-16 transition-colors ${
                    theme === 'dark' ? 'bg-indigo-500/10' : 'bg-indigo-100'
                  }`} />
                  
                  <div>
                    <h3 className="text-xs font-mono text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-6 relative z-10 flex items-center gap-2 font-bold font-display">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                      Ecosystem
                    </h3>
                    <ul className="space-y-4 relative z-10">
                      {[
                        "Manufacturing KPI",
                        "Predictive Cycles",
                        "SAP ERP Datasets",
                        "Visualizations",
                        "Operational Strategy"
                      ].map((item, i) => (
                        <motion.li 
                          key={i} 
                          className={`flex items-center gap-2.5 text-xs font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}
                        >
                          <div className="w-6 h-6 rounded-md bg-indigo-500/10 flex items-center justify-center border border-indigo-500/15 transition-colors shrink-0">
                            <Check className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-500'}`} />
                          </div>
                          <span className="truncate">{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 relative z-10">
                    <div className={`p-4 rounded-2xl border ${
                      theme === 'dark' ? 'bg-slate-950/50 border-slate-850' : 'bg-slate-50 border-slate-100'
                    }`}>
                      <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-0.5 font-bold">Motto</p>
                      <p className={`italic font-serif leading-relaxed text-xs ${theme === 'dark' ? 'text-slate-300' : 'text-slate-650'}`}>
                        "In God we trust. All others bring data."
                      </p>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </div>
          </motion.section>

          {/* Section: Core Services */}
          <motion.section 
            id="services" 
            className="scroll-mt-28"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 mb-12">
              <div className={`p-3 rounded-xl border glow-indigo ${
                theme === 'dark' ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-200'
              }`}>
                <Zap className="w-6 h-6 text-indigo-500" />
              </div>
              <h2 className={`text-3xl lg:text-4xl font-extrabold font-display ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Core Services
              </h2>
              <div className={`h-px flex-1 bg-gradient-to-r ml-4 ${
                theme === 'dark' ? 'from-slate-800 to-transparent' : 'from-slate-200 to-transparent'
              }`} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, i) => (
                <TiltCard key={i} className="rounded-[2.5rem]">
                  <div
                    className={`p-8 rounded-[2.5rem] border transition-all duration-300 group cursor-default relative overflow-hidden h-full ${
                      theme === 'dark' 
                        ? 'bg-slate-900/40 border-slate-850 hover:bg-slate-900 hover:border-indigo-500/20' 
                        : 'bg-white border-slate-205 shadow-sm'
                    }`}
                  >
                    <div className={`p-4 rounded-2xl mb-6 inline-block transition-transform duration-300 group-hover:scale-110 ${
                      theme === 'dark' ? 'bg-slate-950 border border-slate-850' : 'bg-slate-50 border border-slate-100'
                    }`}>
                      <service.icon className={`w-7 h-7 ${service.color}`} />
                    </div>
                    <h3 className={`text-xl font-extrabold mb-4 font-display ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      {service.title}
                    </h3>
                    <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                      {service.desc}
                    </p>
                  </div>
                </TiltCard>
              ))}
            </div>
          </motion.section>

          {/* Section: Interactive Skills Visualizer */}
          <motion.section 
            id="skills" 
            className="scroll-mt-28"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 mb-12">
              <div className={`p-3 rounded-xl border glow-indigo ${
                theme === 'dark' ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-200'
              }`}>
                <Layers className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
              </div>
              <h2 className={`text-3xl lg:text-4xl font-extrabold font-display ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Skills & Ecosystem
              </h2>
              <div className={`h-px flex-1 bg-gradient-to-r ml-4 ${
                theme === 'dark' ? 'from-slate-800 to-transparent' : 'from-slate-200 to-transparent'
              }`} />
            </div>

            <SkillsVisualizer theme={theme} />
          </motion.section>

          {/* Section: Timeline Experience & Education */}
          <motion.section 
            id="experience" 
            className="scroll-mt-28"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 mb-12">
              <div className={`p-3 rounded-xl border glow-indigo ${
                theme === 'dark' ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-200'
              }`}>
                <Briefcase className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
              </div>
              <h2 className={`text-3xl lg:text-4xl font-extrabold font-display ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Professional Journey
              </h2>
              <div className={`h-px flex-1 bg-gradient-to-r ml-4 ${
                theme === 'dark' ? 'from-slate-800 to-transparent' : 'from-slate-200 to-transparent'
              }`} />
            </div>

            <Timeline theme={theme} />
          </motion.section>

          {/* New Section: Recharts KPI Interactive Dashboard */}
          <motion.section 
            id="dashboard" 
            className="scroll-mt-28"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 mb-12">
              <div className={`p-3 rounded-xl border glow-indigo ${
                theme === 'dark' ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-200'
              }`}>
                <BarChart3 className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
              </div>
              <h2 className={`text-3xl lg:text-4xl font-extrabold font-display ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Industry 4.0 Dashboard Showcase
              </h2>
              <div className={`h-px flex-1 bg-gradient-to-r ml-4 ${
                theme === 'dark' ? 'from-slate-800 to-transparent' : 'from-slate-200 to-transparent'
              }`} />
            </div>

            <InteractiveDashboard theme={theme} />
          </motion.section>

          {/* Section: Projects (Case Studies) with Filters */}
          <motion.section 
            id="projects" 
            className="scroll-mt-28"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-6 border-b border-slate-200/50 dark:border-slate-800/50">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl border glow-indigo ${
                  theme === 'dark' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'
                }`}>
                  <FolderGit2 className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <h2 className={`text-3xl lg:text-4xl font-extrabold font-display ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    Case Studies & Repositories
                  </h2>
                </div>
              </div>

              {/* Dynamic Filtering Panel */}
              <div className="flex flex-wrap items-center gap-2 bg-slate-100/80 dark:bg-slate-900/50 p-1 rounded-2xl border border-slate-200/40 dark:border-slate-800/40">
                {(['All', 'Power BI', 'Python', 'SQL', 'Excel'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setProjectFilter(filter)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      projectFilter === filter
                        ? 'bg-emerald-500 text-white shadow-md'
                        : theme === 'dark'
                          ? 'text-slate-400 hover:text-white'
                          : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-16">
              <AnimatePresence mode="popLayout">
                {filteredProjects.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center p-12 text-slate-500"
                  >
                    No projects found for current criteria.
                  </motion.div>
                ) : (
                  filteredProjects.map((project, idx) => (
                    <motion.div 
                      key={project.name}
                      layout
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ duration: 0.6 }}
                      className="w-full"
                    >
                      <TiltCard className="rounded-[2.5rem]">
                        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-8 md:p-12 rounded-[2.5rem] border transition-all ${
                          theme === 'dark' ? 'glass-card hover:border-emerald-500/20' : 'bg-white border-slate-200'
                        }`}>
                          <div className={`relative rounded-3xl overflow-hidden group aspect-video border ${
                            theme === 'dark' ? 'border-slate-850' : 'border-slate-200'
                          }`}>
                            <img 
                              src={project.image} 
                              alt={project.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex flex-col justify-end p-8 gap-4">
                              <span className="text-emerald-400 font-mono text-xs font-black uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/25 px-3 py-1.5 rounded-xl self-start">
                                IMPACT: {project.impact}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-6">
                            <div className="flex flex-wrap gap-2">
                              {project.tools.map(tool => (
                                <span key={tool} className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold border ${
                                  theme === 'dark' ? 'bg-slate-950 border-slate-800 text-emerald-400' : 'bg-emerald-50 border-emerald-100 text-emerald-600'
                                }`}>
                                  {tool}
                                </span>
                              ))}
                            </div>
                            <h3 className={`text-3xl md:text-4xl font-extrabold font-display leading-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                              {project.name}
                            </h3>
                            <p className={`text-base md:text-lg leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-650'}`}>
                              {project.overview}
                            </p>
                            
                            <div className="space-y-4 pt-2">
                              <div className={`p-6 rounded-2xl border ${
                                theme === 'dark' ? 'bg-slate-950/50 border-slate-850' : 'bg-slate-50 border-slate-100'
                              }`}>
                                <h4 className={`text-xs font-black uppercase tracking-widest mb-2 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                  The Problem
                                </h4>
                                <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                                  {project.problem}
                                </p>
                              </div>
                              <div className={`p-6 rounded-2xl border ${
                                theme === 'dark' ? 'bg-slate-950/50 border-slate-850' : 'bg-slate-50 border-slate-100'
                              }`}>
                                <h4 className={`text-xs font-black uppercase tracking-widest mb-2 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                  Key Outcome
                                </h4>
                                <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                                  {project.outcome}
                                </p>
                              </div>
                            </div>

                            <div className="pt-4 flex gap-4 max-w-sm">
                              <a 
                                href={project.url} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors shadow-lg self-start text-sm"
                              >
                                <Github className="w-5 h-5" /> View Git Code
                              </a>
                            </div>
                          </div>
                        </div>
                      </TiltCard>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.section>

          {/* Section: Certificates Slider */}
          <motion.section 
            id="certificates" 
            className="scroll-mt-28"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 mb-12">
              <div className={`p-3 rounded-xl border glow-indigo ${
                theme === 'dark' ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-200'
              }`}>
                <Award className="w-6 h-6 text-amber-500" />
              </div>
              <h2 className={`text-3xl lg:text-4xl font-extrabold font-display ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Certificates & Achievements
              </h2>
              <div className={`h-px flex-1 bg-gradient-to-r ml-4 ${
                theme === 'dark' ? 'from-slate-800 to-transparent' : 'from-slate-200 to-transparent'
              }`} />
            </div>

            <div className="relative group max-w-4xl mx-auto">
              <div className={`overflow-hidden rounded-[2.5rem] border backdrop-blur-sm relative shadow-2xl min-h-[350px] flex items-center justify-center ${
                theme === 'dark' ? 'bg-slate-900/40 border-slate-850' : 'bg-white border-slate-200'
              }`}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentCertIndex}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="p-8 md:p-12 flex flex-col items-center text-center w-full"
                  >
                    <div className="w-full max-w-2xl">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider mb-6 ${
                        theme === 'dark' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500 font-bold' : 'bg-amber-50 border-amber-100 text-amber-600 font-bold'
                      }`}>
                        Verified Achievement
                      </div>
                      
                      <h3 className={`text-2xl md:text-4xl font-black mb-6 leading-tight font-display ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        {certificates[currentCertIndex].name}
                      </h3>
                      
                      <p className={`mb-10 text-base leading-relaxed max-w-xl mx-auto ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                        Professional certification demonstrating expertise and commitment to industry excellence in data analytics and manufacturing intelligence operations.
                      </p>
                      
                      <div className="flex flex-wrap justify-center gap-4">
                        <motion.a 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          href={certificates[currentCertIndex].url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-all shadow-lg group/btn text-sm md:text-base"
                        >
                          Verify Online <ExternalLink className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                        </motion.a>
                        <motion.a 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          href={certificates[currentCertIndex].pdf} 
                          target="_blank" 
                          rel="noreferrer" 
                          className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all border group/btn text-sm md:text-base ${
                            theme === 'dark' ? 'bg-slate-800 text-white border-slate-705 hover:bg-slate-700' : 'bg-slate-100 text-slate-900 border-slate-205 hover:bg-slate-200'
                          }`}
                        >
                          View Plan PDF <FileText className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                        </motion.a>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Slider controls */}
              <button 
                onClick={prevCert}
                className={`absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 p-4 rounded-2xl border transition-all shadow-xl z-20 cursor-pointer ${
                  theme === 'dark' 
                    ? 'bg-slate-900 border-slate-800 text-white hover:border-amber-500/50 hover:bg-slate-800' 
                    : 'bg-white border-slate-200 text-slate-900 hover:border-amber-500/50 hover:bg-slate-50'
                }`}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={nextCert}
                className={`absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 p-4 rounded-2xl border transition-all shadow-xl z-20 cursor-pointer ${
                  theme === 'dark' 
                    ? 'bg-slate-900 border-slate-800 text-white hover:border-amber-500/50 hover:bg-slate-800' 
                    : 'bg-white border-slate-200 text-slate-900 hover:border-amber-500/50 hover:bg-slate-50'
                }`}
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Pagination indicators */}
              <div className="flex justify-center gap-3 mt-10">
                {certificates.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentCertIndex(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      i === currentCertIndex 
                        ? 'w-12 bg-amber-500' 
                        : theme === 'dark' ? 'w-2 bg-slate-800 hover:bg-slate-700' : 'w-2 bg-slate-200 hover:bg-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.section>

          {/* Section: Contact & Chat Interface */}
          <motion.section 
            id="contact" 
            className="scroll-mt-28"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 mb-12">
              <div className={`p-3 rounded-xl border glow-indigo ${
                theme === 'dark' ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-200'
              }`}>
                <Mail className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
              </div>
              <h2 className={`text-3xl lg:text-4xl font-extrabold font-display ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Get In Touch
              </h2>
              <div className={`h-px flex-1 bg-gradient-to-r ml-4 ${
                theme === 'dark' ? 'from-slate-800 to-transparent' : 'from-slate-200 to-transparent'
              }`} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Left Contact coordinates details */}
              <div className="space-y-8">
                <h3 className={`text-4xl md:text-5xl font-black leading-tight font-display ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Let's build something <span className="text-gradient font-black">data-driven</span> together.
                </h3>
                <p className={`text-base md:text-lg leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  Whether you have a query on downtime metrics, require SAP ERP analysis assistance, or want to collaborate on active industrial dashboards.
                </p>
                
                <div className="space-y-4">
                  <motion.a 
                    whileHover={{ x: 8 }}
                    href="mailto:nabeelahmad193221@gmail.com" 
                    className={`flex items-center gap-4 p-5 rounded-2xl border transition-all group ${
                      theme === 'dark' ? 'bg-slate-900/40 border-slate-850 hover:border-cyan-500/30' : 'bg-white border-slate-200 hover:border-indigo-500/30 shadow-md'
                    }`}
                  >
                    <div className={`p-3 rounded-xl border transition-colors ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'
                    }`}>
                      <Mail className={`w-5 h-5 ${theme === 'dark' ? 'text-cyan-400' : 'text-indigo-600'}`} />
                    </div>
                    <div>
                      <p className="text-xs font-mono text-slate-500 uppercase font-black">Email Coordinate</p>
                      <p className={`font-semibold text-sm md:text-base ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        nabeelahmad193221@gmail.com
                      </p>
                    </div>
                  </motion.a>
                  
                  <motion.a 
                    whileHover={{ x: 8 }}
                    href="https://wa.me/923246278872" 
                    target="_blank" 
                    rel="noreferrer" 
                    className={`flex items-center gap-4 p-5 rounded-2xl border transition-all group ${
                      theme === 'dark' ? 'bg-slate-900/40 border-slate-850 hover:border-emerald-500/30' : 'bg-white border-slate-200 hover:border-emerald-500/30 shadow-md'
                    }`}
                  >
                    <div className={`p-3 rounded-xl border transition-colors ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'
                    }`}>
                      <Zap className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-xs font-mono text-slate-500 uppercase font-black">WhatsApp Line</p>
                      <p className={`font-semibold text-sm md:text-base ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        +92 324 6278872
                      </p>
                    </div>
                  </motion.a>

                  <motion.div 
                    className={`flex items-center gap-4 p-5 rounded-2xl border ${
                      theme === 'dark' ? 'bg-slate-900/20 border-slate-850' : 'bg-indigo-50/20 border-slate-200'
                    }`}
                  >
                    <div className={`p-3 rounded-xl border ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-100'
                    }`}>
                      <Calendar className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-xs font-mono text-slate-500 uppercase font-bold">Location Coordinate</p>
                      <p className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        Lahore, Punjab, Pakistan
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Right Custom Interactive AI assistant */}
              <div className={`p-8 rounded-[3rem] border flex flex-col justify-between ${
                theme === 'dark' ? 'glass-card border-slate-800/80 shadow-2xl' : 'bg-white border-slate-200 shadow-2xl shadow-slate-150'
              }`}>
                <div>
                  <div className="flex items-center gap-3.5 mb-8 pb-4 border-b border-slate-100 dark:border-slate-850">
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                      <Bot className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h3 className={`text-base font-extrabold font-display ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        Analytics Consultation Sync
                      </h3>
                      <span className="text-[10px] font-mono text-indigo-500 font-black">ONLINE COGNITIVE NODE</span>
                    </div>
                  </div>
                  
                  <div className="h-[280px] overflow-y-auto mb-6 space-y-4 pr-1 custom-scrollbar">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex items-start gap-3.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'ai' && (
                          <div className="w-8 h-8 rounded-full overflow-hidden border border-indigo-500/35 shadow-[0_0_8px_rgba(99,102,241,0.25)] shrink-0 mt-0.5 group bg-slate-950 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-indigo-400 transition-transform duration-300 group-hover:scale-110" />
                          </div>
                        )}
                        <div className={`max-w-[85%] p-4 rounded-2xl text-xs md:text-sm leading-relaxed ${
                          msg.role === 'user' 
                            ? 'bg-indigo-500 text-white rounded-br-none shadow-md shadow-indigo-500/20' 
                            : theme === 'dark' 
                              ? 'bg-slate-950 border border-slate-850 text-slate-300 rounded-bl-none' 
                              : 'bg-slate-50 border border-slate-100 text-slate-700 rounded-bl-none shadow-sm'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className={`p-4 rounded-2xl flex gap-1.5 ${
                          theme === 'dark' ? 'bg-slate-950 border border-slate-850' : 'bg-slate-50 border border-slate-100'
                        }`}>
                          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.18s]" />
                          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.36s]" />
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <input 
                    type="text" 
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask me how Nabeel optimized throughput..."
                    className={`flex-1 px-5 py-3.5 rounded-xl border text-xs md:text-sm outline-none transition-all ${
                      theme === 'dark' 
                        ? 'bg-slate-950 border-slate-850 text-white focus:border-indigo-500' 
                        : 'bg-slate-50 border-slate-150 text-slate-900 focus:border-indigo-500'
                    }`}
                  />
                  <button 
                    onClick={handleSendMessage}
                    className="p-3.5 rounded-xl bg-indigo-500 text-white hover:bg-indigo-450 transition-colors cursor-pointer shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.section>
        </main>

        {/* Dynamic Static Footer */}
        <footer className={`relative z-10 py-12 border-t ${
          theme === 'dark' ? 'bg-slate-950 border-slate-850' : 'bg-white border-slate-205'
        }`}>
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 p-0.5 flex items-center justify-center shadow-md overflow-hidden shrink-0 transition-transform duration-300 hover:scale-105">
                <div className="w-full h-full rounded-full overflow-hidden bg-slate-950 flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold font-mono">NA</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className={`font-bold tracking-tight text-xs font-display ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  NABEEL AHMAD
                </span>
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                  Industrial Intelligence 2026
                </span>
              </div>
            </div>
            
            <p className={`text-xs font-mono ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
              © {new Date().getFullYear()} Nabeel Ahmad. Powered by accurate data. All rights reserved.
            </p>
            
            <div className="flex gap-4">
              <a href="https://github.com/nabeelahmad193221" target="_blank" rel="noreferrer" className={`hover:text-indigo-500 transition-colors ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}><Github className="w-5 h-5" /></a>
              <a href="https://www.linkedin.com/in/nabeel-ahmad-a92a48399" target="_blank" rel="noreferrer" className={`hover:text-indigo-500 transition-colors ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}><Briefcase className="w-5 h-5" /></a>
              <a href="mailto:nabeelahmad193221@gmail.com" className={`hover:text-indigo-500 transition-colors ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}><Mail className="w-5 h-5" /></a>
            </div>
          </div>
        </footer>

        {/* Hover Scroll-to-Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="fixed bottom-6 right-6 z-40 p-4 rounded-2xl bg-indigo-500 text-white shadow-2xl hover:bg-indigo-400 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6 rotate-90" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
