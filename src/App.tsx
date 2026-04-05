import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GoogleGenAI } from "@google/genai";
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
  Bot
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

const skills = [
  { name: "Advanced Data Analytics", icon: FileSpreadsheet, level: 90, color: "from-emerald-400 to-emerald-600", desc: "Excel & DAX" },
  { name: "Business Intelligence", icon: BarChart3, level: 85, color: "from-amber-400 to-orange-500", desc: "Power BI" },
  { name: "ERP & Operations", icon: Database, level: 75, color: "from-cyan-400 to-blue-500", desc: "SAP ERP" },
];

const projects = [
  { name: "Manufacturing KPI Dashboard", url: "https://github.com/nabeelahmad193221/manufacturing-kpi" },
  { name: "Machine Breakdown Analysis", url: "https://github.com/nabeelahmad193221/machine-breakdown-analysis" }
];

const experience = [
  {
    role: "Data Analyst",
    company: "Haier Pakistan",
    period: "March 2025 – Present",
    location: "Lahore, Pakistan",
    highlights: [
      "Manufacturing Intelligence: Developed dynamic dashboards to monitor Units Per Hour (UPH) and production efficiency.",
      "SAP Integration: Streamlined data extraction from SAP ERP to ensure 100% accuracy in inventory reporting.",
      "Downtime Reduction: Analyzed machine breakdown data to provide actionable insights, reducing production delays.",
      "Process Engineering: Implemented 6S Discipline through data-driven performance monitoring."
    ]
  }
];

export default function App() {
  const [currentCertIndex, setCurrentCertIndex] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: "Hi! I'm Nabeel's AI assistant. Ask me anything about his experience, skills, or projects!" }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [formState, setFormState] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
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
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

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
        You are an AI assistant for Nabeel Ahmad's portfolio. 
        Nabeel is a Data Analyst at Haier Pakistan.
        Skills: Excel, Power BI, SAP ERP, Python, SQL, Pandas, NumPy.
        Experience: Data Analyst at Haier Pakistan (March 2025 - Present). 
        Highlights: Manufacturing Intelligence, SAP Integration, Downtime Reduction, Process Engineering.
        Projects: Manufacturing KPI Dashboard, Machine Breakdown Analysis.
        Certificates: Microsoft Excel Dashboard, HR Analyst, Databricks SQL for Data Analysis, SQL Data Analysis.
        Contact: nabeelahmad193221@gmail.com, WhatsApp: +923246278872.
        Location: Lahore, Pakistan.
        Tone: Professional, helpful, and concise.
      `;

      const response = await ai.models.generateContent({
        model,
        contents: [
          { role: 'user', parts: [{ text: `${context}\n\nUser Question: ${userMessage}` }] }
        ],
      });

      const aiResponse = response.text || "I'm sorry, I couldn't process that request.";
      setChatMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setChatMessages(prev => [...prev, { role: 'ai', text: "Sorry, I'm having trouble connecting right now. Please try again later!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const nextCert = () => setCurrentCertIndex((prev) => (prev + 1) % certificates.length);
  const prevCert = () => setCurrentCertIndex((prev) => (prev - 1 + certificates.length) % certificates.length);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-cyan-500/30">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 bg-indigo-500 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      </div>

      {/* Hero Section */}
      <header className="relative z-10 min-h-[70vh] flex flex-col items-center justify-center px-6 pt-20 pb-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-2xl"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-indigo-400 text-xs font-mono uppercase tracking-widest">
              Data Analyst | Manufacturing Intelligence | SAP ERP
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-9xl font-black tracking-tight mb-6 text-white font-display leading-[0.9]"
          >
            NABEEL <span className="text-gradient">AHMAD</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-slate-400 text-lg md:text-2xl max-w-2xl mx-auto font-light leading-relaxed mb-10"
          >
            Turning complex data into simple, actionable stories.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="mailto:nabeelahmad193221@gmail.com" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-950 font-semibold hover:bg-indigo-50 transition-colors shadow-lg shadow-white/10">
              <Mail className="w-5 h-5" /> Get in touch
            </motion.a>
            <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="#" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-500 text-slate-950 font-semibold hover:bg-indigo-400 transition-colors shadow-lg shadow-indigo-500/20">
              <FileText className="w-5 h-5" /> View Resume
            </motion.a>
            <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="https://github.com/nabeelahmad193221" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white hover:border-indigo-500/50 hover:bg-slate-800 transition-all">
              GitHub Profile
            </motion.a>
            <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="https://www.linkedin.com/in/nabeel-ahmad-a92a48399" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white hover:border-cyan-500/50 hover:bg-slate-800 transition-all">
              LinkedIn
            </motion.a>
            <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="https://wa.me/923246278872" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-500/20">
              WhatsApp
            </motion.a>
          </motion.div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-20 space-y-32">
        
        {/* Executive Summary */}
        <motion.section 
          id="about" 
          className="scroll-mt-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-4 mb-12">
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 glow-indigo">
              <User className="w-6 h-6 text-indigo-400" />
            </div>
            <h2 className="text-3xl font-bold text-white font-display">Executive Summary</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-slate-800 to-transparent ml-4" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6 text-slate-300 text-lg leading-relaxed glass-card p-8 rounded-3xl">
              <p>
                Strategic <span className="text-white font-semibold">Data Analyst</span> at 
                <span className="text-indigo-400 font-semibold"> Haier Pakistan</span>, transforming manufacturing data into operational excellence.
              </p>
              <p>
                Expert in building real-time KPI dashboards, optimizing production throughput (UPH), and streamlining reporting via Python and SAP ERP.
              </p>
              <p>
                Passionate about advancing into <span className="text-white font-semibold">predictive analytics</span> and <span className="text-white font-semibold">AI-driven process optimization</span> to shape the future of smart manufacturing.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-indigo-500/20 transition-colors" />
              <h3 className="text-xs font-mono text-indigo-400 uppercase tracking-widest mb-6 relative z-10">Domain Knowledge</h3>
              <ul className="space-y-5 relative z-10">
                {[
                  "Manufacturing Optimization",
                  "Machine Breakdown Analysis",
                  "Inventory Management",
                  "Predictive Analytics",
                  "AI-Driven Optimization"
                ].map((item, i) => (
                  <motion.li 
                    key={i} 
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 text-sm text-slate-300"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Tech Stack & Ecosystem */}
        <motion.section 
          id="tech-stack" 
          className="scroll-mt-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-4 mb-12">
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 glow-indigo">
              <Layers className="w-6 h-6 text-indigo-400" />
            </div>
            <h2 className="text-3xl font-bold text-white font-display">Tech Stack & Ecosystem</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-slate-800 to-transparent ml-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              whileHover={{ y: -5 }}
              className="group glass-card p-8 rounded-3xl transition-all duration-300 hover:glow-indigo"
            >
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-white font-semibold text-lg">Core Analytics</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Excel", "Power BI", "SAP ERP", "NumPy"].map(tech => (
                  <span key={tech} className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm font-medium text-slate-300 group-hover:border-emerald-500/40 transition-colors">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="group glass-card p-8 rounded-3xl transition-all duration-300 hover:glow-indigo"
            >
              <div className="flex items-center gap-3 mb-6">
                <Terminal className="w-5 h-5 text-indigo-400" />
                <h3 className="text-white font-semibold text-lg">Programming & DB</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Python", "SQL", "Pandas", "Matplotlib"].map(tech => (
                  <span key={tech} className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm font-medium text-slate-300 group-hover:border-indigo-500/40 transition-colors">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Experience */}
        <motion.section 
          id="experience" 
          className="scroll-mt-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-4 mb-12">
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 glow-indigo">
              <Briefcase className="w-6 h-6 text-indigo-400" />
            </div>
            <h2 className="text-3xl font-bold text-white font-display">Professional Experience</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-slate-800 to-transparent ml-4" />
          </div>

          <div className="space-y-8">
            {experience.map((exp, idx) => (
              <div key={idx} className="relative pl-8 md:pl-0">
                {/* Timeline Line for Mobile */}
                <div className="md:hidden absolute left-[11px] top-2 bottom-0 w-px bg-slate-800" />
                
                <motion.div 
                  whileHover={{ x: 10 }}
                  className="glass-card p-8 rounded-3xl hover:border-indigo-500/40 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">{exp.role}</h3>
                      <p className="text-indigo-400 font-medium">{exp.company} <span className="text-slate-500 mx-2">•</span> {exp.location}</p>
                    </div>
                    <span className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-slate-950 border border-slate-800 text-sm font-mono text-slate-400 self-start md:self-center">
                      {exp.period}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {exp.highlights.map((h, i) => {
                      const [title, desc] = h.split(': ');
                      return (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-start gap-3 p-4 rounded-2xl bg-slate-950/50 border border-slate-800/50 hover:bg-slate-950 transition-colors"
                        >
                          <ChevronRight className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-white font-semibold text-sm mb-1">{title}</h4>
                            <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Proficiency Dashboard */}
        <motion.section 
          id="skills" 
          className="scroll-mt-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-4 mb-12">
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 glow-indigo">
              <Settings className="w-6 h-6 text-indigo-400" />
            </div>
            <h2 className="text-3xl font-bold text-white font-display">Technical Proficiency</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-slate-800 to-transparent ml-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-3xl glass-card hover:glow-indigo transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <skill.icon className="w-6 h-6 text-slate-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{skill.name}</h3>
                    <p className="text-slate-400 text-sm">{skill.desc}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono text-slate-500">
                    <span>PROFICIENCY</span>
                    <span className="text-white font-medium">{skill.level}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/50">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      viewport={{ once: true }}
                      className={`h-full bg-gradient-to-r ${skill.color}`}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Pinned Projects */}
        <motion.section 
          id="projects" 
          className="scroll-mt-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-4 mb-12">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 glow-indigo">
              <FolderGit2 className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-3xl font-bold text-white font-display">Pinned Projects</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-slate-800 to-transparent ml-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((project, idx) => (
              <motion.a 
                key={idx} 
                href={project.url} 
                target="_blank" 
                rel="noreferrer"
                whileHover={{ y: -10, scale: 1.02 }}
                className="group flex flex-col justify-between p-6 glass-card rounded-3xl hover:border-emerald-500/50 hover:bg-slate-800/50 transition-all h-full"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 group-hover:border-emerald-500/30 transition-colors">
                      <FolderGit2 className="w-6 h-6 text-emerald-400" />
                    </div>
                    <Github className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">{project.name}</h3>
                </div>
                <p className="text-sm text-slate-500 font-medium mt-6 flex items-center gap-2 group-hover:text-slate-300 transition-colors">
                  View Repository <ChevronRight className="w-4 h-4" />
                </p>
              </motion.a>
            ))}
          </div>
        </motion.section>

        {/* Certificates Slider */}
        <motion.section 
          id="certificates" 
          className="scroll-mt-20"
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-4 mb-12">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 glow-indigo">
              <Award className="w-6 h-6 text-amber-400" />
            </div>
            <h2 className="text-3xl font-bold text-white font-display">Certificates & Achievements</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-slate-800 to-transparent ml-4" />
          </div>

          <div className="relative group max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-[2.5rem] bg-slate-900/40 border border-slate-800 backdrop-blur-sm relative shadow-2xl min-h-[350px] flex items-center justify-center">
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
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-6">
                      Verified Achievement
                    </div>
                    <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight font-display">
                      {certificates[currentCertIndex].name}
                    </h3>
                    <p className="text-slate-400 mb-10 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
                      Professional certification demonstrating expertise and commitment to industry excellence in data analytics and manufacturing intelligence.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                      <motion.a 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href={certificates[currentCertIndex].url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 group/btn text-base"
                      >
                        Verify Online <ExternalLink className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                      </motion.a>
                      <motion.a 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href={certificates[currentCertIndex].pdf} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-all border border-slate-700 group/btn text-base"
                      >
                        View PDF <FileText className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Controls */}
            <button 
              onClick={prevCert}
              className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white hover:border-amber-500/50 hover:bg-slate-800 transition-all shadow-xl z-20"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={nextCert}
              className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white hover:border-amber-500/50 hover:bg-slate-800 transition-all shadow-xl z-20"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-3 mt-10">
              {certificates.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentCertIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${i === currentCertIndex ? 'w-12 bg-amber-500' : 'w-2 bg-slate-800 hover:bg-slate-700'}`}
                />
              ))}
            </div>
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section 
          id="contact" 
          className="scroll-mt-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-4 mb-12">
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 glow-indigo">
              <Mail className="w-6 h-6 text-indigo-400" />
            </div>
            <h2 className="text-3xl font-bold text-white font-display">Get In Touch</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-slate-800 to-transparent ml-4" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <h3 className="text-4xl font-bold text-white leading-tight font-display">
                Let's build something <span className="text-gradient">data-driven</span> together.
              </h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                Whether you have a question about manufacturing intelligence, need help with a Power BI dashboard, or just want to say hi, my inbox is always open.
              </p>
              
              <div className="space-y-4">
                <motion.a 
                  whileHover={{ x: 10 }}
                  href="mailto:nabeelahmad193221@gmail.com" 
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/30 transition-all group"
                >
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 group-hover:bg-cyan-500/10 transition-colors">
                    <Mail className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-slate-500 uppercase">Email Me</p>
                    <p className="text-white font-medium">nabeelahmad193221@gmail.com</p>
                  </div>
                </motion.a>
                <motion.a 
                  whileHover={{ x: 10 }}
                  href="https://wa.me/923246278872" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-emerald-500/30 transition-all group"
                >
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 group-hover:bg-emerald-500/10 transition-colors">
                    <Zap className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-slate-500 uppercase">WhatsApp</p>
                    <p className="text-white font-medium">+92 324 6278872</p>
                  </div>
                </motion.a>
              </div>
            </div>

            <motion.form 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4 glass-card p-8 rounded-3xl relative overflow-hidden" 
              onSubmit={handleFormSubmit}
            >
              <AnimatePresence>
                {isSubmitted && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute inset-0 z-20 bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-6"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4 border border-emerald-500/30">
                      <Zap className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-2">Message Sent!</h4>
                    <p className="text-slate-400 text-sm">Thank you for reaching out. I'll get back to you as soon as possible.</p>
                    <button 
                      type="button"
                      onClick={() => setIsSubmitted(false)}
                      className="mt-6 text-cyan-400 text-xs font-mono uppercase tracking-widest hover:text-cyan-300 transition-colors"
                    >
                      Send another message
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-500 uppercase ml-1">Name</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formState.name}
                    onChange={handleFormChange}
                    placeholder="John Doe" 
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all text-white" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-500 uppercase ml-1">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formState.email}
                    onChange={handleFormChange}
                    placeholder="john@example.com" 
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all text-white" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-500 uppercase ml-1">Subject</label>
                <input 
                  type="text" 
                  name="subject"
                  value={formState.subject}
                  onChange={handleFormChange}
                  placeholder="Project Inquiry" 
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all text-white" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-500 uppercase ml-1">Message</label>
                <textarea 
                  rows={4} 
                  name="message"
                  required
                  value={formState.message}
                  onChange={handleFormChange}
                  placeholder="How can I help you?" 
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all text-white resize-none"
                ></textarea>
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </motion.button>
            </motion.form>
          </div>
        </motion.section>

        {/* Closing Quote */}
        <section className="text-center py-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex flex-col items-center"
          >
            <p className="text-2xl md:text-4xl font-light text-slate-400 mb-8 max-w-3xl leading-tight">
              "Turning complex data into <span className="text-white font-medium">simple, actionable stories</span>."
            </p>
            <div className="h-1 w-12 bg-gradient-to-r from-indigo-400 to-violet-500 rounded-full" />
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-slate-800/50 bg-slate-950 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-400" />
            <span className="text-white font-bold tracking-widest uppercase text-sm">Nabeel Ahmad</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-slate-500">
            <a href="https://github.com/nabeelahmad193221" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/nabeel-ahmad-a92a48399" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              LinkedIn
            </a>
            <a href="https://wa.me/923246278872" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              WhatsApp
            </a>
            <a href="https://www.instagram.com/nabeelahmad2412?igsh=MWk1ZHJqd2E0eWRoYQ==" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              Instagram
            </a>
            <a href="mailto:nabeelahmad193221@gmail.com" className="hover:text-white transition-colors">
              Email
            </a>
          </div>
        </div>
      </footer>

      {/* AI Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
        <AnimatePresence>
          {/* Scroll to Top Button */}
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 20 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center hover:bg-slate-800 hover:text-white transition-all shadow-xl"
            >
              <ChevronLeft className="w-6 h-6 rotate-90" />
            </motion.button>
          )}

          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="absolute bottom-20 right-0 w-[350px] md:w-[400px] h-[500px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col backdrop-blur-xl"
            >
              {/* Chat Header */}
              <div className="p-4 bg-slate-800/50 border-b border-slate-700 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                    <Bot className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">Nabeel's AI</h4>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Online</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="p-2 hover:bg-slate-700 rounded-xl transition-colors text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-slate-950/50">
                {chatMessages.map((msg, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-tr-none shadow-lg shadow-indigo-900/20' 
                        : 'bg-slate-800/80 text-slate-200 rounded-tl-none border border-slate-700/50 backdrop-blur-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-slate-800/80 text-slate-200 p-4 rounded-2xl rounded-tl-none border border-slate-700/50 flex gap-1.5 items-center">
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </motion.div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-slate-800/30 border-t border-slate-700">
                <div className="relative">
                  <input 
                    type="text" 
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask me anything..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-2xl py-3 pl-4 pr-12 text-sm text-white focus:border-indigo-500/50 outline-none transition-all"
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={!userInput.trim() || isTyping}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-500 text-slate-950 rounded-xl hover:bg-indigo-400 disabled:opacity-50 disabled:hover:bg-indigo-500 transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 text-white shadow-2xl shadow-indigo-500/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group relative"
        >
          {isChatOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
          {!isChatOpen && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-950 rounded-full" />
          )}
        </button>
      </div>
    </div>
  );
}
