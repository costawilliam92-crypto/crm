import "./index.css";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, Users, FolderKanban, CheckSquare, CreditCard,
  BarChart3, Settings, Plus, Bell, Search, AlertCircle, Edit,
  Trash2, Eye, Download, Send, X, Check, Menu, Star, DollarSign,
  Activity, FileText, UserPlus, Mail, Phone, Clock, Zap,
  CheckCircle2, XCircle, Info, AlertTriangle, Wifi, WifiOff,
  ExternalLink, RefreshCw, Globe, MessageSquare
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from "recharts";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const revenueData = [
  { month: "Jan", revenue: 12400 }, { month: "Feb", revenue: 15800 },
  { month: "Mar", revenue: 11200 }, { month: "Apr", revenue: 18900 },
  { month: "May", revenue: 22100 }, { month: "Jun", revenue: 19500 },
  { month: "Jul", revenue: 25300 }, { month: "Aug", revenue: 21700 },
  { month: "Sep", revenue: 28400 }, { month: "Oct", revenue: 24600 },
  { month: "Nov", revenue: 31200 }, { month: "Dec", revenue: 29800 },
];
const pieData = [
  { name: "Active", value: 14, color: "#f59e0b" },
  { name: "Pending", value: 6, color: "#64748b" },
  { name: "Completed", value: 23, color: "#10b981" },
  { name: "On Hold", value: 3, color: "#ef4444" },
];
const initClients = [
  { id: 1, name: "Marcus Rivera", company: "Rivera Construction", email: "m.rivera@rivcon.com", phone: "+1 (555) 234-5678", status: "active", type: "Premium", tag: "VIP", value: 48000 },
  { id: 2, name: "Sarah Chen", company: "Chen Landscaping", email: "sarah@chenscape.com", phone: "+1 (555) 345-6789", status: "active", type: "Standard", tag: "Normal", value: 12000 },
  { id: 3, name: "Tom Whitfield", company: "Whitfield Plumbing", email: "tom@whitplumb.com", phone: "+1 (555) 456-7890", status: "inactive", type: "Basic", tag: "Normal", value: 6500 },
  { id: 4, name: "Lisa Nakamura", company: "Nakamura Auto", email: "lisa@nakauto.com", phone: "+1 (555) 567-8901", status: "active", type: "Premium", tag: "VIP", value: 35000 },
  { id: 5, name: "James Okonkwo", company: "Okonkwo Fencing", email: "j.okonkwo@okfence.com", phone: "+1 (555) 678-9012", status: "active", type: "Standard", tag: "Normal", value: 18000 },
];
const initProjects = [
  { id: 1, clientId: 1, name: "Commercial Site Earthworks", description: "3-phase excavation for commercial complex", start: "2025-02-01", end: "2025-06-30", status: "active", value: 28000, progress: 65 },
  { id: 2, clientId: 2, name: "Garden Renovation Phase 1", description: "Full landscape redesign for residential estate", start: "2025-03-15", end: "2025-05-15", status: "completed", value: 8500, progress: 100 },
  { id: 3, clientId: 4, name: "Dealership Website Redesign", description: "Full-stack web app for car dealer", start: "2025-04-01", end: "2025-07-01", status: "active", value: 15000, progress: 40 },
  { id: 4, clientId: 5, name: "Residential Fence Install", description: "200m perimeter fencing, timber and steel", start: "2025-05-01", end: "2025-05-20", status: "pending", value: 9200, progress: 0 },
  { id: 5, clientId: 1, name: "Site Drainage System", description: "Underground drainage network", start: "2025-06-01", end: "2025-08-01", status: "pending", value: 20000, progress: 0 },
];
const initTasks = [
  { id: 1, projectId: 1, name: "Site survey and assessment", responsible: "John D.", due: "2025-04-10", status: "completed" },
  { id: 2, projectId: 1, name: "Excavation phase 1", responsible: "Mike R.", due: "2025-04-25", status: "in-progress" },
  { id: 3, projectId: 3, name: "UI wireframes", responsible: "Amy L.", due: "2025-04-18", status: "completed" },
  { id: 4, projectId: 3, name: "Backend API setup", responsible: "Tom K.", due: "2025-05-10", status: "in-progress" },
  { id: 5, projectId: 2, name: "Plant procurement", responsible: "Sarah C.", due: "2025-03-20", status: "completed" },
  { id: 6, projectId: 4, name: "Materials order", responsible: "James O.", due: "2025-05-05", status: "pending" },
  { id: 7, projectId: 1, name: "Safety compliance check", responsible: "John D.", due: "2025-04-30", status: "pending" },
];
const initPayments = [
  { id: 1, clientId: 1, project: "Commercial Site Earthworks", amount: 14000, issued: "2025-03-01", due: "2025-04-01", status: "paid" },
  { id: 2, clientId: 2, project: "Garden Renovation Phase 1", amount: 8500, issued: "2025-03-15", due: "2025-04-15", status: "paid" },
  { id: 3, clientId: 4, project: "Dealership Website Redesign", amount: 7500, issued: "2025-04-01", due: "2025-05-01", status: "pending" },
  { id: 4, clientId: 5, project: "Residential Fence Install", amount: 4600, issued: "2025-04-10", due: "2025-04-25", status: "overdue" },
  { id: 5, clientId: 1, project: "Commercial Site Earthworks", amount: 14000, issued: "2025-04-01", due: "2025-05-01", status: "pending" },
];
const initUsers = [
  { id: 1, name: "William Santos", email: "william@oelo.com.au", role: "Admin", status: "active" },
  { id: 2, name: "Amy Lee", email: "amy@oelo.com.au", role: "Staff", status: "active" },
  { id: 3, name: "Jake Morris", email: "jake@oelo.com.au", role: "Viewer", status: "inactive" },
];

// ─── N8N WEBHOOK ──────────────────────────────────────────────────────────────
async function sendToN8n(webhookUrl, eventType, data) {
  if (!webhookUrl || !webhookUrl.startsWith("http")) return { ok: false, error: "No webhook URL configured" };
  try {
    const payload = {
      source: "crm_app",
      type: eventType,
      eventType,
      timestamp: new Date().toISOString(),
      ...data,
    };
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-FlowCRM-Source": "crm_app" },
      body: JSON.stringify(payload),
    });
    return { ok: res.ok, status: res.status };
  } catch (err) {
    console.error("n8n webhook error:", err);
    return { ok: false, error: err.message };
  }
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
let _addToast = null;
function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    _addToast = (msg, type = "success") => {
      const id = Date.now() + Math.random();
      setToasts(p => [...p, { id, msg, type }]);
      setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
    };
    return () => { _addToast = null; };
  }, []);
  const icons = { success: CheckCircle2, error: XCircle, info: Info, warning: AlertTriangle };
  const styles = {
    success: "border-emerald-500/40 bg-[#0a1a12] text-emerald-300",
    error: "border-red-500/40 bg-[#1a0a0a] text-red-300",
    info: "border-blue-500/40 bg-[#0a0f1a] text-blue-300",
    warning: "border-amber-500/40 bg-[#1a130a] text-amber-300",
  };
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2">
      {toasts.map(t => {
        const Icon = icons[t.type];
        return (
          <div key={t.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl text-sm font-medium min-w-60 max-w-sm ${styles[t.type]}`}
            style={{ animation: "slideIn 0.25s ease-out" }}>
            <Icon size={15} className="flex-shrink-0" />{t.msg}
          </div>
        );
      })}
    </div>
  );
}
const toast = (msg, type) => _addToast?.(msg, type);

// ─── UI ATOMS ─────────────────────────────────────────────────────────────────
const fmt = (n) => "$" + Number(n || 0).toLocaleString();

const StatusBadge = ({ status }) => {
  const map = {
    active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    inactive: "bg-slate-500/15 text-slate-400 border-slate-500/30",
    completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    "in-progress": "bg-blue-500/15 text-blue-400 border-blue-500/30",
    paid: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    overdue: "bg-red-500/15 text-red-400 border-red-500/30",
    "on-hold": "bg-red-500/15 text-red-400 border-red-500/30",
    connected: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    disconnected: "bg-red-500/15 text-red-400 border-red-500/30",
  };
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border capitalize ${map[status] || map.pending}`}>{status.replace("-", " ")}</span>;
};

const Modal = ({ title, onClose, children, wide }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm py-6" onClick={onClose}>
    <div className={`bg-[#0e1520] border border-white/10 rounded-2xl w-full ${wide ? "max-w-2xl" : "max-w-md"} mx-4 shadow-2xl max-h-[90vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between p-5 border-b border-white/8 sticky top-0 bg-[#0e1520]">
        <h3 className="text-white font-bold">{title}</h3>
        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><X size={18} /></button>
      </div>
      <div className="p-5">{children}</div>
    </div>
  </div>
);

const ConfirmModal = ({ msg, onConfirm, onClose }) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
    <div className="bg-[#0e1520] border border-white/10 rounded-2xl p-6 w-80 shadow-2xl" onClick={e => e.stopPropagation()}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 bg-red-500/15 rounded-xl flex items-center justify-center"><AlertTriangle size={16} className="text-red-400" /></div>
        <div className="text-white font-bold">Confirm Delete</div>
      </div>
      <p className="text-slate-400 text-sm mb-5">{msg}</p>
      <div className="flex gap-2">
        <button onClick={onConfirm} className="flex-1 bg-red-500 hover:bg-red-400 text-white font-bold px-4 py-2 rounded-lg text-sm transition-all">Delete</button>
        <button onClick={onClose} className="flex-1 bg-white/5 hover:bg-white/10 text-slate-300 px-4 py-2 rounded-lg text-sm border border-white/10 transition-all">Cancel</button>
      </div>
    </div>
  </div>
);

const Inp = ({ label, ...p }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">{label}</label>}
    <input className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-all" {...p} />
  </div>
);

const Sel = ({ label, children, ...p }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">{label}</label>}
    <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500/50 transition-all" {...p}>{children}</select>
  </div>
);

const Btn = ({ v = "primary", className = "", children, ...p }) => {
  const s = {
    primary: "bg-amber-500 hover:bg-amber-400 text-black font-bold",
    ghost: "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10",
    danger: "bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/20",
    success: "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/20",
    blue: "bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/20",
    violet: "bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 border border-violet-500/20",
  };
  return <button className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${s[v]} ${className}`} {...p}>{children}</button>;
};

const Toggle = ({ on, onChange }) => (
  <button onClick={() => onChange(!on)} className={`w-10 h-5 rounded-full relative transition-all flex-shrink-0 ${on ? "bg-amber-500" : "bg-white/15"}`}>
    <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all shadow ${on ? "right-0.5" : "left-0.5"}`} />
  </button>
);

const SBar = ({ value, onChange, placeholder = "Search..." }) => (
  <div className="relative flex-1 min-w-44">
    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500/50" />
  </div>
);

function fakeDownload(name, type = "pdf") {
  const c = type === "csv" ? "ID,Client,Amount,Status\n1,Rivera,14000,paid" : "%PDF-1.4\n%%EOF";
  const b = new Blob([c], { type: type === "pdf" ? "application/pdf" : "text/csv" });
  const u = URL.createObjectURL(b); const a = document.createElement("a"); a.href = u; a.download = name; a.click();
  URL.revokeObjectURL(u);
}

// ─── N8N STATUS INDICATOR ─────────────────────────────────────────────────────
function N8nStatus({ webhookUrl }) {
  const connected = webhookUrl && webhookUrl.startsWith("http");
  return (
    <div className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-lg ${connected ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-500/10 text-slate-500"}`}>
      {connected ? <Wifi size={11} /> : <WifiOff size={11} />}
      n8n {connected ? "connected" : "not set"}
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ clients, projects, tasks, payments, nav, sendN8n }) {
  const [quoteModal, setQuoteModal] = useState(false);
  const [qForm, setQForm] = useState({ name: "", email: "", phone: "", company: "", service: "", message: "" });
  const [sending, setSending] = useState(false);

  const revenue = payments.filter(p => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const overdue = payments.filter(p => p.status === "overdue").length;
  const kpis = [
    { label: "Active Clients", val: clients.filter(c => c.status === "active").length, icon: Users, c: "text-blue-400", bg: "bg-blue-500/10", page: "clients" },
    { label: "Active Projects", val: projects.filter(p => p.status === "active").length, icon: FolderKanban, c: "text-amber-400", bg: "bg-amber-500/10", page: "projects" },
    { label: "Revenue Collected", val: fmt(revenue), icon: DollarSign, c: "text-emerald-400", bg: "bg-emerald-500/10", page: "payments" },
    { label: "Pending Tasks", val: tasks.filter(t => t.status !== "completed").length, icon: CheckSquare, c: "text-purple-400", bg: "bg-purple-500/10", page: "tasks" },
    { label: "Overdue Invoices", val: overdue, icon: AlertCircle, c: "text-red-400", bg: "bg-red-500/10", page: "payments" },
  ];
  const quickActions = [
    { label: "Add Client", icon: UserPlus, page: "clients", col: "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20 text-blue-400" },
    { label: "New Project", icon: FolderKanban, page: "projects", col: "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20 text-amber-400" },
    { label: "Add Task", icon: CheckSquare, page: "tasks", col: "bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/20 text-purple-400" },
    { label: "New Invoice", icon: CreditCard, page: "payments", col: "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20 text-emerald-400" },
    { label: "Reports", icon: BarChart3, page: "reports", col: "bg-slate-500/10 hover:bg-slate-500/20 border-slate-500/20 text-slate-300" },
  ];
  const activity = [
    { icon: CreditCard, c: "text-emerald-400", bg: "bg-emerald-500/10", text: "Payment $14,000 received — Rivera Construction", time: "2h ago" },
    { icon: FolderKanban, c: "text-amber-400", bg: "bg-amber-500/10", text: "New project: Dealership Website Redesign", time: "5h ago" },
    { icon: AlertCircle, c: "text-red-400", bg: "bg-red-500/10", text: "Invoice #004 overdue — Okonkwo Fencing ($4,600)", time: "1d ago" },
    { icon: Users, c: "text-blue-400", bg: "bg-blue-500/10", text: "New client added: Lisa Nakamura — Nakamura Auto", time: "2d ago" },
    { icon: CheckSquare, c: "text-purple-400", bg: "bg-purple-500/10", text: "Task completed: UI wireframes — Amy L.", time: "3d ago" },
  ];

  const submitQuote = async () => {
    if (!qForm.name || !qForm.email) { toast("Name and email required", "error"); return; }
    setSending(true);
    const res = await sendN8n("new_quote_request", {
      ...qForm,
      subject: `New Quote Request – ${qForm.service || "Service Inquiry"}`,
      message: qForm.message,
      source: "crm_quote_form",
    });
    setSending(false);
    if (res.ok) {
      toast("Quote request sent to n8n! Auto-reply will fire.", "success");
      setQuoteModal(false);
      setQForm({ name: "", email: "", phone: "", company: "", service: "", message: "" });
    } else {
      toast(res.error || "Webhook failed – check n8n URL in Settings", "error");
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {kpis.map(k => (
          <button key={k.label} onClick={() => nav(k.page)} className="bg-white/4 border border-white/8 rounded-xl p-4 hover:bg-white/7 hover:border-white/15 transition-all text-left group">
            <div className={`w-9 h-9 rounded-lg ${k.bg} flex items-center justify-center mb-3`}><k.icon size={17} className={k.c} /></div>
            <div className="text-xl font-black text-white">{k.val}</div>
            <div className="text-xs text-slate-500 mt-0.5 group-hover:text-slate-400 transition-colors">{k.label}</div>
          </button>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="bg-white/3 border border-white/6 rounded-xl p-4 flex-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Quick Actions</div>
          <div className="flex flex-wrap gap-2">
            {quickActions.map(a => (
              <button key={a.label} onClick={() => nav(a.page)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${a.col}`}>
                <a.icon size={13} />{a.label}
              </button>
            ))}
            <button onClick={() => setQuoteModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all bg-violet-500/10 hover:bg-violet-500/20 border-violet-500/20 text-violet-400">
              <MessageSquare size={13} />Simulate Quote Request
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white/4 border border-white/8 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-bold text-white">Revenue by Month</div>
            <button onClick={() => { fakeDownload("revenue.csv", "csv"); toast("CSV downloaded", "success"); }} className="text-xs text-slate-500 hover:text-amber-400 flex items-center gap-1 transition-colors"><Download size={11} />Export CSV</button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0f" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}k`} />
              <Tooltip contentStyle={{ background: "#0e1520", border: "1px solid #ffffff15", borderRadius: 8, color: "#fff", fontSize: 12 }} formatter={v => [fmt(v), "Revenue"]} />
              <Bar dataKey="revenue" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white/4 border border-white/8 rounded-xl p-5">
          <div className="text-sm font-bold text-white mb-3">Projects by Status</div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={68} dataKey="value" paddingAngle={3}>
                {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#0e1520", border: "1px solid #ffffff15", borderRadius: 8, color: "#fff", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1.5 mt-2">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center gap-2 text-xs text-slate-400">
                <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                {d.name}: <span className="text-white font-bold">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white/4 border border-white/8 rounded-xl p-5">
        <div className="text-sm font-bold text-white mb-3">Recent Activity</div>
        {activity.map((a, i) => (
          <div key={i} className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0">
            <div className={`w-8 h-8 rounded-lg ${a.bg} flex items-center justify-center flex-shrink-0`}><a.icon size={13} className={a.c} /></div>
            <div className="flex-1 text-sm text-slate-300">{a.text}</div>
            <div className="text-xs text-slate-600 flex-shrink-0">{a.time}</div>
          </div>
        ))}
      </div>

      {quoteModal && (
        <Modal title="📝 Simulate Quote Request (tests n8n)" onClose={() => setQuoteModal(false)}>
          <div className="space-y-3">
            <div className="p-3 bg-violet-500/10 border border-violet-500/20 rounded-xl text-xs text-violet-300">
              This simulates what your website contact form sends to n8n. Auto-reply + Gemini classification will fire.
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Inp label="Client Name *" value={qForm.name} onChange={e => setQForm(p => ({ ...p, name: e.target.value }))} placeholder="John Smith" />
              <Inp label="Email *" value={qForm.email} onChange={e => setQForm(p => ({ ...p, email: e.target.value }))} placeholder="john@email.com" type="email" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Inp label="Phone" value={qForm.phone} onChange={e => setQForm(p => ({ ...p, phone: e.target.value }))} placeholder="+61 4 0000 0000" />
              <Inp label="Company" value={qForm.company} onChange={e => setQForm(p => ({ ...p, company: e.target.value }))} placeholder="Smith Co." />
            </div>
            <Inp label="Service Requested" value={qForm.service} onChange={e => setQForm(p => ({ ...p, service: e.target.value }))} placeholder="e.g. Earthworks, Landscaping, Fencing..." />
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">Message</label>
              <textarea rows={3} value={qForm.message} onChange={e => setQForm(p => ({ ...p, message: e.target.value }))} placeholder="Tell us about your project..."
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-all resize-none" />
            </div>
            <div className="flex gap-2 pt-1">
              <Btn onClick={submitQuote} disabled={sending}>{sending ? <RefreshCw size={13} className="animate-spin" /> : <Send size={13} />}{sending ? "Sending..." : "Send to n8n"}</Btn>
              <Btn v="ghost" onClick={() => setQuoteModal(false)}>Cancel</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── CLIENTS ──────────────────────────────────────────────────────────────────
function Clients({ clients, setClients, projects, payments, sendN8n }) {
  const [q, setQ] = useState(""); const [fs, setFs] = useState("all");
  const [modal, setModal] = useState(null); const [form, setForm] = useState({});
  const [view, setView] = useState(null); const [confirm, setConfirm] = useState(null);

  const fil = clients.filter(c => (c.name + c.company + c.email).toLowerCase().includes(q.toLowerCase()) && (fs === "all" || c.status === fs));

  const openAdd = () => { setForm({ name: "", company: "", email: "", phone: "", status: "active", type: "Standard", tag: "Normal" }); setModal("add"); };
  const openEdit = c => { setForm({ ...c }); setModal("edit"); };
  const openView = c => { setView(c); setModal("view"); };

  const save = async () => {
    if (!form.name || !form.email) { toast("Name and email required", "error"); return; }
    if (modal === "add") {
      const newClient = { ...form, id: Date.now(), value: 0 };
      setClients(p => [...p, newClient]);
      toast("Client added", "success");
      const res = await sendN8n("new_client", { name: form.name, email: form.email, phone: form.phone, company: form.company, subject: `New Client Added: ${form.name}`, message: `New ${form.type} client added: ${form.name} from ${form.company}. Email: ${form.email}, Phone: ${form.phone}` });
      if (res.ok) toast("n8n notified → welcome email queued", "info");
    } else {
      setClients(p => p.map(c => c.id === form.id ? form : c));
      toast("Client updated", "success");
    }
    setModal(null);
  };

  const del = id => setConfirm({ msg: "Delete this client permanently?", onConfirm: () => { setClients(p => p.filter(c => c.id !== id)); toast("Client deleted", "warning"); setConfirm(null); } });
  const sendEmail = async c => {
    const res = await sendN8n("follow_up", { name: c.name, email: c.email, company: c.company, subject: `Follow Up – ${c.name}`, message: `Manual follow up triggered for client ${c.name} (${c.company}).` });
    toast(res.ok ? `Follow-up triggered for ${c.name} via n8n` : "n8n not connected – check Settings", res.ok ? "info" : "warning");
  };

  const vProj = view ? projects.filter(p => p.clientId === view.id) : [];
  const vPay = view ? payments.filter(p => p.clientId === view.id) : [];
  const vRev = vPay.filter(p => p.status === "paid").reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-4">
      {confirm && <ConfirmModal {...confirm} onClose={() => setConfirm(null)} />}
      <div className="flex gap-3 flex-wrap">
        <SBar value={q} onChange={setQ} placeholder="Search clients..." />
        <select value={fs} onChange={e => setFs(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none">
          <option value="all">All Status</option><option value="active">Active</option><option value="inactive">Inactive</option>
        </select>
        <Btn onClick={openAdd}><Plus size={13} />Add Client</Btn>
      </div>
      <div className="bg-white/4 border border-white/8 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-white/8">
            {["Client", "Company", "Contact", "Tag", "Value", "Status", ""].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>)}
          </tr></thead>
          <tbody>
            {fil.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-600 text-sm">No clients found</td></tr>}
            {fil.map(c => (
              <tr key={c.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm flex-shrink-0">{c.name[0]}</div>
                    <div><div className="text-white text-sm font-medium">{c.name}</div><div className="text-slate-500 text-xs">{c.type}</div></div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-300 text-sm">{c.company}</td>
                <td className="px-4 py-3"><div className="text-xs text-slate-400">{c.email}</div><div className="text-xs text-slate-600">{c.phone}</div></td>
                <td className="px-4 py-3">{c.tag === "VIP" ? <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">⭐ VIP</span> : <span className="text-xs text-slate-600">Normal</span>}</td>
                <td className="px-4 py-3 text-emerald-400 text-sm font-bold">{fmt(c.value)}</td>
                <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => openView(c)} title="View" className="p-1.5 rounded-lg hover:bg-blue-500/15 text-slate-500 hover:text-blue-400 transition-all"><Eye size={13} /></button>
                    <button onClick={() => openEdit(c)} title="Edit" className="p-1.5 rounded-lg hover:bg-white/8 text-slate-500 hover:text-white transition-all"><Edit size={13} /></button>
                    <button onClick={() => sendEmail(c)} title="Send Follow-up via n8n" className="p-1.5 rounded-lg hover:bg-emerald-500/15 text-slate-500 hover:text-emerald-400 transition-all"><Mail size={13} /></button>
                    <button onClick={() => del(c.id)} title="Delete" className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-all"><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-2 border-t border-white/5 text-xs text-slate-600">{fil.length} client{fil.length !== 1 ? "s" : ""}</div>
      </div>

      {(modal === "add" || modal === "edit") && (
        <Modal title={modal === "add" ? "Add Client" : "Edit Client"} onClose={() => setModal(null)}>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Inp label="Full Name *" value={form.name || ""} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="John Smith" />
              <Inp label="Company" value={form.company || ""} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} placeholder="Smith Co." />
            </div>
            <Inp label="Email *" value={form.email || ""} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="email@company.com" type="email" />
            <Inp label="Phone" value={form.phone || ""} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+1 (555) 000-0000" />
            <div className="grid grid-cols-3 gap-3">
              <Sel label="Status" value={form.status || "active"} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}><option value="active">Active</option><option value="inactive">Inactive</option></Sel>
              <Sel label="Type" value={form.type || "Standard"} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}><option value="Basic">Basic</option><option value="Standard">Standard</option><option value="Premium">Premium</option></Sel>
              <Sel label="Tag" value={form.tag || "Normal"} onChange={e => setForm(p => ({ ...p, tag: e.target.value }))}><option value="Normal">Normal</option><option value="VIP">VIP</option></Sel>
            </div>
            {modal === "add" && <div className="text-xs text-emerald-400/80 bg-emerald-500/8 border border-emerald-500/15 rounded-lg px-3 py-2 flex items-center gap-2"><Wifi size={11} />n8n will send a welcome email automatically</div>}
            <div className="flex gap-2 pt-1"><Btn onClick={save}><Check size={13} />Save Client</Btn><Btn v="ghost" onClick={() => setModal(null)}>Cancel</Btn></div>
          </div>
        </Modal>
      )}

      {modal === "view" && view && (
        <Modal title="Client Details" onClose={() => setModal(null)} wide>
          <div className="space-y-5">
            <div className="flex items-center gap-4 p-4 bg-white/4 rounded-xl border border-white/8">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 font-black text-2xl">{view.name[0]}</div>
              <div className="flex-1">
                <div className="text-white font-black text-xl">{view.name}</div>
                <div className="text-slate-400 text-sm">{view.company} · {view.type}</div>
                <div className="flex gap-4 mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Mail size={11} />{view.email}</span>
                  <span className="flex items-center gap-1"><Phone size={11} />{view.phone}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-emerald-400 font-black text-2xl">{fmt(vRev)}</div>
                <div className="text-xs text-slate-500">collected</div>
                <div className="mt-1"><StatusBadge status={view.status} /></div>
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Projects ({vProj.length})</div>
              {vProj.length === 0 ? <div className="text-slate-600 text-sm py-2">No projects yet</div> :
                vProj.map(p => (
                  <div key={p.id} className="flex items-center gap-3 bg-white/3 border border-white/5 rounded-xl p-3 mb-2">
                    <div className="flex-1"><div className="text-white text-sm font-medium">{p.name}</div><div className="text-slate-500 text-xs">{p.start} → {p.end}</div></div>
                    <div className="text-amber-400 font-bold text-sm">{fmt(p.value)}</div>
                    <StatusBadge status={p.status} />
                  </div>
                ))
              }
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Invoices ({vPay.length})</div>
              {vPay.length === 0 ? <div className="text-slate-600 text-sm py-2">No invoices yet</div> :
                vPay.map(p => (
                  <div key={p.id} className="flex items-center gap-3 bg-white/3 border border-white/5 rounded-xl p-3 mb-2">
                    <div className="flex-1 text-sm text-white">{p.project}</div>
                    <div className="text-emerald-400 font-bold text-sm">{fmt(p.amount)}</div>
                    <StatusBadge status={p.status} />
                  </div>
                ))
              }
            </div>
            <div className="flex gap-2">
              <Btn v="ghost" onClick={() => openEdit(view)}><Edit size={13} />Edit</Btn>
              <Btn v="success" onClick={() => sendEmail(view)}><Mail size={13} />Send Follow-up via n8n</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── PROJECTS ─────────────────────────────────────────────────────────────────
function Projects({ projects, setProjects, clients, sendN8n }) {
  const [q, setQ] = useState(""); const [fs, setFs] = useState("all");
  const [modal, setModal] = useState(null); const [form, setForm] = useState({});
  const [confirm, setConfirm] = useState(null);

  const fil = projects.filter(p => (p.name + p.description).toLowerCase().includes(q.toLowerCase()) && (fs === "all" || p.status === fs));
  const cname = id => clients.find(c => c.id === id)?.name || "Unknown";
  const cemail = id => clients.find(c => c.id === id)?.email || "";

  const openAdd = () => { setForm({ name: "", description: "", clientId: clients[0]?.id || 1, start: "", end: "", status: "pending", value: "", progress: 0 }); setModal("add"); };
  const openEdit = p => { setForm({ ...p }); setModal("edit"); };

  const save = async () => {
    if (!form.name) { toast("Project name required", "error"); return; }
    const isNew = modal === "add";
    if (isNew) {
      setProjects(p => [...p, { ...form, id: Date.now(), progress: Number(form.progress) || 0, value: Number(form.value) || 0 }]);
      toast("Project created", "success");
      const res = await sendN8n("project_created", { name: cname(form.clientId), email: cemail(form.clientId), company: cname(form.clientId), projectName: form.name, subject: `New Project: ${form.name}`, message: `Project "${form.name}" created for ${cname(form.clientId)}. Value: ${fmt(form.value)}. Period: ${form.start} to ${form.end}.` });
      if (res.ok) toast("n8n notified of new project", "info");
    } else {
      const prev = projects.find(x => x.id === form.id);
      setProjects(p => p.map(x => x.id === form.id ? { ...form, value: Number(form.value), progress: Number(form.progress) } : x));
      toast("Project updated", "success");
      if (prev?.status !== form.status) {
        const res = await sendN8n("project_status_changed", { name: cname(form.clientId), email: cemail(form.clientId), projectName: form.name, status: form.status, subject: `Project Update: ${form.name}`, message: `Project "${form.name}" status changed from ${prev.status} to ${form.status}.` });
        if (res.ok) toast("n8n notified of status change", "info");
      }
    }
    setModal(null);
  };

  const del = id => setConfirm({ msg: "Delete this project permanently?", onConfirm: () => { setProjects(p => p.filter(x => x.id !== id)); toast("Project deleted", "warning"); setConfirm(null); } });

  return (
    <div className="space-y-4">
      {confirm && <ConfirmModal {...confirm} onClose={() => setConfirm(null)} />}
      <div className="flex gap-3 flex-wrap">
        <SBar value={q} onChange={setQ} placeholder="Search projects..." />
        <select value={fs} onChange={e => setFs(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none">
          <option value="all">All</option><option value="active">Active</option><option value="pending">Pending</option><option value="completed">Completed</option><option value="on-hold">On Hold</option>
        </select>
        <Btn onClick={openAdd}><Plus size={13} />New Project</Btn>
      </div>
      {fil.length === 0 && <div className="text-center text-slate-600 text-sm py-12">No projects found</div>}
      <div className="grid gap-3">
        {fil.map(p => (
          <div key={p.id} className="bg-white/4 border border-white/8 rounded-xl p-5 hover:bg-white/6 transition-all">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1"><div className="text-white font-bold">{p.name}</div><StatusBadge status={p.status} /></div>
                <div className="text-slate-400 text-sm mb-1">{p.description}</div>
                <div className="text-slate-500 text-xs flex gap-4">
                  <span className="text-amber-400">{cname(p.clientId)}</span>
                  <span className="flex items-center gap-1"><Clock size={10} />{p.start} → {p.end}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-emerald-400 font-black text-xl">{fmt(p.value)}</div>
                <div className="flex gap-1 mt-2 justify-end">
                  <button onClick={() => { fakeDownload(`${p.name.replace(/\s/g, "-")}-report.pdf`); toast(`Report downloaded`, "success"); }} title="Report" className="p-1.5 rounded-lg hover:bg-blue-500/15 text-slate-500 hover:text-blue-400 transition-all"><FileText size={13} /></button>
                  <button onClick={() => openEdit(p)} title="Edit" className="p-1.5 rounded-lg hover:bg-white/8 text-slate-500 hover:text-white transition-all"><Edit size={13} /></button>
                  <button onClick={() => del(p.id)} title="Delete" className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-all"><Trash2 size={13} /></button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="text-xs text-slate-500">Progress</div>
              <div className="text-xs font-bold text-white">{p.progress}%</div>
            </div>
            <div className="w-full bg-white/8 rounded-full h-1.5">
              <div className="h-1.5 rounded-full transition-all" style={{ width: `${p.progress}%`, background: p.progress === 100 ? "#10b981" : "#f59e0b" }} />
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <Modal title={modal === "add" ? "New Project" : "Edit Project"} onClose={() => setModal(null)}>
          <div className="space-y-3">
            <Inp label="Project Name *" value={form.name || ""} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Project name" />
            <Inp label="Description" value={form.description || ""} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief description" />
            <Sel label="Client" value={form.clientId} onChange={e => setForm(p => ({ ...p, clientId: Number(e.target.value) }))}>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name} — {c.company}</option>)}
            </Sel>
            <div className="grid grid-cols-2 gap-3">
              <Inp label="Start" type="date" value={form.start || ""} onChange={e => setForm(p => ({ ...p, start: e.target.value }))} />
              <Inp label="End" type="date" value={form.end || ""} onChange={e => setForm(p => ({ ...p, end: e.target.value }))} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Inp label="Value ($)" type="number" value={form.value || ""} onChange={e => setForm(p => ({ ...p, value: e.target.value }))} placeholder="0" />
              <Inp label="Progress %" type="number" min="0" max="100" value={form.progress || ""} onChange={e => setForm(p => ({ ...p, progress: e.target.value }))} placeholder="0" />
              <Sel label="Status" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}><option value="pending">Pending</option><option value="active">Active</option><option value="completed">Completed</option><option value="on-hold">On Hold</option></Sel>
            </div>
            <div className="flex gap-2 pt-1"><Btn onClick={save}><Check size={13} />Save</Btn><Btn v="ghost" onClick={() => setModal(null)}>Cancel</Btn></div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── TASKS ────────────────────────────────────────────────────────────────────
function Tasks({ tasks, setTasks, projects }) {
  const [q, setQ] = useState(""); const [fs, setFs] = useState("all");
  const [modal, setModal] = useState(false); const [form, setForm] = useState({});
  const [confirm, setConfirm] = useState(null);

  const fil = tasks.filter(t => (t.name + t.responsible).toLowerCase().includes(q.toLowerCase()) && (fs === "all" || t.status === fs));
  const grouped = { "in-progress": fil.filter(t => t.status === "in-progress"), pending: fil.filter(t => t.status === "pending"), completed: fil.filter(t => t.status === "completed") };
  const pname = id => projects.find(p => p.id === id)?.name || "—";

  const save = () => {
    if (!form.name) { toast("Task name required", "error"); return; }
    setTasks(p => [...p, { ...form, id: Date.now(), projectId: Number(form.projectId) }]);
    toast("Task added", "success"); setModal(false);
  };
  const toggle = id => setTasks(p => p.map(t => {
    if (t.id !== id) return t;
    const next = t.status === "completed" ? "pending" : "completed";
    toast(next === "completed" ? "Task done ✓" : "Task reopened", "info");
    return { ...t, status: next };
  }));
  const del = id => setConfirm({ msg: "Delete this task?", onConfirm: () => { setTasks(p => p.filter(t => t.id !== id)); toast("Task deleted", "warning"); setConfirm(null); } });

  const gCols = { "in-progress": "text-blue-400", pending: "text-amber-400", completed: "text-emerald-400" };
  const gLabels = { "in-progress": "In Progress", pending: "Pending", completed: "Completed" };

  return (
    <div className="space-y-4">
      {confirm && <ConfirmModal {...confirm} onClose={() => setConfirm(null)} />}
      <div className="flex gap-3 flex-wrap">
        <SBar value={q} onChange={setQ} placeholder="Search tasks..." />
        <select value={fs} onChange={e => setFs(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none">
          <option value="all">All</option><option value="in-progress">In Progress</option><option value="pending">Pending</option><option value="completed">Completed</option>
        </select>
        <Btn onClick={() => { setForm({ name: "", responsible: "", due: "", status: "pending", projectId: projects[0]?.id || 1 }); setModal(true); }}><Plus size={13} />Add Task</Btn>
      </div>
      <div className="flex gap-4 text-sm">
        {Object.entries(grouped).map(([k, v]) => <span key={k} className={`font-bold ${gCols[k]}`}>{v.length} {gLabels[k]}</span>)}
      </div>
      {["in-progress", "pending", "completed"].map(g => grouped[g].length > 0 && (
        <div key={g}>
          <div className={`text-xs font-bold uppercase tracking-widest mb-2 ${gCols[g]}`}>{gLabels[g]}</div>
          <div className="space-y-2">
            {grouped[g].map(t => (
              <div key={t.id} className={`bg-white/4 border border-white/8 rounded-xl p-4 flex items-center gap-3 hover:bg-white/6 transition-all ${t.status === "completed" ? "opacity-55" : ""}`}>
                <button onClick={() => toggle(t.id)} className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${t.status === "completed" ? "bg-emerald-500 border-emerald-500" : "border-white/20 hover:border-amber-500"}`}>
                  {t.status === "completed" && <Check size={10} className="text-white" />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium ${t.status === "completed" ? "line-through text-slate-500" : "text-white"}`}>{t.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{pname(t.projectId)} · <span className="text-slate-400">{t.responsible}</span> · Due: {t.due}</div>
                </div>
                <StatusBadge status={t.status} />
                <button onClick={() => del(t.id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-600 hover:text-red-400 transition-all"><Trash2 size={13} /></button>
              </div>
            ))}
          </div>
        </div>
      ))}
      {fil.length === 0 && <div className="text-center text-slate-600 text-sm py-12">No tasks found</div>}
      {modal && (
        <Modal title="Add Task" onClose={() => setModal(false)}>
          <div className="space-y-3">
            <Inp label="Task Name *" value={form.name || ""} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Task description" />
            <Sel label="Project" value={form.projectId} onChange={e => setForm(p => ({ ...p, projectId: e.target.value }))}>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </Sel>
            <div className="grid grid-cols-2 gap-3">
              <Inp label="Responsible" value={form.responsible || ""} onChange={e => setForm(p => ({ ...p, responsible: e.target.value }))} placeholder="Name" />
              <Inp label="Due Date" type="date" value={form.due || ""} onChange={e => setForm(p => ({ ...p, due: e.target.value }))} />
            </div>
            <Sel label="Status" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}><option value="pending">Pending</option><option value="in-progress">In Progress</option></Sel>
            <div className="flex gap-2 pt-1"><Btn onClick={save}><Check size={13} />Add Task</Btn><Btn v="ghost" onClick={() => setModal(false)}>Cancel</Btn></div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── PAYMENTS ─────────────────────────────────────────────────────────────────
function Payments({ payments, setPayments, clients, sendN8n }) {
  const [fs, setFs] = useState("all"); const [modal, setModal] = useState(false);
  const [form, setForm] = useState({}); const [confirm, setConfirm] = useState(null);

  const cname = id => clients.find(c => c.id === id)?.name || "Unknown";
  const cemail = id => clients.find(c => c.id === id)?.email || "";
  const fil = fs === "all" ? payments : payments.filter(p => p.status === fs);

  const markPaid = id => { setPayments(p => p.map(x => x.id === id ? { ...x, status: "paid" } : x)); toast("Marked as paid ✓", "success"); };
  const remind = async p => {
    const res = await sendN8n("payment_overdue", { name: cname(p.clientId), email: cemail(p.clientId), company: cname(p.clientId), amount: p.amount, projectName: p.project, subject: `Payment Reminder – ${p.project}`, message: `Invoice for "${p.project}" of ${fmt(p.amount)} is overdue since ${p.due}. Please arrange payment.` });
    toast(res.ok ? `Payment reminder sent via n8n` : "n8n not connected – check Settings", res.ok ? "info" : "warning");
  };
  const dlInvoice = p => { fakeDownload(`invoice-${p.id}.pdf`); toast("Invoice PDF downloaded", "success"); };
  const del = id => setConfirm({ msg: "Delete this payment?", onConfirm: () => { setPayments(p => p.filter(x => x.id !== id)); toast("Payment deleted", "warning"); setConfirm(null); } });

  const addPayment = async () => {
    if (!form.clientId || !form.amount || !form.project) { toast("Fill required fields", "error"); return; }
    const newP = { ...form, id: Date.now(), clientId: Number(form.clientId), amount: Number(form.amount), issued: new Date().toISOString().split("T")[0] };
    setPayments(p => [...p, newP]);
    toast("Invoice created", "success");
    const res = await sendN8n("new_invoice", { name: cname(Number(form.clientId)), email: cemail(Number(form.clientId)), amount: form.amount, projectName: form.project, subject: `New Invoice – ${form.project}`, message: `Invoice created for ${cname(Number(form.clientId))} – ${form.project} – ${fmt(form.amount)}. Due: ${form.due}.` });
    if (res.ok) toast("n8n notified of new invoice", "info");
    setModal(false);
  };

  const total = payments.reduce((s, p) => s + p.amount, 0);
  const paid = payments.filter(p => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const pending = payments.filter(p => p.status === "pending").reduce((s, p) => s + p.amount, 0);
  const overdue = payments.filter(p => p.status === "overdue").reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-4">
      {confirm && <ConfirmModal {...confirm} onClose={() => setConfirm(null)} />}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[{ l: "Total Invoiced", v: fmt(total), c: "text-white" }, { l: "Collected", v: fmt(paid), c: "text-emerald-400" }, { l: "Pending", v: fmt(pending), c: "text-amber-400" }, { l: "Overdue", v: fmt(overdue), c: "text-red-400" }].map(k => (
          <div key={k.l} className="bg-white/4 border border-white/8 rounded-xl p-4"><div className="text-xs text-slate-500 mb-1">{k.l}</div><div className={`text-2xl font-black ${k.c}`}>{k.v}</div></div>
        ))}
      </div>
      <div className="flex gap-3 flex-wrap">
        <select value={fs} onChange={e => setFs(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none">
          <option value="all">All</option><option value="paid">Paid</option><option value="pending">Pending</option><option value="overdue">Overdue</option>
        </select>
        <Btn onClick={() => { setForm({ clientId: clients[0]?.id || 1, project: "", amount: "", due: "", status: "pending" }); setModal(true); }}><Plus size={13} />New Invoice</Btn>
        <Btn v="ghost" onClick={() => { fakeDownload("payments.csv", "csv"); toast("Exported to CSV", "success"); }}><Download size={13} />Export CSV</Btn>
      </div>
      <div className="bg-white/4 border border-white/8 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-white/8">
            {["Client", "Project", "Amount", "Issued", "Due", "Status", "Actions"].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>)}
          </tr></thead>
          <tbody>
            {fil.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-600 text-sm">No payments</td></tr>}
            {fil.map(p => (
              <tr key={p.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                <td className="px-4 py-3 text-white text-sm font-medium">{cname(p.clientId)}</td>
                <td className="px-4 py-3 text-slate-400 text-sm">{p.project}</td>
                <td className="px-4 py-3 text-emerald-400 font-bold">{fmt(p.amount)}</td>
                <td className="px-4 py-3 text-slate-500 text-xs">{p.issued}</td>
                <td className="px-4 py-3 text-slate-500 text-xs">{p.due}</td>
                <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {p.status !== "paid" && <button onClick={() => markPaid(p.id)} className="text-xs bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 px-2 py-1 rounded-lg transition-all font-medium">Mark Paid</button>}
                    {p.status !== "paid" && <button onClick={() => remind(p)} title="Send Reminder via n8n" className="p-1.5 rounded-lg hover:bg-blue-500/15 text-slate-500 hover:text-blue-400 transition-all"><Send size={12} /></button>}
                    <button onClick={() => dlInvoice(p)} title="Download" className="p-1.5 rounded-lg hover:bg-white/8 text-slate-500 hover:text-white transition-all"><Download size={12} /></button>
                    <button onClick={() => del(p.id)} title="Delete" className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-all"><Trash2 size={12} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal && (
        <Modal title="New Invoice" onClose={() => setModal(false)}>
          <div className="space-y-3">
            <Sel label="Client *" value={form.clientId} onChange={e => setForm(p => ({ ...p, clientId: e.target.value }))}>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name} — {c.company}</option>)}
            </Sel>
            <Inp label="Project / Service *" value={form.project || ""} onChange={e => setForm(p => ({ ...p, project: e.target.value }))} placeholder="Description" />
            <div className="grid grid-cols-2 gap-3">
              <Inp label="Amount ($) *" type="number" value={form.amount || ""} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} placeholder="0" />
              <Inp label="Due Date" type="date" value={form.due || ""} onChange={e => setForm(p => ({ ...p, due: e.target.value }))} />
            </div>
            <Sel label="Status" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}><option value="pending">Pending</option><option value="paid">Paid</option><option value="overdue">Overdue</option></Sel>
            <div className="text-xs text-emerald-400/80 bg-emerald-500/8 border border-emerald-500/15 rounded-lg px-3 py-2 flex items-center gap-2"><Wifi size={11} />n8n will be notified of this invoice</div>
            <div className="flex gap-2 pt-1"><Btn onClick={addPayment}><Check size={13} />Create Invoice</Btn><Btn v="ghost" onClick={() => setModal(false)}>Cancel</Btn></div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── REPORTS ──────────────────────────────────────────────────────────────────
function Reports({ clients, projects, payments }) {
  const byClient = clients.map(c => ({ name: c.company.split(" ")[0], revenue: payments.filter(p => p.clientId === c.id && p.status === "paid").reduce((s, p) => s + p.amount, 0) })).filter(c => c.revenue > 0).sort((a, b) => b.revenue - a.revenue);
  const exp = (name, type) => { fakeDownload(`${name.replace(/\s+/g, "-").toLowerCase()}.${type}`, type); toast(`${name} exported as ${type.toUpperCase()}`, "success"); };
  const reps = [
    { label: "Monthly Clients Report", icon: Users, desc: "Active clients summary" },
    { label: "Annual Revenue Report", icon: DollarSign, desc: "Full year financials" },
    { label: "Project Progress Report", icon: FolderKanban, desc: "All project statuses" },
    { label: "Task Completion Report", icon: CheckSquare, desc: "Done vs pending tasks" },
  ];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white/4 border border-white/8 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-bold text-white">Revenue by Client</div>
            <button onClick={() => exp("Revenue by Client", "csv")} className="text-xs text-slate-500 hover:text-amber-400 flex items-center gap-1 transition-colors"><Download size={11} />CSV</button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={byClient} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0f" />
              <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} tickFormatter={v => `$${v / 1000}k`} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} width={60} />
              <Tooltip contentStyle={{ background: "#0e1520", border: "1px solid #ffffff15", borderRadius: 8, color: "#fff", fontSize: 12 }} formatter={v => [fmt(v), "Revenue"]} />
              <Bar dataKey="revenue" fill="#10b981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white/4 border border-white/8 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-bold text-white">Annual Revenue Trend</div>
            <button onClick={() => exp("Annual Revenue", "pdf")} className="text-xs text-slate-500 hover:text-amber-400 flex items-center gap-1 transition-colors"><Download size={11} />PDF</button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0f" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}k`} />
              <Tooltip contentStyle={{ background: "#0e1520", border: "1px solid #ffffff15", borderRadius: 8, color: "#fff", fontSize: 12 }} formatter={v => [fmt(v), "Revenue"]} />
              <Line type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} dot={{ fill: "#f59e0b", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white/4 border border-white/8 rounded-xl p-5">
        <div className="text-sm font-bold text-white mb-4">Export Reports</div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {reps.map(r => (
            <div key={r.label} className="bg-white/4 border border-white/8 rounded-xl p-4 hover:bg-white/8 transition-all">
              <r.icon size={19} className="text-amber-400 mb-3" />
              <div className="text-sm text-white font-medium mb-1">{r.label}</div>
              <div className="text-xs text-slate-500 mb-3">{r.desc}</div>
              <div className="flex gap-2">
                <button onClick={() => exp(r.label, "pdf")} className="flex-1 text-xs bg-white/8 hover:bg-amber-500/20 hover:text-amber-400 text-slate-400 px-2 py-1.5 rounded-lg transition-all font-medium">PDF</button>
                <button onClick={() => exp(r.label, "csv")} className="flex-1 text-xs bg-white/8 hover:bg-emerald-500/20 hover:text-emerald-400 text-slate-400 px-2 py-1.5 rounded-lg transition-all font-medium">CSV</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
function SettingsPage({ webhookUrl, setWebhookUrl, ownerEmail, setOwnerEmail }) {
  const [tab, setTab] = useState("integration");
  const [company, setCompany] = useState({ name: "OelO Agency", email: "hello@oelo.com.au", phone: "+61 8 0000 0000", address: "Perth, WA, Australia" });
  const [autos, setAutos] = useState({ welcome: true, overdue: true, taskAlert: false, statusNotify: true, weekly: false });
  const [users, setUsers] = useState(initUsers);
  const [uModal, setUModal] = useState(false); const [uForm, setUForm] = useState({});
  const [confirm, setConfirm] = useState(null);
  const [tpls, setTpls] = useState({
    welcome: "Hi {name}, welcome to {company}! We're excited to work with you.",
    reminder: "Hi {name}, invoice #{id} of {amount} is due on {date}. Please arrange payment.",
    overdue: "Hi {name}, invoice #{id} is now overdue. Please contact us to arrange payment.",
  });
  const [wh, setWh] = useState(webhookUrl);
  const [oe, setOe] = useState(ownerEmail);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const saveCo = () => toast("Company profile saved ✓", "success");
  const saveTpls = () => toast("Templates saved ✓", "success");
  const saveIntegration = () => { setWebhookUrl(wh); setOwnerEmail(oe); toast("Integration settings saved ✓", "success"); };

  const testWebhook = async () => {
    if (!wh || !wh.startsWith("http")) { toast("Enter a valid webhook URL first", "error"); return; }
    setTesting(true); setTestResult(null);
    const res = await sendToN8n(wh, "test_connection", {
      name: "FlowCRM Test",
      email: oe || "test@flowcrm.com",
      subject: "🔧 Test Connection from FlowCRM",
      message: "This is a test message from the FlowCRM app. If you see this in n8n, the connection is working correctly!",
      source: "crm_test",
    });
    setTesting(false);
    setTestResult(res);
    toast(res.ok ? "✓ n8n webhook responded successfully!" : `✗ Connection failed: ${res.error || "No response"}`, res.ok ? "success" : "error");
  };

  const addUser = () => {
    if (!uForm.name || !uForm.email) { toast("Name and email required", "error"); return; }
    setUsers(p => [...p, { ...uForm, id: Date.now(), status: "active" }]);
    toast("User added", "success"); setUModal(false);
  };
  const delUser = id => setConfirm({ msg: "Remove this user?", onConfirm: () => { setUsers(p => p.filter(u => u.id !== id)); toast("User removed", "warning"); setConfirm(null); } });
  const toggleUser = id => setUsers(p => p.map(u => u.id === id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u));

  const tabs = [
    { id: "integration", label: "n8n Integration", icon: Zap },
    { id: "company", label: "Company", icon: Activity },
    { id: "automation", label: "Automation", icon: Wifi },
    { id: "users", label: "Users", icon: Users },
    { id: "templates", label: "Email Templates", icon: Mail },
    { id: "subscription", label: "Subscription", icon: Star },
  ];
  const roleCol = { Admin: "text-amber-400 bg-amber-500/10 border-amber-500/20", Staff: "text-blue-400 bg-blue-500/10 border-blue-500/20", Viewer: "text-slate-400 bg-slate-500/10 border-slate-500/20" };

  return (
    <div className="space-y-4">
      {confirm && <ConfirmModal {...confirm} onClose={() => setConfirm(null)} />}
      <div className="flex gap-1 bg-white/4 border border-white/8 rounded-xl p-1 flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? "bg-amber-500/15 text-amber-400 border border-amber-500/20" : "text-slate-500 hover:text-slate-300"}`}>
            <t.icon size={13} />{t.label}
          </button>
        ))}
      </div>

      {tab === "integration" && (
        <div className="space-y-4 max-w-xl">
          <div className="bg-white/4 border border-white/8 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-500/15 rounded-xl flex items-center justify-center"><Zap size={20} className="text-violet-400" /></div>
              <div>
                <div className="text-white font-bold">n8n Webhook Integration</div>
                <div className="text-slate-500 text-xs">Connect FlowCRM to your n8n automation workflows</div>
              </div>
              {webhookUrl ? <div className="ml-auto flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20"><Wifi size={11} />Connected</div>
                : <div className="ml-auto flex items-center gap-1.5 text-xs text-slate-500 bg-white/5 px-2 py-1 rounded-full border border-white/10"><WifiOff size={11} />Not set</div>}
            </div>

            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">n8n Webhook URL *</label>
                <input value={wh} onChange={e => setWh(e.target.value)} placeholder="https://your-n8n.domain.com/webhook/flowcrm"
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-violet-500/50 transition-all font-mono text-xs" />
                <div className="text-xs text-slate-600">Import <code className="text-slate-400">flowcrm-main-workflow.json</code> in n8n, then copy the webhook URL here</div>
              </div>
              <Inp label="Owner Email (notifications go here)" value={oe} onChange={e => setOe(e.target.value)} placeholder="you@company.com" type="email" />
            </div>

            <div className="flex gap-2">
              <Btn onClick={saveIntegration}><Check size={13} />Save</Btn>
              <Btn v="violet" onClick={testWebhook} disabled={testing}>
                {testing ? <RefreshCw size={13} className="animate-spin" /> : <ExternalLink size={13} />}
                {testing ? "Testing..." : "Test Connection"}
              </Btn>
            </div>

            {testResult && (
              <div className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2 ${testResult.ok ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" : "bg-red-500/10 border-red-500/20 text-red-300"}`}>
                {testResult.ok ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                {testResult.ok ? `Webhook responded with status ${testResult.status} ✓` : `Failed: ${testResult.error || "No response"}`}
              </div>
            )}
          </div>

          <div className="bg-white/4 border border-white/8 rounded-xl p-5">
            <div className="text-sm font-bold text-white mb-3">Events sent to n8n</div>
            <div className="space-y-2">
              {[
                { event: "new_client", label: "New client added", action: "Welcome email + log to Sheets", color: "text-blue-400" },
                { event: "new_invoice", label: "New invoice created", action: "Log to Sheets + owner notification", color: "text-emerald-400" },
                { event: "payment_overdue", label: "Payment reminder sent", action: "Reminder email to client + owner alert", color: "text-red-400" },
                { event: "project_created", label: "Project created", action: "Log to Sheets + owner notification", color: "text-amber-400" },
                { event: "project_status_changed", label: "Project status changed", action: "Client notification + log", color: "text-purple-400" },
                { event: "new_quote_request", label: "Quote form submitted", action: "Auto-reply to client + Gemini classify + owner alert", color: "text-violet-400" },
                { event: "follow_up", label: "Manual follow-up triggered", action: "Follow-up email sequence starts", color: "text-slate-400" },
              ].map(e => (
                <div key={e.event} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                  <div className={`text-xs font-mono ${e.color} flex-shrink-0`}>{e.event}</div>
                  <div className="flex-1">
                    <div className="text-xs text-white font-medium">{e.label}</div>
                    <div className="text-xs text-slate-500">{e.action}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/4 border border-white/8 rounded-xl p-5">
            <div className="text-sm font-bold text-white mb-3">Setup Guide</div>
            <div className="space-y-3">
              {[
                { step: "1", text: "Import flowcrm-main-workflow.json in n8n", sub: "Settings → Workflows → Import from file" },
                { step: "2", text: "Import flowcrm-gmail-trigger.json in n8n", sub: "Second workflow that monitors Gmail" },
                { step: "3", text: "Set credentials in both workflows", sub: "Gmail OAuth2, Google Sheets, Gemini API key" },
                { step: "4", text: "Update YOUR_EMAIL in Notify Owner node", sub: "Also update Google Sheet ID" },
                { step: "5", text: "Activate both workflows in n8n", sub: "Toggle the switch in the top right" },
                { step: "6", text: "Copy the Webhook URL from the main workflow", sub: "Paste it in the field above and test" },
              ].map(s => (
                <div key={s.step} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">{s.step}</div>
                  <div>
                    <div className="text-white text-sm font-medium">{s.text}</div>
                    <div className="text-slate-500 text-xs">{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "company" && (
        <div className="bg-white/4 border border-white/8 rounded-xl p-6 max-w-lg space-y-3">
          <div className="text-sm font-bold text-white mb-1">Company Profile</div>
          <Inp label="Company Name" value={company.name} onChange={e => setCompany(p => ({ ...p, name: e.target.value }))} />
          <Inp label="Email" value={company.email} onChange={e => setCompany(p => ({ ...p, email: e.target.value }))} type="email" />
          <Inp label="Phone" value={company.phone} onChange={e => setCompany(p => ({ ...p, phone: e.target.value }))} />
          <Inp label="Address" value={company.address} onChange={e => setCompany(p => ({ ...p, address: e.target.value }))} />
          <Btn onClick={saveCo}><Check size={13} />Save Changes</Btn>
        </div>
      )}

      {tab === "automation" && (
        <div className="bg-white/4 border border-white/8 rounded-xl p-6 max-w-xl space-y-3">
          <div className="text-sm font-bold text-white mb-1">Automation Settings</div>
          {[
            { key: "welcome", label: "Welcome email to new clients", desc: "Triggers when client is added (via n8n)" },
            { key: "overdue", label: "Overdue payment reminders", desc: "Auto email 3 days after due (via n8n)" },
            { key: "taskAlert", label: "Task deadline alerts", desc: "Email 24h before due date" },
            { key: "statusNotify", label: "Project status notifications", desc: "Notify client on status change" },
            { key: "weekly", label: "Weekly summary report", desc: "Digest email every Monday" },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between p-3.5 bg-white/3 rounded-xl border border-white/6 hover:bg-white/5 transition-all">
              <div>
                <div className="text-sm text-white font-medium">{item.label}</div>
                <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
              </div>
              <Toggle on={autos[item.key]} onChange={v => { setAutos(p => ({ ...p, [item.key]: v })); toast(`${item.label} ${v ? "enabled" : "disabled"}`, v ? "success" : "warning"); }} />
            </div>
          ))}
        </div>
      )}

      {tab === "users" && (
        <div className="space-y-4">
          <div className="flex justify-end"><Btn onClick={() => { setUForm({ name: "", email: "", role: "Staff" }); setUModal(true); }}><UserPlus size={13} />Add User</Btn></div>
          <div className="bg-white/4 border border-white/8 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead><tr className="border-b border-white/8">
                {["User", "Email", "Role", "Status", "Access"].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>)}
              </tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-slate-500/20 flex items-center justify-center text-slate-300 text-xs font-bold">{u.name[0]}</div><span className="text-white text-sm">{u.name}</span></div></td>
                    <td className="px-4 py-3 text-slate-400 text-sm">{u.email}</td>
                    <td className="px-4 py-3"><span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${roleCol[u.role]}`}>{u.role}</span></td>
                    <td className="px-4 py-3"><StatusBadge status={u.status} /></td>
                    <td className="px-4 py-3"><div className="flex items-center gap-2"><Toggle on={u.status === "active"} onChange={() => toggleUser(u.id)} />{u.id !== 1 && <button onClick={() => delUser(u.id)} className="p-1.5 ml-1 rounded-lg hover:bg-red-500/20 text-slate-600 hover:text-red-400 transition-all"><Trash2 size={13} /></button>}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {uModal && (
            <Modal title="Add User" onClose={() => setUModal(false)}>
              <div className="space-y-3">
                <Inp label="Full Name *" value={uForm.name || ""} onChange={e => setUForm(p => ({ ...p, name: e.target.value }))} placeholder="Name" />
                <Inp label="Email *" value={uForm.email || ""} onChange={e => setUForm(p => ({ ...p, email: e.target.value }))} placeholder="email@company.com" type="email" />
                <Sel label="Role" value={uForm.role || "Staff"} onChange={e => setUForm(p => ({ ...p, role: e.target.value }))}><option value="Admin">Admin — Full access</option><option value="Staff">Staff — Edit access</option><option value="Viewer">Viewer — Read only</option></Sel>
                <div className="flex gap-2 pt-1"><Btn onClick={addUser}><Check size={13} />Add User</Btn><Btn v="ghost" onClick={() => setUModal(false)}>Cancel</Btn></div>
              </div>
            </Modal>
          )}
        </div>
      )}

      {tab === "templates" && (
        <div className="space-y-4 max-w-2xl">
          {[
            { key: "welcome", label: "Welcome Email", desc: "Sent to new clients. Variables: {name}, {company}" },
            { key: "reminder", label: "Payment Reminder", desc: "Variables: {name}, {id}, {amount}, {date}" },
            { key: "overdue", label: "Overdue Notice", desc: "For overdue invoices. Variables: {name}, {id}" },
          ].map(t => (
            <div key={t.key} className="bg-white/4 border border-white/8 rounded-xl p-5">
              <div className="text-sm font-bold text-white mb-0.5">{t.label}</div>
              <div className="text-xs text-slate-500 mb-3">{t.desc}</div>
              <textarea rows={3} value={tpls[t.key]} onChange={e => setTpls(p => ({ ...p, [t.key]: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500/50 transition-all resize-none" />
            </div>
          ))}
          <Btn onClick={saveTpls}><Check size={13} />Save Templates</Btn>
        </div>
      )}

      {tab === "subscription" && (
        <div className="space-y-4 max-w-lg">
          <div className="flex items-center gap-4 p-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
            <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center"><Star size={22} className="text-amber-400" /></div>
            <div className="flex-1"><div className="text-white font-black text-lg">Pro Plan</div><div className="text-slate-400 text-sm">Unlimited clients, projects & automations</div></div>
            <div className="text-right"><div className="text-amber-400 font-black text-2xl">$49</div><div className="text-slate-500 text-xs">/month</div></div>
          </div>
          <div className="bg-white/4 border border-white/8 rounded-xl p-5 space-y-2.5">
            <div className="text-sm font-bold text-white mb-2">Included Features</div>
            {["Unlimited clients & projects", "n8n automation integration", "Automated email sequences", "Gemini AI email classification", "PDF & CSV report exports", "User permissions & roles", "Priority support"].map(f => (
              <div key={f} className="flex items-center gap-2 text-sm text-slate-300"><CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />{f}</div>
            ))}
          </div>
          <Btn onClick={() => toast("Redirecting to billing portal...", "info")} className="w-full justify-center"><CreditCard size={13} />Manage Subscription</Btn>
        </div>
      )}
    </div>
  );
}

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
function NotifDropdown({ payments, tasks, clients, onClose }) {
  const cname = id => clients.find(c => c.id === id)?.name || "Unknown";
  const items = [
    ...payments.filter(p => p.status === "overdue").map(p => ({ type: "error", icon: AlertCircle, text: `Overdue invoice: ${cname(p.clientId)} — ${fmt(p.amount)}`, time: "Today" })),
    ...tasks.filter(t => t.status === "pending").slice(0, 3).map(t => ({ type: "warning", icon: Clock, text: `Pending: ${t.name} (Due ${t.due})`, time: "Upcoming" })),
  ];
  const tc = { error: "text-red-400 bg-red-500/10", warning: "text-amber-400 bg-amber-500/10" };
  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-[#0e1520] border border-white/10 rounded-2xl shadow-2xl z-50" onClick={e => e.stopPropagation()}>
      <div className="p-4 border-b border-white/8 flex items-center justify-between">
        <div className="text-white font-bold text-sm">Notifications</div>
        <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold">{items.length}</span>
      </div>
      <div className="max-h-64 overflow-y-auto">
        {items.length === 0 ? <div className="p-5 text-center text-slate-500 text-sm">All clear ✓</div> :
          items.map((n, i) => (
            <div key={i} className="flex items-start gap-3 p-3.5 border-b border-white/5 last:border-0 hover:bg-white/3 transition-all cursor-pointer">
              <div className={`w-7 h-7 rounded-lg ${tc[n.type]} flex items-center justify-center flex-shrink-0 mt-0.5`}><n.icon size={13} /></div>
              <div className="flex-1 min-w-0"><div className="text-white text-xs font-medium">{n.text}</div><div className="text-slate-600 text-xs mt-0.5">{n.time}</div></div>
            </div>
          ))
        }
      </div>
      <div className="p-3 border-t border-white/8">
        <button onClick={() => { toast("All notifications cleared", "info"); onClose(); }} className="w-full text-center text-xs text-slate-500 hover:text-amber-400 transition-colors py-1">Mark all as read</button>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "clients", label: "Clients", icon: Users },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function CRM() {
  const [page, setPage] = useState("dashboard");
  const [clients, setClients] = useState(initClients);
  const [projects, setProjects] = useState(initProjects);
  const [tasks, setTasks] = useState(initTasks);
  const [payments, setPayments] = useState(initPayments);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");

  const sendN8n = (type, data) => sendToN8n(webhookUrl, type, data);

  const overdueCount = payments.filter(p => p.status === "overdue").length;
  const pendingCount = tasks.filter(t => t.status === "pending").length;
  const badges = { payments: overdueCount || null, tasks: pendingCount || null };

  const titles = { dashboard: "Dashboard", clients: "Clients", projects: "Projects & Services", tasks: "Tasks", payments: "Payments & Invoices", reports: "Reports", settings: "Settings" };

  useEffect(() => {
    const close = () => setNotifOpen(false);
    if (notifOpen) document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [notifOpen]);

  return (
    <div className="min-h-screen bg-[#080d15] text-white flex overflow-hidden" style={{ fontFamily: "'DM Sans','Inter',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&display=swap');
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#ffffff20;border-radius:99px}
        *{box-sizing:border-box}select option{background:#0e1520;color:white}
        @keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
      `}</style>
      <ToastContainer />

      <aside className={`${sidebarOpen ? "w-56" : "w-16"} flex-shrink-0 bg-[#0a1020] border-r border-white/6 flex flex-col transition-all duration-300 h-screen sticky top-0`}>
        <div className="p-4 border-b border-white/6 flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0"><Activity size={15} className="text-black" /></div>
          {sidebarOpen && <div className="font-black text-white tracking-tight">FlowCRM</div>}
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative ${page === n.id ? "bg-amber-500/15 text-amber-400 border border-amber-500/20" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"}`}>
              <n.icon size={15} className="flex-shrink-0" />
              {sidebarOpen && <span className="flex-1 text-left">{n.label}</span>}
              {badges[n.id] && <span className={`bg-red-500 text-white text-xs font-black rounded-full min-w-4 h-4 flex items-center justify-center px-1 ${!sidebarOpen ? "absolute -top-0.5 -right-0.5" : ""}`}>{badges[n.id]}</span>}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/6">
          {sidebarOpen && webhookUrl && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 px-3 py-1.5 mb-1"><Wifi size={10} />n8n connected</div>
          )}
          <div className={`flex items-center gap-3 px-3 py-2 ${!sidebarOpen ? "justify-center" : ""}`}>
            <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-xs font-bold flex-shrink-0">W</div>
            {sidebarOpen && <div className="flex-1 min-w-0"><div className="text-white text-xs font-bold truncate">William</div><div className="text-slate-500 text-xs truncate">Admin</div></div>}
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="bg-[#0a1020]/90 border-b border-white/6 px-6 py-4 flex items-center gap-4 backdrop-blur-sm flex-shrink-0">
          <button onClick={() => setSidebarOpen(p => !p)} className="text-slate-500 hover:text-white transition-colors flex-shrink-0"><Menu size={17} /></button>
          <div className="flex-1"><h1 className="text-white font-black text-lg">{titles[page]}</h1></div>
          <N8nStatus webhookUrl={webhookUrl} />
          <div className="relative">
            <button onClick={e => { e.stopPropagation(); setNotifOpen(p => !p); }} className="relative p-2 rounded-lg hover:bg-white/8 text-slate-500 hover:text-white transition-all">
              <Bell size={16} />
              {overdueCount > 0 && <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />}
            </button>
            {notifOpen && <NotifDropdown payments={payments} tasks={tasks} clients={clients} onClose={() => setNotifOpen(false)} />}
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {page === "dashboard" && <Dashboard clients={clients} projects={projects} tasks={tasks} payments={payments} nav={setPage} sendN8n={sendN8n} />}
          {page === "clients" && <Clients clients={clients} setClients={setClients} projects={projects} payments={payments} sendN8n={sendN8n} />}
          {page === "projects" && <Projects projects={projects} setProjects={setProjects} clients={clients} sendN8n={sendN8n} />}
          {page === "tasks" && <Tasks tasks={tasks} setTasks={setTasks} projects={projects} />}
          {page === "payments" && <Payments payments={payments} setPayments={setPayments} clients={clients} sendN8n={sendN8n} />}
          {page === "reports" && <Reports clients={clients} projects={projects} payments={payments} />}
          {page === "settings" && <SettingsPage webhookUrl={webhookUrl} setWebhookUrl={setWebhookUrl} ownerEmail={ownerEmail} setOwnerEmail={setOwnerEmail} />}
        </main>
      </div>
    </div>
  );
}