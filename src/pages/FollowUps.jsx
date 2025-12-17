import { useState } from 'react'
import { Calendar, Clock, CheckCircle2, AlertCircle, XCircle, Search, MoreVertical, Send, RefreshCw, ChevronRight, Bell, CalendarClock, Activity, Star, MessageSquare } from 'lucide-react'

// Dummy Data
const followUps = [
    {
        id: 1,
        name: 'Rajesh Kumar',
        phone: '+91 98765 43210',
        status: 'pending',
        type: 'Post-treatment check-in',
        detail: 'Root Canal - 3 days ago',
        schedule: 'Today, 11:00 AM'
    },
    {
        id: 2,
        name: 'Rohit Patel',
        phone: '+91 76543 21098',
        status: 'pending',
        type: 'Treatment plan follow-up',
        detail: 'Dental Implants consultation',
        schedule: 'Today, 2:00 PM'
    },
    {
        id: 3,
        name: 'Vikram Shah',
        phone: '+91 54321 09876',
        status: 'pending',
        type: 'Review request',
        detail: 'Teeth whitening - Nov 28',
        schedule: 'Dec 5, 2024'
    }
]

export default function FollowUps() {
    const [activeTab, setActiveTab] = useState('pending')

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Follow-Up System</h1>
                    <p className="text-slate-500 mt-1">Manage patient follow-ups and reminders</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all">
                    <CalendarClock size={20} />
                    Add Follow-up
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-slate-500 text-sm font-medium mb-1">Pending</div>
                    <div className="text-3xl font-bold text-amber-500">3</div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-slate-500 text-sm font-medium mb-1">Scheduled</div>
                    <div className="text-3xl font-bold text-indigo-600">3</div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-slate-500 text-sm font-medium mb-1">Completed</div>
                    <div className="text-3xl font-bold text-emerald-600">1</div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-slate-500 text-sm font-medium mb-1">Overdue</div>
                    <div className="text-3xl font-bold text-red-500">1</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main List */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Activity List */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                            <h2 className="font-bold text-slate-800 flex items-center gap-2">
                                <CalendarClock size={20} className="text-indigo-600" />
                                Follow-ups
                            </h2>
                            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                                {['Pending', 'Scheduled', 'Completed', 'Overdue'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab.toLowerCase())}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === tab.toLowerCase()
                                                ? 'bg-white text-slate-800 shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {followUps.map((item) => (
                                <div key={item.id} className="p-6 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex gap-4">
                                            <div className="mt-1">
                                                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm">
                                                    {item.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-slate-800">{item.name}</h3>
                                                    <span className="text-xs text-slate-400 font-mono">{item.phone}</span>
                                                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px] font-bold uppercase tracking-wide">
                                                        {item.status}
                                                    </span>
                                                </div>
                                                <p className="text-slate-800 font-medium mt-1">{item.type}</p>
                                                <p className="text-sm text-slate-500">{item.detail}</p>

                                                <div className="flex items-center gap-2 mt-2 text-sm text-indigo-600 font-medium">
                                                    <Clock size={16} />
                                                    {item.schedule}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm hover:shadow">
                                                <Send size={16} />
                                                Send Now
                                            </button>
                                            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
                                                Reschedule
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar - Analytics & Settings */}
                <div className="space-y-6">
                    {/* Analytics */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
                            <h2 className="font-bold text-slate-800 flex items-center gap-2">
                                <Activity size={20} className="text-emerald-600" />
                                Follow-up Analytics
                            </h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <div className="flex justify-between items-end mb-1">
                                    <span className="text-sm text-slate-500">Response Rate</span>
                                    <span className="text-xl font-bold text-slate-800">78%</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[78%] rounded-full" />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-end mb-1">
                                    <span className="text-sm text-slate-500">Bookings from Follow-ups</span>
                                    <span className="text-xl font-bold text-slate-800">45</span>
                                </div>
                                <div className="text-xs text-slate-400">This month</div>
                            </div>
                            <div>
                                <div className="flex justify-between items-end mb-1">
                                    <span className="text-sm text-slate-500">Re-engagement Success</span>
                                    <span className="text-xl font-bold text-slate-800">62%</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 w-[62%] rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Automation Settings */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
                            <h2 className="font-bold text-slate-800 flex items-center gap-2">
                                <RefreshCw size={20} className="text-sky-600" />
                                Automation Settings
                            </h2>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                                <div className="mt-1"><Bell size={18} className="text-indigo-500" /></div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-sm">Appointment Reminders</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">Send automatic reminders 24 hours before appointments</p>
                                    <span className="inline-block mt-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">24 hours before</span>
                                </div>
                                <div className="ml-auto">
                                    <div className="w-9 h-5 bg-emerald-500 rounded-full relative cursor-pointer">
                                        <div className="w-3 h-3 bg-white rounded-full absolute top-1 right-1 shadow-sm" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                                <div className="mt-1"><CheckCircle2 size={18} className="text-emerald-500" /></div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-sm">Post-Treatment Check-ins</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">Automatically follow up 3 days after procedures</p>
                                    <span className="inline-block mt-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">3 days after</span>
                                </div>
                                <div className="ml-auto">
                                    <div className="w-9 h-5 bg-emerald-500 rounded-full relative cursor-pointer">
                                        <div className="w-3 h-3 bg-white rounded-full absolute top-1 right-1 shadow-sm" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                                <div className="mt-1"><Calendar size={18} className="text-sky-500" /></div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-sm">Cleaning Reminders</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">Remind patients about 6-month cleaning schedule</p>
                                    <span className="inline-block mt-1 text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded">Every 6 months</span>
                                </div>
                                <div className="ml-auto">
                                    <div className="w-9 h-5 bg-slate-200 rounded-full relative cursor-pointer">
                                        <div className="w-3 h-3 bg-white rounded-full absolute top-1 left-1 shadow-sm" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                                <div className="mt-1"><Star size={18} className="text-amber-500" /></div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-sm">Review Requests</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">Request reviews 7 days after treatment</p>
                                    <span className="inline-block mt-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">7 days after</span>
                                </div>
                                <div className="ml-auto">
                                    <div className="w-9 h-5 bg-emerald-500 rounded-full relative cursor-pointer">
                                        <div className="w-3 h-3 bg-white rounded-full absolute top-1 right-1 shadow-sm" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                                <div className="mt-1"><MessageSquare size={18} className="text-purple-500" /></div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-sm">Re-engagement Messages</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">Reach out to patients inactive for 6+ months</p>
                                    <span className="inline-block mt-1 text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">After 6 months inactivity</span>
                                </div>
                                <div className="ml-auto">
                                    <div className="w-9 h-5 bg-slate-200 rounded-full relative cursor-pointer">
                                        <div className="w-3 h-3 bg-white rounded-full absolute top-1 left-1 shadow-sm" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
