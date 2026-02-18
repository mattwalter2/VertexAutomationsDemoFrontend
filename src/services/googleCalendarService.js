const API_BASE_URL = 'https://vertexautomationsdemobackend.onrender.com';

/**
 * Fetch appointments from Google Calendar via API server
 */
export async function fetchAppointments() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/appointments`);

        if (!response.ok) {
            throw new Error(`Failed to fetch appointments: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching appointments:', error);
        throw error;
    }
}

/**
 * Format appointment data for display
 */
export function formatAppointment(apt) {
    const startDate = new Date(apt.start);
    const endDate = new Date(apt.end);

    // Try to parse customer name and service from summary (e.g. "Plumbing Service: John Doe")
    let customer = 'Unknown Customer';
    let service = apt.summary || 'Service Call';

    if (apt.summary && apt.summary.includes(':')) {
        const parts = apt.summary.split(':');
        if (parts.length >= 2) {
            service = parts[0].trim(); // e.g. "Plumbing Service"
            customer = parts[1].trim(); // e.g. "John Doe"
        }
    } else if (apt.description && (apt.description.includes('Customer:') || apt.description.includes('Patient:'))) {
        // Check description for "Customer: Name" (or legacy Patient)
        const match = apt.description.match(/(?:Customer|Patient):\s*(.*)/i);
        if (match) {
            customer = match[1].split('.')[0].trim(); // Take first sentence or part
        }
    }

    // specific check for our new format
    if (apt.description && apt.description.includes('Service Type:')) {
        const match = apt.description.match(/Service Type:\s*(.*)/i);
        if (match) {
            service = match[1].split('.')[0].trim();
        }
    }

    return {
        id: apt.id,
        customer,
        service,
        date: startDate.toLocaleDateString(),
        time: startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        duration: Math.round((endDate - startDate) / 60000) + ' min',
        status: apt.status || 'confirmed',
        notes: apt.description || '',
        link: apt.htmlLink
    };
}
