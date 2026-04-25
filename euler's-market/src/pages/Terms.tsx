import React from 'react';

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <div className="space-y-14">
        <div className="space-y-6">
          <h1 className="text-6xl font-bold tracking-tight text-slate-900 leading-tight">Terms of Service</h1>
          <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest bg-indigo-50 px-4 py-1.5 inline-block rounded-full shadow-sm">REVISION_DATE: May 2024</p>
        </div>
        
        <div className="space-y-12 text-slate-600 leading-relaxed font-medium">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">01_Acceptance of Terms</h2>
            <p>
              By accessing the Euler's Market beta portal, you agree to bound by these terms. 
              The system is currently in an experimental state. All features are subject to change 
              without prior notice.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">02_Beta Usage</h2>
            <p>
              Usage of the beta release is restricted to invited members only. 
              Unauthorized access to system nodes or administrative dashboards is strictly prohibited.
              Users are responsible for maintaining the security of their own recovery keys.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">03_Intellectual Property</h2>
            <p>
              The Euler System, including its branding, algorithms, and architectural patterns, 
              remain the sole property of Euler Labs.
            </p>
          </section>

          <section className="space-y-4 text-sm bg-slate-50 p-8 rounded-2xl border border-slate-100 italic relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 group-hover:w-2 transition-all"></div>
            <h2 className="text-xl font-bold text-slate-900 not-italic mb-2">04_Liability Limitation</h2>
            <p className="mb-4">
              Euler Labs is not liable for data loss or system downtime occurring during the beta phase.
            </p>
            <div className="not-italic pt-6 border-t border-slate-200">
              <p className="text-indigo-600 font-bold uppercase tracking-[0.2em] text-[10px]">LEGAL_CONTACT: legal@euler.life</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
