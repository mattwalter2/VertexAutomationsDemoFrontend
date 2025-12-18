
// Removed frontend env vars - data now comes from backend
const BACKEND_API_URL = 'https://dentalclinic-backend-usfp.onrender.com'; // Production URL

/**
 * Fetch campaigns from Backend Proxy (which fetches from Meta)
 */
export async function fetchMetaCampaigns() {
    try {
        // Updated to use the backend proxy endpoint
        // Switch to localhost for local testing if needed, or keep production URL
        // ideally this base URL should be configurable via a single var if you switch envs often
        const url = `${BACKEND_API_URL}/api/meta/campaigns`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch campaigns from backend: ${response.statusText}`);
        }

        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching Meta campaigns from backend:', error);
        throw error;
    }
}

/**
 * Fetch campaign insights/analytics
 * Deprecated: Backend now returns insights attached to campaigns
 */
export async function fetchCampaignInsights(campaignId) {
    console.warn("fetchCampaignInsights is deprecated. Insights are now returned by fetchMetaCampaigns.");
    return null;
}

/**
 * Fetch all campaigns with their insights
 * Now just a wrapper around fetchMetaCampaigns since backend does the heavy lifting
 */
export async function fetchCampaignsWithInsights() {
    return await fetchMetaCampaigns();
}

/**
 * Format campaign data for display
 */
export function formatCampaignData(campaign) {
    const insights = campaign.insights || {};

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

        // Extract leads from actions
        leads: extractLeadsFromActions(insights.actions),
        conversions: extractConversionsFromActions(insights.actions)
    };
}

/**
 * Extract leads count from actions array
 */
function extractLeadsFromActions(actions) {
    if (!actions || !Array.isArray(actions)) return 0;

    const leadAction = actions.find(action =>
        action.action_type === 'lead' ||
        action.action_type === 'onsite_conversion.lead_grouped'
    );

    return leadAction ? parseInt(leadAction.value) : 0;
}

/**
 * Extract conversions from actions array
 */
function extractConversionsFromActions(actions) {
    if (!actions || !Array.isArray(actions)) return 0;

    const conversionAction = actions.find(action =>
        action.action_type === 'offsite_conversion.fb_pixel_purchase' ||
        action.action_type === 'onsite_conversion.purchase'
    );

    return conversionAction ? parseInt(conversionAction.value) : 0;
}

/**
 * Calculate aggregate stats from campaigns
 */
export function calculateAggregateStats(campaigns) {
    const totals = campaigns.reduce((acc, campaign) => {
        const formatted = formatCampaignData(campaign);

        return {
            totalSpend: acc.totalSpend + formatted.spend,
            totalImpressions: acc.totalImpressions + formatted.impressions,
            totalClicks: acc.totalClicks + formatted.clicks,
            totalLeads: acc.totalLeads + formatted.leads,
            totalReach: acc.totalReach + formatted.reach
        };
    }, {
        totalSpend: 0,
        totalImpressions: 0,
        totalClicks: 0,
        totalLeads: 0,
        totalReach: 0
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
