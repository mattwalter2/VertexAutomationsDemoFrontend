import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, DollarSign, Eye, MousePointer, Users, RefreshCw } from 'lucide-react'

// Backend URL
const BACKEND_API_URL = 'https://vertexautomationsdemo.onrender.com';

export default function AdAnalytics() {
    const [campaigns, setCampaigns] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [stats, setStats] = useState({
        totalSpend: 0,
        totalImpressions: 0,
        totalClicks: 0,
        totalLeads: 0,
        avgCTR: 0,
        avgCPC: 0
    })

    useEffect(() => {
        loadAdData()
    }, [])

    const loadAdData = async () => {
        setLoading(true)
        setError(null)

        try {
            // Direct fetch from backend
            const response = await fetch(`${BACKEND_API_URL}/api/meta/campaigns`);

            if (!response.ok) {
                throw new Error(`Failed to fetch campaigns: ${response.statusText}`);
            }

            const json = await response.json();
            const rawCampaigns = json.data || [];

            // Process data client-side since backend returns raw insights
            const formattedCampaigns = rawCampaigns.map(formatCampaignData);
            setCampaigns(formattedCampaigns);

            const calculatedStats = calculateAggregateStats(formattedCampaigns);
            setStats(calculatedStats);

        } catch (err) {
            setError(err.message)
            console.error('Failed to load Meta Ads data:', err)
        } finally {
            setLoading(false)
        }
    }

    // --- Helper Functions inlined ---

    function formatCampaignData(campaign) {
        const insights = campaign.insights || {};
        const actions = insights.actions || [];

        return {
            id: campaign.id,
            name: campaign.name,
            status: campaign.effective_status?.toLowerCase() || 'unknown',
            spend: parseFloat(insights.spend || 0),
            impressions: parseInt(insights.impressions || 0),
            clicks: parseInt(insights.clicks || 0),
            ctr: parseFloat(insights.ctr || 0),
            cpc: parseFloat(insights.cpc || 0),
            cpm: parseFloat(insights.cpm || 0),
            reach: parseInt(insights.reach || 0),
            leads: extractActionValue(actions, ['lead', 'onsite_conversion.lead_grouped']),
            conversions: extractActionValue(actions, ['offsite_conversion.fb_pixel_purchase', 'onsite_conversion.purchase'])
        };
    }

    function extractActionValue(actions, types) {
        if (!Array.isArray(actions)) return 0;
        const action = actions.find(a => types.includes(a.action_type));
        return action ? parseInt(action.value) : 0;
    }

    function calculateAggregateStats(campaignsList) {
        const totals = campaignsList.reduce((acc, camp) => ({
            totalSpend: acc.totalSpend + camp.spend,
            totalImpressions: acc.totalImpressions + camp.impressions,
            totalClicks: acc.totalClicks + camp.clicks,
            totalLeads: acc.totalLeads + camp.leads,
            totalReach: acc.totalReach + camp.reach
        }), {
            totalSpend: 0, totalImpressions: 0, totalClicks: 0, totalLeads: 0, totalReach: 0
        });

        return {
            ...totals,
            avgCTR: totals.totalImpressions > 0
                ? ((totals.totalClicks / totals.totalImpressions) * 100).toFixed(2)
                : '0.00',
            avgCPC: totals.totalClicks > 0
                ? (totals.totalSpend / totals.totalClicks).toFixed(2)
                : '0.00'
        };
    }

    // --- Comparison Logic ---
    const bestCTR = campaigns.length > 0
        ? campaigns.reduce((best, c) => c.ctr > best.ctr ? c : best, campaigns[0]) : null;

    const mostLeads = campaigns.length > 0
        ? campaigns.reduce((best, c) => c.leads > best.leads ? c : best, campaigns[0]) : null;

    const lowestCPC = campaigns.length > 0
        ? campaigns.reduce((best, c) => c.cpc > 0 && c.cpc < best.cpc ? c : best, campaigns[0]) : null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Ad Analytics</h1>
                    <p className="text-gray-500 mt-1">Real-time data from your Meta Ads Manager</p>
                </div>
                <button
                    onClick={loadAdData}
                    disabled={loading}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all disabled:opacity-50"
                >
                    <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Error State */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-red-700">
                        <p className="font-medium">Failed to load Meta Ads data</p>
                    </div>
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
            )}

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl p-6 shadow-lg text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-white/20 backdrop-blur-sm">
                            <DollarSign size={24} className="text-white" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold">${stats.totalSpend.toFixed(2)}</h3>
                    <p className="text-sm text-white/90 mt-2 font-medium">Total Ad Spend</p>
                    <p className="text-xs text-white/70 mt-1">Last 30 days</p>
                </div>

                <div className="bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl p-6 shadow-lg text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-white/20 backdrop-blur-sm">
                            <Eye size={24} className="text-white" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold">{stats.totalImpressions.toLocaleString()}</h3>
                    <p className="text-sm text-white/90 mt-2 font-medium">Total Impressions</p>
                    <p className="text-xs text-white/70 mt-1">Reach achieved</p>
                </div>

                <div className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl p-6 shadow-lg text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-white/20 backdrop-blur-sm">
                            <MousePointer size={24} className="text-white" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold">{stats.totalClicks.toLocaleString()}</h3>
                    <p className="text-sm text-white/90 mt-2 font-medium">Total Clicks</p>
                    <p className="text-xs text-white/70 mt-1">{stats.avgCTR}% CTR</p>
                </div>

                <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-xl p-6 shadow-lg text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-white/20 backdrop-blur-sm">
                            <Users size={24} className="text-white" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold">{stats.totalLeads}</h3>
                    <p className="text-sm text-white/90 mt-2 font-medium">Total Leads</p>
                    <p className="text-xs text-white/70 mt-1">From all campaigns</p>
                </div>

                <div className="bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl p-6 shadow-lg text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-white/20 backdrop-blur-sm">
                            <TrendingUp size={24} className="text-white" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold">{stats.avgCTR}%</h3>
                    <p className="text-sm text-white/90 mt-2 font-medium">Avg Click Rate</p>
                    <p className="text-xs text-white/70 mt-1">Across campaigns</p>
                </div>

                <div className="bg-gradient-to-br from-teal-400 to-green-500 rounded-xl p-6 shadow-lg text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-white/20 backdrop-blur-sm">
                            <DollarSign size={24} className="text-white" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold">${stats.avgCPC}</h3>
                    <p className="text-sm text-white/90 mt-2 font-medium">Avg Cost Per Click</p>
                    <p className="text-xs text-white/70 mt-1">Efficiency metric</p>
                </div>
            </div>

            {/* Loading State */}
            {loading && !error && (
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <RefreshCw size={40} className="animate-spin text-sky-500 mx-auto mb-4" />
                        <p className="text-gray-600">Loading campaigns from Meta Ads...</p>
                    </div>
                </div>
            )}

            {/* No Campaigns */}
            {!loading && !error && campaigns.length === 0 && (
                <div className="bg-gray-50 rounded-lg p-12 text-center">
                    <BarChart3 size={48} className="text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
                    <p className="text-gray-600">Create campaigns in Meta Ads Manager to see them here</p>
                </div>
            )}

            {/* Campaigns Table */}
            {!loading && !error && campaigns.length > 0 && (
                <>
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Campaigns</h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campaign</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Spend</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Impressions</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Clicks</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Leads</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">CTR</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">CPC</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {campaigns.map((campaign) => (
                                        <tr key={campaign.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{campaign.name}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${campaign.status === 'active'
                                                    ? 'bg-green-100 text-green-700'
                                                    : campaign.status === 'paused'
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm text-gray-900">${campaign.spend.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-right text-sm text-gray-900">{campaign.impressions.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right text-sm text-gray-900">{campaign.clicks}</td>
                                            <td className="px-6 py-4 text-right text-sm text-gray-900">{campaign.leads}</td>
                                            <td className="px-6 py-4 text-right text-sm text-gray-900">{campaign.ctr.toFixed(2)}%</td>
                                            <td className="px-6 py-4 text-right text-sm text-gray-900">${campaign.cpc.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Performance Insights */}
                    <div className="bg-gradient-to-r from-sky-400 via-cyan-500 to-blue-500 rounded-xl p-8 text-white shadow-2xl">
                        <h2 className="text-2xl font-bold mb-4">Performance Insights</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {bestCTR && (
                                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                                    <p className="text-sm text-white/80 mb-1">Best Performing</p>
                                    <p className="font-semibold truncate">{bestCTR.name}</p>
                                    <p className="text-xs text-white/70 mt-1">{bestCTR.ctr.toFixed(2)}% CTR</p>
                                </div>
                            )}
                            {mostLeads && (
                                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                                    <p className="text-sm text-white/80 mb-1">Most Leads</p>
                                    <p className="font-semibold truncate">{mostLeads.name}</p>
                                    <p className="text-xs text-white/70 mt-1">{mostLeads.leads} leads generated</p>
                                </div>
                            )}
                            {lowestCPC && (
                                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                                    <p className="text-sm text-white/80 mb-1">Lowest CPC</p>
                                    <p className="font-semibold truncate">{lowestCPC.name}</p>
                                    <p className="text-xs text-white/70 mt-1">${lowestCPC.cpc.toFixed(2)} per click</p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
