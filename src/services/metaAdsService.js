// Removed frontend env vars - data now comes from backend
const BACKEND_API_URL = 'https://vertexautomationsdemo.onrender.com'; // Production URL

/**
 * Fetch detailed campaigns and stats from Backend
 * Returns { campaigns: [...], stats: {...} }
 */
export async function fetchMetaCampaigns() {
    try {
        const url = `${BACKEND_API_URL}/api/meta/campaigns`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch campaigns from backend: ${response.statusText}`);
        }

        const json = await response.json();
        // Backend now returns { data: [...], stats: {...} }
        return {
            campaigns: json.data || [],
            stats: json.stats || {}
        };
    } catch (error) {
        console.error('Error fetching Meta campaigns from backend:', error);
        throw error;
    }
}

// Deprecated exports to maintain import compatibility during refactor
export async function fetchCampaignsWithInsights() { return fetchMetaCampaigns(); }
export function formatCampaignData(c) { return c; }
export function calculateAggregateStats(c) { return {}; }
