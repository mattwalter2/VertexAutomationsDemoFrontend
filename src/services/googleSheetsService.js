
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://dentalclinic-backend-usfp.onrender.com';

/**
 * Fetch leads from the backend API
 * Backend now handles formatting, so we receive clean JSON objects.
 */
export async function fetchLeadsFromSheets() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/leads`);
        if (!response.ok) {
            throw new Error(`Failed to fetch leads: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching leads:', error);
        throw error;
    }
}

/**
 * Fetch follow-ups from the backend API
 */
export async function fetchFollowUpsFromSheets() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/followups`);
        if (!response.ok) {
            throw new Error(`Failed to fetch follow-ups: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching follow-ups:', error);
        throw error;
    }
}

/**
 * Calculate lead statistics from the data array
 */
export function getLeadStats(leads) {
    const statusCounts = leads.reduce((acc, lead) => {
        const status = lead.status || 'new';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});

    return {
        total: leads.length,
        new: statusCounts.new || 0,
        contacted: statusCounts.contacted || 0,
        qualified: statusCounts.qualified || 0,
        converted: statusCounts.converted || 0
    };
}

/**
 * Legacy formatter - kept for compatibility if needed, but backend does this now.
 * Pass-through or minor adjustments can go here.
 */
export function formatLeadData(lead) {
    return lead; // Backend already formats it
}
