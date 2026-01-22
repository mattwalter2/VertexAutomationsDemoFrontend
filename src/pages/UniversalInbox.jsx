import { useState, useEffect } from 'react'
import { Search, Send, Paperclip, MoreVertical, Phone, Video, Instagram, Facebook, MessageCircle, Mic, Smile, Check, CheckCheck, Image, MessageSquare } from 'lucide-react'

// Fallback Dummy Data
const dummyConversations = [
    {
        id: 1,
        platform: 'whatsapp',
        user: 'Sarah Miller',
        avatar: 'SM',
        lastMessage: 'Can I reschedule my appointment for Tuesday?',
        time: '10:42 AM',
        unread: 2,
        messages: [
            { id: 1, sender: 'assistant', text: 'Hello Sarah, this is NovaSync Dental. How can we help you?', time: '10:30 AM' },
            { id: 2, sender: 'user', text: 'Hi, I need to check my appointment time.', time: '10:35 AM' },
            { id: 3, sender: 'user', text: 'Can I reschedule my appointment for Tuesday?', time: '10:42 AM' }
        ]
    }
]

export default function UniversalInbox() {
    const [selectedChat, setSelectedChat] = useState(null)
    const [messageInput, setMessageInput] = useState('')
    const [conversations, setConversations] = useState([])
    const [loading, setLoading] = useState(true)

    // Poll for new messages every 5 seconds
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch('https://nourdemodashboardbackend.onrender.com/api/messages')
                const data = await response.json()

                if (data && data.length > 0) {
                    // 1. Group messages by Phone Number (User ID)
                    const grouped = {}

                    data.forEach(msg => {
                        // Determine the "Conversation Partner" ID
                        // If message is 'from' me, the partner is 'to'.
                        // If message is 'from' user, the partner is 'from'.
                        const partnerId = msg.sender === 'me' ? msg.to : msg.from
                        if (!partnerId) return // Skip invalid

                        if (!grouped[partnerId]) {
                            grouped[partnerId] = {
                                id: partnerId,
                                platform: msg.platform || 'whatsapp',
                                user: msg.sender !== 'me' ? (msg.senderName || partnerId) : partnerId,
                                avatar: msg.sender !== 'me' && msg.senderName ? msg.senderName[0] : 'U',
                                messages: [],
                                unread: 0
                            }
                        }

                        grouped[partnerId].messages.push({
                            id: msg.id || Date.now() + Math.random(),
                            sender: msg.sender === 'me' ? 'assistant' : 'user',
                            text: msg.text,
                            time: msg.time || 'Just now'
                        })

                        if (msg.unread) grouped[partnerId].unread++
                    })

                    // Convert to array and reverse messages (oldest first)
                    const dynamicConvos = Object.values(grouped).map(conv => {
                        conv.messages.reverse()
                        conv.lastMessage = conv.messages[conv.messages.length - 1]?.text || ''
                        return conv
                    })

                    setConversations(dynamicConvos)

                    // Keep selection logic stable
                    if (!selectedChat && dynamicConvos.length > 0) {
                        setSelectedChat(dynamicConvos[0])
                    } else if (selectedChat) {
                        // Refresh active chat content
                        const updatedActive = dynamicConvos.find(c => c.id === selectedChat.id)
                        if (updatedActive) {
                            // Only update if message count changed to avoid excessive re-renders/jumps
                            if (updatedActive.messages.length !== selectedChat.messages.length) {
                                setSelectedChat(updatedActive)
                            }
                        }
                    }

                } else {
                    setConversations(dummyConversations)
                    if (!selectedChat) setSelectedChat(dummyConversations[0])
                }
            } catch (error) {
                console.error("Failed to fetch messages:", error)
                // Keep existing state or fallback? usage of dummyConversations here is okay for now
            } finally {
                setLoading(false)
            }
        }

        fetchMessages()
        const interval = setInterval(fetchMessages, 3000) // Poll faster
        return () => clearInterval(interval)
    }, [selectedChat]) // Re-run if selection logic needs it, though mostly independent

    // Update selected chat when conversations change
    useEffect(() => {
        if (selectedChat && conversations.length > 0) {
            const updated = conversations.find(c => c.id === selectedChat.id)
            if (updated) setSelectedChat(updated)
        }
    }, [conversations])

    const getPlatformIcon = (platform) => {
        switch (platform) {
            case 'whatsapp': return <MessageCircle size={16} className="text-white" />
            case 'instagram': return <Instagram size={16} className="text-white" />
            case 'facebook': return <Facebook size={16} className="text-white" />
            default: return <MessageCircle size={16} />
        }
    }

    const getPlatformColor = (platform) => {
        switch (platform) {
            case 'whatsapp': return 'bg-green-500'
            case 'instagram': return 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500'
            case 'facebook': return 'bg-blue-600'
            default: return 'bg-gray-500'
        }
    }

    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!messageInput.trim() || !selectedChat) return

        try {
            // Optimistic Update
            const tempMsg = {
                id: Date.now(),
                sender: 'assistant',
                text: messageInput,
                time: 'Sending...'
            }

            const updatedMessages = [...selectedChat.messages, tempMsg]
            const updatedChat = { ...selectedChat, messages: updatedMessages, lastMessage: messageInput }
            setSelectedChat(updatedChat)
            setMessageInput('')

            // Actual API Call
            const endpoint = selectedChat.platform === 'instagram'
                ? 'https://nourdemodashboardbackend.onrender.com/api/instagram/send'
                : 'https://nourdemodashboardbackend.onrender.com/api/whatsapp/send';

            await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: selectedChat.id,
                    text: tempMsg.text
                })
            })

            // The polling loop will pick up the "confirmed" message nicely in a few seconds

        } catch (err) {
            console.error("Send failed", err)
            alert("Failed to send message")
        }
    }

    if (loading) return <div className="p-10 text-center text-slate-500">Loading inbox...</div>

    return (
        <div className="flex h-[calc(100vh-8rem)] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Sidebar List */}
            <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-50">
                <div className="p-4 border-b border-slate-200 bg-white">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">Inbox</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {conversations.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => setSelectedChat(chat)}
                            className={`p-4 cursor-pointer hover:bg-white transition-colors border-b border-slate-100 ${selectedChat?.id === chat.id ? 'bg-white border-l-4 border-l-indigo-600 shadow-sm' : 'border-l-4 border-l-transparent'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-semibold text-slate-600">
                                        {chat.avatar}
                                    </div>
                                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white ${getPlatformColor(chat.platform)}`}>
                                        {getPlatformIcon(chat.platform)}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className={`text-sm font-semibold truncate ${selectedChat?.id === chat.id ? 'text-indigo-900' : 'text-slate-900'}`}>
                                            {chat.user}
                                        </h3>
                                        <span className="text-xs text-slate-400 whitespace-nowrap ml-2">{chat.time}</span>
                                    </div>
                                    <p className={`text-sm truncate ${chat.unread > 0 ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>
                                        {chat.lastMessage}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            {selectedChat ? (
                <div className="flex-1 flex flex-col bg-white">
                    {/* Chat Header */}
                    <div className="h-16 px-6 border-b border-slate-200 flex items-center justify-between bg-white">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-semibold text-sm text-slate-600">
                                {selectedChat.avatar}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-sm">{selectedChat.user}</h3>
                                <div className="flex items-center gap-1.5">
                                    <div className={`w-3 h-3 rounded-full flex items-center justify-center ${getPlatformColor(selectedChat.platform)}`}>
                                        {getPlatformIcon(selectedChat.platform)}
                                    </div>
                                    <span className="text-xs text-slate-500 capitalize">{selectedChat.platform}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-slate-400">
                            <Phone size={20} className="hover:text-slate-600 cursor-pointer" />
                            <Video size={20} className="hover:text-slate-600 cursor-pointer" />
                            <MoreVertical size={20} className="hover:text-slate-600 cursor-pointer" />
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                        {selectedChat.messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === 'assistant' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${msg.sender === 'assistant'
                                        ? 'bg-indigo-600 text-white rounded-br-none'
                                        : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
                                        }`}
                                >
                                    <p className="text-sm leading-relaxed">{msg.text}</p>
                                    <p className={`text-[10px] mt-1.5 text-right ${msg.sender === 'assistant' ? 'text-indigo-200' : 'text-slate-400'
                                        }`}>
                                        {msg.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Message Input */}
                    <div className="p-4 bg-white border-t border-slate-200">
                        <form onSubmit={handleSendMessage} className="flex items-end gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-100 transition-all">
                            <button type="button" className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                                <Paperclip size={20} />
                            </button>
                            <textarea
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault()
                                        handleSendMessage(e)
                                    }
                                }}
                                placeholder="Type a message..."
                                className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-2 text-sm max-h-32 text-slate-800 placeholder:text-slate-400"
                                rows="1"
                            />
                            <button
                                type="submit"
                                disabled={!messageInput.trim()}
                                className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-slate-400">
                    <p>Select a chat</p>
                </div>
            )}
        </div>
    )
}
