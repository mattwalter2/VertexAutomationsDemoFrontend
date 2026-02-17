import { Home, Calendar, Users, Phone, BarChart3, Settings, MessageSquare, CalendarClock, UserPlus } from 'lucide-react'

export default function Sidebar({ currentPage, setCurrentPage }) {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'leads', label: 'Leads', icon: UserPlus },
        { id: 'followups', label: 'Follow Ups', icon: MessageSquare },
        { id: 'appointments', label: 'Schedule', icon: Calendar },
        { id: 'customers', label: 'Customers', icon: Users },
        { id: 'calls', label: 'Call Logs', icon: Phone },
    ]

    return (
        <div className="w-64 bg-brand-primary flex flex-col shadow-2xl">
            {/* Logo */}
            <div className="p-6 border-b border-slate-700">
                <div className="flex items-center gap-3">
                    <div className="text-2xl text-brand-secondary">❄️</div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-200 leading-tight">Rapid Response<br /><span className="text-brand-secondary">Plumbing</span></h1>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
                {menuItems.map((item) => {
                    const Icon = item.icon
                    const isActive = currentPage === item.id

                    return (
                        <button
                            key={item.id}
                            onClick={() => setCurrentPage(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${isActive
                                ? 'bg-brand-secondary/10 text-brand-secondary font-bold border-r-4 border-brand-secondary'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                }`}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </button>
                    )
                })}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-slate-700">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-secondary flex items-center justify-center text-brand-primary font-bold shadow-md">
                        DM
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-slate-200">Admin</p>
                        <p className="text-xs text-slate-400">Manager</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
