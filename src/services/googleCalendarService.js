const API_BASE_URL = 'http://localhost:3001';

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

    // Try to parse patient name and treatment from summary (e.g. "Dental Cleaning - John Doe")
    let patient = 'Unknown Patient';
    let treatment = apt.summary || 'Consultation';

    if (apt.summary && apt.summary.includes('-')) {
        const parts = apt.summary.split('-');
        if (parts.length >= 2) {
            treatment = parts[0].trim();
            patient = parts[1].trim();
        }
    } else if (apt.description && apt.description.includes('Patient:')) {
        // Or check description for "Patient: Name"
        const match = apt.description.match(/Patient:\s*(.*)/i);
        if (match) {
            patient = match[1].trim();
        }
    }

    return {
        id: apt.id,
        patient,
        treatment,
        date: startDate.toLocaleDateString(),
        time: startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        duration: Math.round((endDate - startDate) / 60000) + ' min',
        status: apt.status || 'confirmed',
        notes: apt.description || '',
        link: apt.htmlLink
    };
}
