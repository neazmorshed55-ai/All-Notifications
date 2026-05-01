/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, type ReactNode, type FormEvent } from "react";
import { 
  Bell, 
  Mail, 
  Slack, 
  MessageSquare, 
  Send, 
  LayoutDashboard, 
  Settings, 
  Menu, 
  X, 
  CheckCircle2,
  Clock,
  Shield,
  Smartphone
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Types
type Service = "gmail" | "slack" | "discord" | "telegram" | "whatsapp" | "trello";

interface Notification {
  id: string;
  service: Service;
  title: string;
  message: string;
  timestamp: Date;
  sender: string;
  read: boolean;
}

interface Account {
  id: string;
  type: Service;
  name: string;
  address: string;
}

// Mock Data
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    service: "gmail",
    title: "New Security Alert",
    message: "Your account was logged in from a new device in Dhaka.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    sender: "Google Security",
    read: false,
  },
  {
    id: "2",
    service: "slack",
    title: "Project Update",
    message: "Neaz: I've updated the Figma designs for the notification hub.",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    sender: "SyncHub Team",
    read: false,
  },
  {
    id: "6",
    service: "trello",
    title: "Card Moved",
    message: "Deployment Checklist moved to 'Done' by Neaz.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    sender: "Main Board",
    read: false,
  },
  {
    id: "3",
    service: "discord",
    title: "New Message",
    message: "Hey, are we still meeting at 3 PM?",
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    sender: "AlphaDev",
    read: true,
  },
  {
    id: "4",
    service: "telegram",
    title: "Crypto Alerts",
    message: "Bitcoin reached $65,000! Time to check your orders.",
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    sender: "PriceBot",
    read: false,
  },
  {
    id: "5",
    service: "whatsapp",
    title: "Family Chat",
    message: "Mom: Don't forget to buy milk on your way home.",
    timestamp: new Date(Date.now() - 1000 * 60 * 300),
    sender: "Personal",
    read: true,
  }
];

export default function App() {
  const [activeService, setActiveService] = useState<Service | "all">("all");
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [isLiveSync, setIsLiveSync] = useState(true);
  const [connectedAccounts, setConnectedAccounts] = useState<Account[]>([
    { id: "g1", type: "gmail", name: "Primary Gmail", address: "neazmorshed55@gmail.com" },
    { id: "wa_1", type: "whatsapp", name: "Personal WhatsApp", address: "+8801775939996" },
    { id: "wa_2", type: "whatsapp", name: "Secondary WhatsApp", address: "+8801789778722" },
    { id: "d1", type: "discord", name: "Gaming Hub", address: "NeazDev#1234" },
    { id: "d2", type: "discord", name: "Team Server", address: "morshed.dev" },
    { id: "s1", type: "slack", name: "SyncHub Workspace", address: "synchub-team.slack.com" },
    { id: "s2", type: "slack", name: "Freelance", address: "client-corp.slack.com" },
    { id: "t1", type: "telegram", name: "Main Account", address: "@neazmorshed" },
    { id: "t2", type: "telegram", name: "Bot Controls", address: "@synchub_bot" },
    { id: "tr1", type: "trello", name: "Project Board", address: "Trello Main" }
  ]);
  const [newEmail, setNewEmail] = useState("");

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        new Notification("SyncHub Live", {
          body: "Real-time notifications are now active!",
          icon: "/favicon.ico"
        });
      }
    }
  };

  const simulateIncomingNotification = () => {
    const services: Service[] = ["gmail", "whatsapp", "slack", "discord"];
    const randomService = services[Math.floor(Math.random() * services.length)];
    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      service: randomService,
      title: "New Incoming Feed",
      message: "This is a real-time simulation message arriving at " + new Date().toLocaleTimeString(),
      timestamp: new Date(),
      sender: "Live System",
      read: false,
    };
    
    setNotifications(prev => [newNotif, ...prev]);

    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(`SyncHub: ${randomService.toUpperCase()}`, {
        body: newNotif.message,
      });
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLiveSync) {
      interval = setInterval(() => {
        if (Math.random() > 0.7) simulateIncomingNotification();
      }, 15000); // Simulate every 15s with 30% chance
    }
    return () => clearInterval(interval);
  }, [isLiveSync]);

  const addGmailAccount = (e: FormEvent) => {
    e.preventDefault();
    if (newEmail && newEmail.includes("@")) {
      const newAcc: Account = {
        id: Math.random().toString(36).substr(2, 9),
        type: "gmail",
        name: "Gmail Account",
        address: newEmail
      };
      setConnectedAccounts([...connectedAccounts, newAcc]);
      setNewEmail("");
    }
  };

  const filteredNotifications = activeService === "all" 
    ? notifications 
    : notifications.filter(n => n.service === activeService);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getServiceIcon = (service: Service) => {
    switch (service) {
      case "gmail": return <Mail className="w-4 h-4 text-red-500" />;
      case "slack": return <Slack className="w-4 h-4 text-purple-500" />;
      case "discord": return <MessageSquare className="w-4 h-4 text-indigo-500" />;
      case "telegram": return <Send className="w-4 h-4 text-blue-400" />;
      case "whatsapp": return <MessageSquare className="w-4 h-4 text-green-500" />;
      case "trello": return <LayoutDashboard className="w-4 h-4 text-blue-600" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Bell className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold tracking-tight text-slate-900">SyncHub</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </header>

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar / Navigation */}
        <nav className={`
          fixed inset-0 z-40 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex md:flex-col md:w-64 shrink-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
          <div className="hidden md:flex items-center gap-3 p-6 border-b border-slate-800">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-500/20">
              S
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">SyncHub</h1>
            </div>
          </div>

          <div className="py-6 flex-1 overflow-y-auto">
            <div className="px-4 mb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Dashboard</div>
            <div className="px-2 space-y-1">
              <NavItem 
                active={activeService === "all"} 
                onClick={() => { setActiveService("all"); setIsSidebarOpen(false); }}
                icon={<LayoutDashboard className="w-4 h-4" />}
                label="All Messages"
                badge={unreadCount > 0 ? unreadCount : undefined}
              />
            </div>
            
            <div className="mt-8 px-4 mb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-blue-400">My Channels</div>
            <div className="px-2 space-y-4">
              {/* WhatsApp Group */}
              <div className="space-y-1">
                <div className="px-4 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">WhatsApp</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                </div>
                {connectedAccounts.filter(acc => acc.type === "whatsapp").map(acc => (
                  <NavItem 
                    key={acc.id}
                    active={activeService === "whatsapp"} 
                    onClick={() => { setActiveService("whatsapp"); setIsSidebarOpen(false); }}
                    icon={<MessageSquare className="w-4 h-4" />}
                    label={acc.name}
                  />
                ))}
              </div>

              {/* Discord Group */}
              <div className="space-y-1">
                <div className="px-4 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Discord</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                </div>
                {connectedAccounts.filter(acc => acc.type === "discord").map(acc => (
                  <NavItem 
                    key={acc.id}
                    active={activeService === "discord"} 
                    onClick={() => { setActiveService("discord"); setIsSidebarOpen(false); }}
                    icon={<MessageSquare className="w-4 h-4" />}
                    label={acc.name}
                  />
                ))}
              </div>

              {/* Slack Group */}
              <div className="space-y-1">
                <div className="px-4 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Slack</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                </div>
                {connectedAccounts.filter(acc => acc.type === "slack").map(acc => (
                  <NavItem 
                    key={acc.id}
                    active={activeService === "slack"} 
                    onClick={() => { setActiveService("slack"); setIsSidebarOpen(false); }}
                    icon={<Slack className="w-4 h-4" />}
                    label={acc.name}
                  />
                ))}
              </div>

              {/* Telegram Group */}
              <div className="space-y-1">
                <div className="px-4 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Telegram</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-sky-400"></div>
                </div>
                {connectedAccounts.filter(acc => acc.type === "telegram").map(acc => (
                  <NavItem 
                    key={acc.id}
                    active={activeService === "telegram"} 
                    onClick={() => { setActiveService("telegram"); setIsSidebarOpen(false); }}
                    icon={<Send className="w-4 h-4" />}
                    label={acc.name}
                  />
                ))}
              </div>

              {/* Gmail Group */}
              <div className="space-y-1">
                <div className="px-4 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Gmail</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                </div>
                {connectedAccounts.filter(acc => acc.type === "gmail").map(acc => (
                  <NavItem 
                    key={acc.id}
                    active={activeService === "gmail"} 
                    onClick={() => { setActiveService("gmail"); setIsSidebarOpen(false); }}
                    icon={<Mail className="w-4 h-4" />}
                    label={acc.address.split('@')[0]}
                  />
                ))}
              </div>

              {/* Trello Group */}
              <div className="space-y-1">
                <div className="px-4 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Trello</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                </div>
                {connectedAccounts.filter(acc => acc.type === "trello").map(acc => (
                  <NavItem 
                    key={acc.id}
                    active={activeService === "trello"} 
                    onClick={() => { setActiveService("trello"); setIsSidebarOpen(false); }}
                    icon={<LayoutDashboard className="w-4 h-4" />}
                    label={acc.name}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-slate-800 text-[10px] text-slate-400 flex justify-between items-center bg-slate-900/50">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span>5 Services Active</span>
            </div>
            <Settings className="w-3.5 h-3.5 hover:text-white cursor-pointer transition-colors" />
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          <header className="h-16 border-b border-slate-200 flex items-center justify-between px-8 shrink-0 bg-white hidden md:flex">
            <h2 className="text-lg font-semibold text-slate-800">
              {activeService === "all" ? "Integrated Inbox" : `${activeService.charAt(0).toUpperCase() + activeService.slice(1)} Feed`}
            </h2>
            <div className="flex items-center gap-6">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search notifications..." 
                  className="bg-slate-100 border-none rounded-full px-4 py-1.5 text-sm w-64 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
                />
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs shadow-inner">
                NM
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto bg-slate-50 p-8">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Column: Feed */}
                <div className="lg:col-span-2 space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Notifications</h3>
                    <div className="flex gap-4 items-center">
                      <button 
                        onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                        className="text-[10px] uppercase tracking-widest font-bold text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>

                  <AnimatePresence mode="popLayout">
                    {filteredNotifications.length > 0 ? (
                      filteredNotifications.map((notification) => (
                        <motion.div
                          layout
                          key={notification.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          onClick={() => markAsRead(notification.id)}
                          className={`
                            group relative flex gap-4 p-4 rounded-xl border transition-all cursor-pointer bg-white
                            ${notification.read 
                              ? "border-slate-200 opacity-75 shadow-none" 
                              : "border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200"
                            }
                          `}
                        >
                          <ServiceAvatar service={notification.service} sender={notification.sender} />
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-semibold text-slate-900 text-sm truncate">{notification.sender}</span>
                              <span className="text-[10px] text-slate-400 font-medium shrink-0">
                                {notification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className={`text-sm tracking-tight leading-snug ${notification.read ? "text-slate-500" : "text-slate-700 font-medium"}`}>
                              {notification.message}
                            </p>
                          </div>

                          {!notification.read && (
                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                          )}
                        </motion.div>
                      ))
                    ) : (
                      <div className="py-20 text-center flex flex-col items-center gap-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center">
                          <Bell className="w-5 h-5 text-slate-300" />
                        </div>
                        <p className="text-slate-400 text-sm font-medium">Inbox is empty.</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Right Column: Status & Actions */}
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                       <CheckCircle2 className="w-4 h-4 text-blue-500" />
                       Integration Status
                    </h3>
                    <div className="space-y-4">
                      <StatusItem name="Gmail" status="Connected" />
                      <StatusItem name="WhatsApp" status="Connected" />
                      <StatusItem name="Slack" status="Auth Required" warning />
                      <StatusItem name="Discord" status="Connected" />
                      <StatusItem name="Telegram" status="Connected" />
                    </div>
                    <button 
                      onClick={() => setShowConnectModal(true)}
                      className="w-full mt-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all"
                    >
                      Configure Services
                    </button>
                  </div>

                            <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/30 transition-colors" />
                    <h3 className="text-sm font-bold mb-2 relative z-10">Omni-Channel Sync</h3>
                    <p className="text-xs opacity-70 leading-relaxed mb-4 relative z-10">You have successfully integrated 5 accounts into your unified workflow.</p>
                    <div className="flex flex-col gap-3 relative z-10">
                      <div className="flex gap-2">
                        <div className="w-6 h-6 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center"><Mail className="w-3 h-3" /></div>
                        <div className="w-6 h-6 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center"><Slack className="w-3 h-3" /></div>
                        <div className="w-6 h-6 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center"><Send className="w-3 h-3" /></div>
                      </div>
                      <button 
                        onClick={simulateIncomingNotification}
                        className="w-full py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors"
                      >
                        Test Real-time Feed
                      </button>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                        <span className="text-[10px] font-bold opacity-50 uppercase">Live Simulation</span>
                        <button 
                          onClick={() => setIsLiveSync(!isLiveSync)}
                          className={`w-8 h-4 rounded-full transition-colors relative ${isLiveSync ? "bg-blue-500" : "bg-white/20"}`}
                        >
                          <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${isLiveSync ? "left-4.5" : "left-0.5"}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <AnimatePresence>
        {showConnectModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl relative border border-slate-200"
            >
              <button 
                onClick={() => setShowConnectModal(false)}
                className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h3 className="text-xl font-bold text-slate-900 mb-2">Connect Channels</h3>
              <p className="text-sm text-slate-500 mb-6">Establish secure connections to aggregate notifications.</p>

              <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-bold text-blue-900">Push Notifications</p>
                  <p className="text-[11px] text-blue-700">Receive alerts even when the app is closed.</p>
                </div>
                <button 
                  onClick={requestNotificationPermission}
                  className="px-3 py-1.5 bg-blue-600 text-white text-[10px] font-bold uppercase rounded-lg hover:bg-blue-700"
                >
                  Enable
                </button>
              </div>
              
              <div className="mb-8 space-y-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-bold">WhatsApp Linking</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">WEB BRIDGE ACTIVE</span>
                  </div>
                  <div className="flex gap-4 items-center">
                    <div className="w-20 h-20 bg-white border border-slate-200 rounded-lg flex items-center justify-center p-2 shrink-0">
                      <div className="w-full h-full bg-slate-900 rounded-[2px] opacity-10 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,#000_5px,#000_10px)] opacity-20" />
                        <span className="text-[8px] font-bold text-white relative z-10 bg-slate-900 px-1">QR CODE</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500 leading-tight mb-2">Scan this QR code with your WhatsApp mobile app (Linked Devices) to sync messages.</p>
                      <ul className="text-[10px] space-y-1 text-slate-400 font-medium">
                        <li>• Supports Multi-device beta</li>
                        <li>• End-to-end encrypted</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <form onSubmit={addGmailAccount} className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Add Gmail Account</label>
                  <div className="flex gap-2">
                    <input 
                      type="email" 
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="email@gmail.com" 
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button 
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
                    >
                      Connect
                    </button>
                  </div>
                </form>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Accounts</label>
                  <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                    {connectedAccounts.map(acc => (
                      <div key={acc.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                        <div className="flex items-center gap-3">
                          {getServiceIcon(acc.type)}
                          <div>
                            <p className="text-[12px] font-bold text-slate-900 leading-none mb-0.5">{acc.name}</p>
                            <p className="text-[10px] font-medium text-slate-400">{acc.address}</p>
                          </div>
                        </div>
                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <ConnectListItem icon={<LayoutDashboard className="text-blue-600 w-4 h-4" />} name="Trello Workspace" status="Connected" />
                <ConnectListItem icon={<MessageSquare className="text-indigo-500 w-4 h-4" />} name="Discord Bot" status="Ready" />
                <ConnectListItem icon={<Send className="text-blue-400 w-4 h-4" />} name="Telegram API" status="Ready" />
                <ConnectListItem icon={<MessageSquare className="text-green-500 w-4 h-4" />} name="WhatsApp Business" status="Ready" />
              </div>
              
              <button 
                onClick={() => setShowConnectModal(false)}
                className="w-full mt-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm tracking-wide hover:bg-slate-800 transition-all shadow-lg"
              >
                Close Settings
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        :root {
          --font-sans: 'Inter', system-ui, sans-serif;
        }

        body {
          font-family: var(--font-sans);
          -webkit-font-smoothing: antialiased;
        }
      `}} />
    </div>
  );
}

function NavItem({ active, onClick, icon, label, badge, indicatorColor }: { 
  active: boolean, 
  onClick: () => void, 
  icon: ReactNode, 
  label: string,
  badge?: number,
  indicatorColor?: string,
  key?: string | number
}) {
  return (
    <button 
      onClick={onClick}
      className={`
        w-full flex items-center justify-between px-4 py-2 hover:bg-slate-800 transition-all text-left rounded-lg
        ${active ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"}
      `}
    >
      <div className="flex items-center gap-3">
        {indicatorColor ? (
           <span className={`w-2 h-2 rounded-full ${indicatorColor}`}></span>
        ) : (
           <span className="flex-shrink-0 opacity-70">{icon}</span>
        )}
        <span className="text-[13px] font-medium leading-none">{label}</span>
      </div>
      {badge && (
        <span className="text-[10px] bg-blue-600 px-2 py-0.5 rounded-full text-white font-bold leading-none">
          {badge}
        </span>
      )}
    </button>
  );
}

function ServiceAvatar({ service, sender }: { service: Service, sender: string }) {
  const getColors = (s: Service) => {
    switch (s) {
      case "gmail": return "bg-red-50 text-red-600";
      case "slack": return "bg-purple-50 text-purple-600";
      case "discord": return "bg-indigo-50 text-indigo-600";
      case "telegram": return "bg-sky-50 text-sky-600";
      case "whatsapp": return "bg-green-50 text-green-600";
      case "trello": return "bg-blue-50 text-blue-600";
    }
  };

  const getInitial = (s: Service) => {
    switch (s) {
      case "gmail": return "G";
      case "slack": return "SL";
      case "discord": return "DS";
      case "telegram": return "TG";
      case "whatsapp": return "WA";
      case "trello": return "TR";
    }
  };

  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-[10px] uppercase border border-slate-100 ${getColors(service)}`}>
      {getInitial(service)}
    </div>
  );
}

function StatusItem({ name, status, warning }: { name: string, status: string, warning?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${warning ? "bg-yellow-500" : "bg-green-500"}`}></div>
        <span className="text-xs text-slate-600 font-medium">{name}</span>
      </div>
      <span className="text-[10px] text-slate-400 font-mono font-bold tracking-tight">{status}</span>
    </div>
  );
}

function ConnectListItem({ icon, name, status }: { icon: ReactNode, name: string, status: "Connected" | "Ready" | "Unavailable" }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/60 group hover:border-slate-300 transition-all">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-white rounded-lg shadow-sm border border-slate-100 flex items-center justify-center transition-transform">
          {icon}
        </div>
        <div className="space-y-0.5">
          <p className="font-bold text-[13px] text-slate-900 leading-tight">{name}</p>
          <p className="text-[10px] uppercase font-bold tracking-tight opacity-40 font-mono italic">{status}</p>
        </div>
      </div>
      <button className={`
        px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-tight transition-all
        ${status === "Connected" 
          ? "bg-green-50 text-green-700 border border-green-200" 
          : status === "Unavailable" 
            ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
            : "bg-slate-900 text-white hover:bg-slate-800"
        }
      `}>
        {status === "Connected" ? "Active" : status === "Unavailable" ? "Locked" : "Link"}
      </button>
    </div>
  );
}


