import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { auth, db } from '../lib/firebase';
import { 
  Key, 
  Settings, 
  CreditCard, 
  Activity, 
  Zap, 
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const [copied, setCopied] = useState(false);
  const user = auth.currentUser;

  const copyToClipboard = () => {
    navigator.clipboard.writeText('EULER-BETA-772-X9');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-200 pb-10">
          <div className="space-y-2">
            <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">Secure_Session_Active</span>
            <h1 className="text-5xl font-bold tracking-tight text-slate-900">Customer Portal</h1>
            <p className="text-slate-500 font-medium leading-relaxed">Welcome back, {user?.displayName || user?.email?.split('@')[0]}. Manage your digital assets.</p>
          </div>
          <div className="flex gap-2">
            <button className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 flex items-center gap-2">
              <Zap size={14} /> New Subscription
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Stats/Access */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl shadow-slate-900/5">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Key className="text-indigo-500" size={20} /> Active Access Keys
                </h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Protocol_V4</span>
              </div>

              <div className="space-y-4">
                <div className="group relative bg-slate-50 border border-slate-100 p-6 rounded-xl flex items-center justify-between hover:border-indigo-200 transition-colors">
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-white border border-slate-200 rounded-lg flex items-center justify-center shadow-sm">
                       <ShieldCheck className="text-indigo-500" size={24} />
                     </div>
                     <div>
                       <p className="text-sm font-bold text-slate-900">Enterprise Beta Access</p>
                       <p className="text-xs text-slate-500 font-medium italic">Expires: 2026-12-31</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-3">
                     <code className="bg-white px-4 py-2 rounded-lg border border-slate-200 font-mono text-xs font-bold text-slate-700">EULER-BETA-772-X9</code>
                     <button 
                      onClick={copyToClipboard}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all"
                     >
                       {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                     </button>
                   </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-lg shadow-slate-900/5 group hover:border-indigo-100 transition-colors">
                <Activity className="text-indigo-500 mb-4" size={20} />
                <h4 className="text-sm font-bold text-slate-900 mb-1">System Health</h4>
                <p className="text-xs text-slate-500 font-medium mb-4">Current latency to node EU-WEST-2</p>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-emerald-500">NOMINAL</span>
                  <span className="text-slate-400">8.2ms</span>
                </div>
              </div>
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-lg shadow-slate-900/5 group hover:border-indigo-100 transition-colors">
                <CreditCard className="text-indigo-500 mb-4" size={20} />
                <h4 className="text-sm font-bold text-slate-900 mb-1">Billing Account</h4>
                <p className="text-xs text-slate-500 font-medium mb-4">Last payment settled successfully</p>
                <button className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                  Manage Invoice <ExternalLink size={10} />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar / Quick Actions */}
          <div className="space-y-6">
            <div className="bg-slate-900 text-white rounded-2xl p-8 relative overflow-hidden shadow-2xl shadow-indigo-900/20">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Zap size={80} />
              </div>
              <h3 className="text-xl font-bold mb-4 relative z-10">Pro Upgrade</h3>
              <p className="text-sm text-slate-400 mb-6 relative z-10 leading-relaxed font-medium">
                Unlock higher API quotas and prioritized provisioning nodes for your applications.
              </p>
              <button className="w-full bg-indigo-500 text-white py-3 rounded-xl font-bold text-sm tracking-wide hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20">
                Upgrade Account
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl shadow-slate-900/5">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Security Checklist</h4>
              <ul className="space-y-4">
                {[
                  { label: "MFA Enabled", active: true },
                  { label: "Email Verified", active: user?.emailVerified },
                  { label: "Recovery Phone", active: false },
                  { label: "Hardware Key", active: false }
                ].map((item, i) => (
                  <li key={i} className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-600">{item.label}</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded uppercase tracking-tighter text-[9px]",
                      item.active ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                    )}>
                      {item.active ? "Secure" : "Incomplete"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
