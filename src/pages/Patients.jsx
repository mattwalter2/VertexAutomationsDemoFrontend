import { useState, useEffect } from 'react'
import { Users, Phone, Mail, Calendar, Search, UserPlus, X, Save, Activity } from 'lucide-react'
import { fetchCalls } from '../services/vapiService'

export default function Patients() {
    const [patients, setPatients] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        lastVisit: '',
        insurance: '',
        notes: ''
    })

    useEffect(() => {
        loadPatients()
    }, [])

    const loadPatients = async () => {
        setLoading(true)
        try {
            const calls = await fetchCalls(100)

            // Extract unique patients from calls
            const patientMap = new Map()

            calls.forEach(call => {
                const phone = call.customer?.number || 'Unknown'
                const name = call.customer?.name || 'Unknown Patient'

                if (!patientMap.has(phone)) {
                    patientMap.set(phone, {
                        name,
                        phone,
                        email: call.customer?.email || 'N/A',
                        totalCalls: 1,
                        lastCall: new Date(call.createdAt),
                        treatments: [],
                        status: call.status
                    })
                } else {
                    const patient = patientMap.get(phone)
                    patient.totalCalls++
                    const callDate = new Date(call.createdAt)
                    if (callDate > patient.lastCall) {
                        patient.lastCall = callDate
                    }
                }
            })

            // Convert to array and sort by last call
            const patientsArray = Array.from(patientMap.values())
                .sort((a, b) => b.lastCall - a.lastCall)

            setPatients(patientsArray)
        } catch (error) {
            console.error('Failed to load patients:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm)
    )

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleAddSubmit = (e) => {
        e.preventDefault()
        const newPatient = {
            name: formData.name,
            phone: formData.phone,
            email: formData.email || 'N/A',
            totalCalls: 0,
            lastCall: new Date(), // Created now
            manualEntry: true,
            status: 'Active',
            lastVisit: formData.lastVisit,
            insurance: formData.insurance,
            notes: formData.notes
        }

        // Add to local state (prepend)
        setPatients(prev => [newPatient, ...prev])

        setIsModalOpen(false)
        setFormData({
            name: '',
            phone: '',
            email: '',
            lastVisit: '',
            insurance: '',
            notes: ''
        })
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
                    <p className="text-gray-500 mt-1">Manage all patient records and contact information</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                    <UserPlus size={20} />
                    Add Patient
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Total Patients</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{patients.length}</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">Active This Week</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                        {patients.filter(p => {
                            const weekAgo = new Date()
                            weekAgo.setDate(weekAgo.getDate() - 7)
                            return p.lastCall > weekAgo
                        }).length}
                    </p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <p className="text-sm text-gray-600">New This Month</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                        {patients.filter(p => {
                            const monthAgo = new Date()
                            monthAgo.setMonth(monthAgo.getMonth() - 1)
                            return p.lastCall > monthAgo
                        }).length}
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search patients by name or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    />
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <Users size={40} className="animate-pulse text-sky-500 mx-auto mb-4" />
                        <p className="text-gray-600">Loading patients...</p>
                    </div>
                </div>
            )}

            {/* Patients Grid */}
            {!loading && filteredPatients.length === 0 && (
                <div className="bg-gray-50 rounded-lg p-12 text-center">
                    <Users size={48} className="text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
                    <p className="text-gray-600">
                        {searchTerm ? 'Try a different search term' : 'Add a patient manually or make calls to populate this list'}
                    </p>
                </div>
            )}

            {!loading && filteredPatients.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPatients.map((patient, index) => (
                        <div key={index} className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow relative overflow-hidden">
                            {patient.manualEntry && (
                                <div className="absolute top-0 right-0 bg-sky-100 text-sky-600 text-[10px] px-2 py-0.5 rounded-bl-lg font-medium">
                                    MANUAL
                                </div>
                            )}

                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                        {patient.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                                        <p className="text-xs text-gray-500">
                                            Added: {patient.lastCall.toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Phone size={14} className="text-gray-400" />
                                    <span>{patient.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Mail size={14} className="text-gray-400" />
                                    <span className="truncate">{patient.email}</span>
                                </div>
                                {patient.insurance && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Activity size={14} className="text-gray-400" />
                                        <span className="truncate">{patient.insurance}</span>
                                    </div>
                                )}
                            </div>

                            {/* Stats */}
                            <div className="pt-3 border-t border-gray-200">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Total Calls:</span>
                                    <span className="font-medium text-gray-900">{patient.totalCalls}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 mt-4">
                                <button className="flex-1 bg-sky-50 hover:bg-sky-100 text-sky-600 px-3 py-2 rounded text-sm font-medium transition-colors">
                                    View
                                </button>
                                <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-2 rounded text-sm font-medium transition-colors">
                                    Call
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Patient Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <h2 className="text-lg font-bold text-gray-900">Register New Patient</h2>
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
                                    placeholder="e.g. Jane Doe"
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
                                        placeholder="jane@example.com"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Visit</label>
                                    <input
                                        type="date"
                                        name="lastVisit"
                                        value={formData.lastVisit}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Insurance</label>
                                    <input
                                        type="text"
                                        name="insurance"
                                        value={formData.insurance}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                                        placeholder="Provider Name"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Medical Notes</label>
                                <textarea
                                    name="notes"
                                    rows="3"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    placeholder="Allergies, history, etc..."
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
                                    Register Patient
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
