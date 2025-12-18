import Vapi from '@vapi-ai/web';

const VAPI_API_KEY = import.meta.env.VITE_VAPI_API_KEY;
const VAPI_BASE_URL = 'https://api.vapi.ai';

// Initialize Vapi Web Client
let vapiInstance = null;
export const getVapi = () => {
    if (!vapiInstance) {
        vapiInstance = new Vapi(VAPI_API_KEY); // Using public/api key
    }
    return vapiInstance;
};

/**
 * Fetch all calls from Vapi
 */
export async function fetchCalls(limit = 50) {
    try {
        // Use backend proxy to avoid CORS issues with Private Key
        const response = await fetch(`https://dentalclinic-backend-usfp.onrender.com/api/vapi/calls?limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch calls: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching calls:', error);
        throw error;
    }
}

/**
 * Fetch a specific call by ID
 */
export async function fetchCallById(callId) {
    try {
        const response = await fetch(`${VAPI_BASE_URL}/call/${callId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${VAPI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch call: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching call:', error);
        throw error;
    }
}

/**
 * Format call data for display
 */
export function formatCallData(call) {
    // Extract customer info
    const customerName = call.customer?.name || 'Unknown';
    const customerPhone = call.customer?.number || 'N/A';

    // Format date and time
    const createdAt = new Date(call.createdAt);
    const date = createdAt.toLocaleDateString('en-US');
    const time = createdAt.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    // Calculate duration
    const startedAt = call.startedAt ? new Date(call.startedAt) : null;
    const endedAt = call.endedAt ? new Date(call.endedAt) : null;
    let duration = 'N/A';

    if (startedAt && endedAt) {
        const durationMs = endedAt - startedAt;
        const minutes = Math.floor(durationMs / 60000);
        const seconds = Math.floor((durationMs % 60000) / 1000);
        duration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    // Determine outcome
    let outcome = 'Unknown';
    if (call.endedReason === 'assistant-ended-call') {
        outcome = 'Completed';
    } else if (call.endedReason === 'customer-ended-call') {
        outcome = 'Customer Ended';
    } else if (call.endedReason === 'assistant-error') {
        outcome = 'Error';
    } else if (call.status === 'ended') {
        outcome = 'Ended';
    }

    // Extract transcript
    const fullTranscript = call.transcript || call.messages?.map(m => m.content).join(' ') || 'No transcript available';
    const messages = call.messages || [];
    const summary = call.analysis?.summary || call.summary || 'No summary available';

    // Detect language (simplified)
    const language = call.assistant?.voice?.language || 'English';

    return {
        id: call.id,
        name: customerName,
        phone: customerPhone,
        date,
        time,
        duration,
        outcome,
        language,
        transcript: fullTranscript.substring(0, 200) + (fullTranscript.length > 200 ? '...' : ''), // Truncated for table
        fullTranscript, // Full text for modal
        messages, // Structured messages for chat view
        summary, // AI Summary
        status: call.status,
        recordingUrl: call.recordingUrl,
        cost: call.cost,
        assistantId: call.assistantId
    };
}

/**
 * Get call analytics/stats
 */
export function getCallStats(calls) {
    const totalCalls = calls.length;
    const completedCalls = calls.filter(c => c.status === 'ended').length;
    const activeCalls = calls.filter(c => c.status === 'in-progress').length;

    // Calculate total duration
    let totalDuration = 0;
    calls.forEach(call => {
        if (call.startedAt && call.endedAt) {
            const duration = new Date(call.endedAt) - new Date(call.startedAt);
            totalDuration += duration;
        }
    });

    const avgDuration = totalCalls > 0 ? totalDuration / totalCalls / 1000 : 0; // in seconds
    const avgMinutes = Math.floor(avgDuration / 60);
    const avgSeconds = Math.floor(avgDuration % 60);

    return {
        totalCalls,
        completedCalls,
        activeCalls,
        successRate: totalCalls > 0 ? Math.round((completedCalls / totalCalls) * 100) : 0,
        avgDuration: `${avgMinutes}:${avgSeconds.toString().padStart(2, '0')}`
    };
}
