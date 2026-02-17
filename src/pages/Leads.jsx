import { useState, useEffect } from 'react'
import { Users, Phone, Mail, RefreshCw, X, Plus, Save } from 'lucide-react'
import { fetchLeadsFromSheets, getLeadStats } from '../services/googleSheetsService'

export default function Leads() {
    const [leads, setLeads] = useState([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        total: 0,
        new: 0,
        contacted: 0,
        qualified: 0,
        converted: 0
    })
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        treatment: '',
        budget: '',
        source: 'Manual Entry',
        notes: ''
    })

    useEffect(() => {
        loadLeads()
    }, [])

    const loadLeads = async () => {
        setLoading(true)
        try {
            const data = await fetchLeadsFromSheets()
            setLeads(data) // Backend formats it

            const leadStats = getLeadStats(data)
            setStats(leadStats)
        } catch (error) {
            console.error('Failed to load leads:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleAddSubmit = (e) => {
        e.preventDefault()
        const newLead = {
            id: Date.now(), // temporary ID
            status: 'new',
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            treatment: formData.treatment || 'Consultation',
            budget: formData.budget || 'N/A',
            source: formData.source,
            notes: formData.notes
        }

        // Add to local state
        setLeads([newLead, ...leads])

        // Update stats locally
        setStats(prev => ({
            ...prev,
            new: prev.new + 1,
            total: prev.total + 1
        }))

        setIsModalOpen(false)
        setFormData({
            name: '',
            phone: '',
            email: '',
            treatment: '',
            budget: '',
            source: 'Manual Entry',
            notes: ''
        })
    }

    const handleCall = async (lead) => {
        if (!lead.phone) {
            alert("No phone number for this lead.")
            return
        }

        const confirmCall = window.confirm(`Call ${lead.name} at ${lead.phone}?`)
        if (!confirmCall) return

        try {
            // alert(`Calling ${lead.name}...`) // Optional feedback
            const response = await fetch('https://vertexautomationsdemobackend.onrender.com/api/vapi/initiate-call', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phoneNumber: lead.phone,
                    name: lead.name,
                    variables: {
                        patient_name: lead.name,
                        projected_treatment: lead.treatment,
                        budget: lead.budget,
                        lead_source: lead.source,
                        notes: lead.notes || "None"
                    }
                }),
            })

            const data = await response.json()
            if (response.ok) {
                alert(`Call initiated! Vapi ID: ${data.id}`)
            } else {
                alert(`Failed: ${data.error}`)
            }
        } catch (error) {
            console.error("Call failed", error)
            alert("Failed to connect to backend.")
        }
    }

    const statusConfig = {
        new: { label: 'New', color: 'blue' },
        contacted: { label: 'Contacted', color: 'purple' },
        qualified: { label: 'Qualified', color: 'orange' },
        converted: { label: 'Converted', color: 'green' },
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
                    <p className="text-gray-500 mt-1">Manage potential patients and inquiries</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={loadLeads}
                        disabled={loading}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all disabled:opacity-50"
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                    >
                        <Plus size={20} />
                        Add Lead
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">New</span>
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stats.new}</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Contacted</span>
                        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stats.contacted}</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Qualified</span>
                        <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stats.qualified}</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Converted</span>
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stats.converted}</p>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <RefreshCw size={40} className="animate-spin text-sky-500 mx-auto mb-4" />
                        <p className="text-gray-600">Syncing leads...</p>
                    </div>
                </div>
            )}

            {/* Leads Grid */}
            {!loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {leads.map((lead) => (
                        <div key={lead.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="font-semibold text-gray-900">{lead.name}</h3>
                                    <p className="text-xs text-gray-500 mt-1">{lead.date} at {lead.time}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${lead.status === 'new' ? 'bg-blue-100 text-blue-700' :
                                    lead.status === 'contacted' ? 'bg-purple-100 text-purple-700' :
                                        lead.status === 'qualified' ? 'bg-orange-100 text-orange-700' :
                                            'bg-green-100 text-green-700'
                                    }`}>
                                    {statusConfig[lead.status]?.label || lead.status}
                                </span>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-2 mb-3">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Phone size={14} />
                                    <span>{lead.phone}</span>
                                </div>
                                {lead.email && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Mail size={14} />
                                        <span className="truncate">{lead.email}</span>
                                    </div>
                                )}
                            </div>

                            {/* Treatment & Budget */}
                            <div className="space-y-2 pt-3 border-t border-gray-200">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Treatment:</span>
                                    <span className="font-medium text-gray-900">{lead.treatment}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Budget:</span>
                                    <span className="font-medium text-gray-900">{lead.budget}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Source:</span>
                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">{lead.source}</span>
                                </div>
                            </div>

                            {/* Notes */}
                            {lead.notes && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                    <p className="text-xs text-gray-600 italic">"{lead.notes}"</p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => handleCall(lead)}
                                    className="flex-1 bg-sky-50 hover:bg-sky-100 text-sky-600 px-3 py-2 rounded text-sm font-medium transition-colors">
                                    Call
                                </button>
                                <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-2 rounded text-sm font-medium transition-colors">
                                    View
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Lead Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <h2 className="text-lg font-bold text-gray-900">Add New Lead</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    placeholder="e.g. John Doe"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                                        placeholder="+1 (555) ..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Treatment</label>
                                    <select
                                        name="treatment"
                                        value={formData.treatment}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    >
                                        <option value="">Select...</option>
                                        <option value="Consultation">Consultation</option>
                                        <option value="Dental Cleaning">Dental Cleaning</option>
                                        <option value="Invisalign">Invisalign</option>
                                        <option value="Root Canal">Root Canal</option>
                                        <option value="Whitening">Whitening</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                                    <input
                                        type="text"
                                        name="budget"
                                        value={formData.budget}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                                        placeholder="e.g. $2000"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                <textarea
                                    name="notes"
                                    rows="3"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    placeholder="Any specific requirements..."
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 font-medium flex items-center justify-center gap-2"
                                >
                                    <Save size={18} />
                                    Save Lead
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
