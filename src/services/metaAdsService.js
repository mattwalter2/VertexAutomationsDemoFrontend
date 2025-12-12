const META_ACCESS_TOKEN = import.meta.env.VITE_META_ACCESS_TOKEN;
const META_AD_ACCOUNT_ID = import.meta.env.VITE_META_AD_ACCOUNT_ID;
const GRAPH_API_BASE = 'https://graph.facebook.com/v18.0';

/**
 * Fetch campaigns from Meta Ads
 */
export async function fetchMetaCampaigns() {
    try {
        const accountId = META_AD_ACCOUNT_ID.startsWith('act_')
            ? META_AD_ACCOUNT_ID
            : `act_${META_AD_ACCOUNT_ID}`;

        const fields = [
            'id',
            'name',
            'status',
            'effective_status',
            'objective',
            'spend_cap',
            'daily_budget',
            'lifetime_budget'
        ].join(',');

        const url = `${GRAPH_API_BASE}/${accountId}/campaigns?fields=${fields}&access_token=${META_ACCESS_TOKEN}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch campaigns: ${response.statusText}`);
        }

        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching Meta campaigns:', error);
        throw error;
    }
}

/**
 * Fetch campaign insights/analytics
 */
export async function fetchCampaignInsights(campaignId, datePreset = 'last_30d') {
    try {
        const fields = [
            'impressions',
            'clicks',
            'spend',
            'ctr',
            'cpc',
            'cpp',
            'cpm',
            'reach',
            'frequency',
            'actions',
            'cost_per_action_type'
        ].join(',');

        const url = `${GRAPH_API_BASE}/${campaignId}/insights?fields=${fields}&date_preset=${datePreset}&access_token=${META_ACCESS_TOKEN}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch insights: ${response.statusText}`);
        }

        const data = await response.json();
        return data.data && data.data.length > 0 ? data.data[0] : null;
    } catch (error) {
        console.error('Error fetching campaign insights:', error);
        return null;
    }
}

/**
 * Fetch all campaigns with their insights
 */
export async function fetchCampaignsWithInsights() {
    try {
        const campaigns = await fetchMetaCampaigns();

        // Fetch insights for each campaign
        const campaignsWithInsights = await Promise.all(
            campaigns.map(async (campaign) => {
                const insights = await fetchCampaignInsights(campaign.id);
                return {
                    ...campaign,
                    insights
                };
            })
        );

        return campaignsWithInsights;
    } catch (error) {
        console.error('Error fetching campaigns with insights:', error);
        throw error;
    }
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
