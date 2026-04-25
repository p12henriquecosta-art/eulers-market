export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <div className="space-y-14">
        <div className="space-y-6">
          <h1 className="text-6xl font-bold tracking-tight text-slate-900 leading-tight">Privacy Protocols</h1>
          <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest bg-indigo-50 px-4 py-1.5 inline-block rounded-full shadow-sm">REVISION_DATE: May 2024</p>
        </div>
        
        <div className="space-y-12 text-slate-600 leading-relaxed font-medium">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">01_Data Nexus</h2>
            <p>
              We collect minimal data required for beta access: name, email, and system identifiers. 
              All data is stored in Google Cloud (europe-west2) with zero-trust security architecture.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">02_Regulatory Compliance</h2>
            <p>
              Euler's Market is fully compliant with GDPR and CCPA regulations. 
              You have the right to access, rectify, or delete your data at any time via our secure support channel.
            </p>
          </section>

          <section className="space-y-4 text-sm bg-slate-50 p-8 rounded-2xl border border-slate-100 italic relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 group-hover:w-2 transition-all"></div>
            <h2 className="text-xl font-bold text-slate-900 not-italic mb-2">03_Security Infrastructure</h2>
            <p className="mb-4">
              We implement advanced rate limiting, multi-factor authentication protocols, and encrypted relational sync 
              to protect your digital sovereignty.
            </p>
            <div className="not-italic pt-6 border-t border-slate-200">
              <p className="text-indigo-600 font-bold uppercase tracking-[0.2em] text-[10px]">SECURE_CHANNEL: support@euler.life</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
