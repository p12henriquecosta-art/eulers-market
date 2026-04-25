import { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  Users, 
  Clock, 
  ArrowUpRight, 
  Search, 
  Filter,
  CheckCircle,
  XCircle,
  MoreVertical
} from 'lucide-react';

interface WaitingListUser {
  id: string;
  email: string;
  name: string;
  status: 'pending' | 'invited' | 'joined';
  createdAt: any;
}

export default function Admin() {
  const [waitingList, setWaitingList] = useState<WaitingListUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    waitingListCount: 0,
    pendingInvites: 0,
    growth: 12.5
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const q = query(collection(db, 'waiting_list'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WaitingListUser));
      setWaitingList(data);
      
      const counts = data.reduce((acc, curr) => {
        acc[curr.status] = (acc[curr.status] || 0) + 1;
        return acc;
      }, {} as any);

      setStats({
        totalUsers: 1450, // Simulated total users
        waitingListCount: data.length,
        pendingInvites: counts['pending'] || 0,
        growth: 12.5
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'waiting_list');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId: string, newStatus: 'invited' | 'pending') => {
    try {
      await updateDoc(doc(db, 'waiting_list', userId), { status: newStatus });
      fetchData(); // Refresh
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'waiting_list');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-10">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-200 pb-10">
          <div className="space-y-2">
            <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">System_Dashboard_v2.0</span>
            <h1 className="text-5xl font-bold tracking-tight text-slate-900">Market Analytics</h1>
            <p className="text-slate-500 font-medium leading-relaxed">Real-time performance monitoring and waitlist oversight.</p>
          </div>
          <div className="flex gap-2">
            <button className="px-5 py-2.5 border border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-widest rounded-lg hover:bg-slate-50 transition-colors bg-white">Export .CSV</button>
            <button className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">Refresh Nodes</button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Users", value: stats.totalUsers.toLocaleString(), icon: Users, color: "text-indigo-600" },
            { label: "Waitlist Size", value: stats.waitingListCount.toLocaleString(), icon: Clock, color: "text-indigo-600" },
            { label: "Pending Verification", value: stats.pendingInvites.toString(), icon: BarChart3, color: "text-green-600" },
            { label: "Growth Rate", value: `+${stats.growth}%`, icon: ArrowUpRight, color: "text-purple-600" }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-slate-200 p-8 rounded-2xl shadow-xl shadow-slate-900/5 hover:border-indigo-200 transition-colors group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={cn("p-2.5 rounded-xl bg-slate-50 group-hover:bg-indigo-50 transition-colors", item.color)}>
                  <item.icon size={22} />
                </div>
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">METRIC_0{i+1}</span>
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-bold text-slate-900 tracking-tighter leading-none">{item.value}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em]">{item.label}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-50">
                <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase">
                  <ArrowUpRight size={12} />
                  <span>Within Nominal Range</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* User Management Table */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">System Waitlist</h2>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="FILTER_BY_IDENTITY" 
                  className="pl-12 pr-6 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-[10px] uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-64 transition-all shadow-sm"
                />
              </div>
              <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm">
                <Filter size={18} />
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/5 relative">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                    <th className="p-6 font-bold">Registration Timestamp</th>
                    <th className="p-6 font-bold">Identity Profile</th>
                    <th className="p-6 font-bold">Verified Email</th>
                    <th className="p-6 font-bold">Access Status</th>
                    <th className="p-6 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="p-20 text-center text-sm font-semibold text-slate-300 italic animate-pulse tracking-wide">Synchronizing data with secure nodes...</td>
                    </tr>
                  ) : waitingList.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-20 text-center text-sm font-semibold text-slate-400">No active records found in current buffer.</td>
                    </tr>
                  ) : (
                    waitingList.map((entry) => (
                      <tr key={entry.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="p-6 font-mono text-[11px] font-semibold text-slate-400">
                          {entry.createdAt?.toDate().toLocaleDateString()}
                        </td>
                        <td className="p-6 text-sm font-bold text-slate-900">
                          {entry.name}
                        </td>
                        <td className="p-6 text-sm font-semibold text-slate-500">
                          {entry.email}
                        </td>
                        <td className="p-6">
                          <span className={cn(
                            "px-4 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border shadow-sm",
                            entry.status === 'invited' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                            entry.status === 'pending' ? "bg-amber-50 text-amber-600 border-amber-100" :
                            "bg-slate-100 text-slate-600 border-slate-200"
                          )}>
                            {entry.status}
                          </span>
                        </td>
                        <td className="p-6 flex justify-end gap-3">
                          {entry.status === 'pending' && (
                            <button 
                              onClick={() => handleStatusChange(entry.id, 'invited')}
                              className="px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-bold uppercase rounded-lg hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/10"
                            >
                              Provision Access
                            </button>
                          )}
                          <button className="p-2 text-slate-300 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                            <MoreVertical size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-[0.15em] px-4">
            <p>Displaying {waitingList.length} global records from primary cloud node</p>
            <div className="flex gap-8">
              <button disabled className="hover:text-indigo-600 disabled:opacity-20 transition-colors">_PREVIOUS_PAGE</button>
              <button disabled className="hover:text-indigo-600 disabled:opacity-20 transition-colors">_NEXT_PAGE</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
