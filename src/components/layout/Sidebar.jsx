import { Home, Calendar, Users, Phone, BarChart3, Settings, MessageSquare, CalendarClock } from 'lucide-react'

export default function Sidebar({ currentPage, setCurrentPage }) {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'appointments', label: 'Appointments', icon: Calendar },
        { id: 'followups', label: 'Follow Ups', icon: CalendarClock },
        { id: 'patients', label: 'Patients', icon: Users },
        { id: 'leads', label: 'Leads', icon: Users },
        { id: 'calls', label: 'Call Logs', icon: Phone },
        { id: 'inbox', label: 'Universal Inbox', icon: MessageSquare },
        { id: 'analytics', label: 'Ad Analytics', icon: BarChart3 },
    ]

    return (
        <div className="w-64 bg-gradient-to-b from-sky-400 to-cyan-500 flex flex-col shadow-2xl">
            {/* Logo */}
            <div className="p-6 border-b border-sky-300/30">
                <div className="flex items-center gap-2">
                    <div className="text-3xl">🦷</div>
                    <div>
                        <h1 className="text-xl font-bold text-white">Dr. Vora's Clinic</h1>
                        <p className="text-xs text-sky-50 mt-0.5">Practice Manager</p>
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
                                ? 'bg-white text-sky-600 font-medium shadow-lg'
                                : 'text-sky-50 hover:bg-sky-400/30 hover:text-white'
                                }`}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </button>
                    )
                })}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-sky-300/30">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-sky-600 font-semibold shadow-md">
                        DV
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-white">Dr. Vora</p>
                        <p className="text-xs text-sky-100">Admin</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
