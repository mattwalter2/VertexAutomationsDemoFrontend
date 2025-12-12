const API_BASE_URL = 'http://localhost:3001';

/**
 * Fetch leads from Google Sheets via API server
 */
export async function fetchLeadsFromSheets() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/leads`);

        if (!response.ok) {
            throw new Error(`Failed to fetch leads: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching leads from Google Sheets:', error);
        throw error;
    }
}

/**
 * Format lead data for display
 * Adapts to the actual column names from your Google Form
 */
export function formatLeadData(lead) {
    // Map Google Form columns to our format
    // Adjust these field names based on your actual form columns
    const timestamp = lead['Timestamp'] || lead['timestamp'] || new Date().toISOString();
    const name = lead['Name'] || lead['Full Name'] || lead['name'] || 'Unknown';
    const email = lead['Email'] || lead['Email Address'] || lead['email'] || 'N/A';
    const phone = lead['Phone'] || lead['Phone Number'] || lead['phone'] || 'N/A';
    const treatment = lead['Treatment'] || lead['Service Interested'] || lead['treatment'] || 'General';
    const budget = lead['Budget'] || lead['Budget Range'] || lead['budget'] || 'Not specified';
    const notes = lead['Notes'] || lead['Additional Information'] || lead['notes'] || '';
    const preferredDate = lead['Preferred Date'] || lead['preferred_date'] || '';

    return {
        id: lead.id || timestamp,
        name,
        email,
        phone,
        treatment,
        budget,
        date: new Date(timestamp).toLocaleDateString('en-US'),
        time: new Date(timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        }),
        notes,
        status: lead.status || 'new',
        source: 'Google Form',
        preferredDate,
        rawData: lead // Keep original data for reference
    };
}

/**
 * Get lead statistics
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
