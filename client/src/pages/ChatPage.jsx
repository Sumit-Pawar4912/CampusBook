import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { useToast } from '../components/ToastProvider.jsx';
import chatApi from '../services/chatApi.js';

const ChatPage = () => {
  const { conversationId } = useParams();
  const { addToast } = useToast();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (conversationId) {
      loadMessages(conversationId);
    }
  }, [conversationId]);

  const loadConversations = async () => {
    try {
      const response = await chatApi.getConversations();
      setConversations(response.data.data);
    } catch (error) {
      addToast('Failed to load conversations', 'error');
    }
  };

  const loadMessages = async (id) => {
    try {
      const response = await chatApi.getMessages(id);
      setMessages(response.data.data);
    } catch (error) {
      addToast('Failed to load messages', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      await chatApi.sendMessage(conversationId, newMessage.trim());
      setNewMessage('');
      loadMessages(conversationId); // Refresh messages
    } catch (error) {
      addToast(error.message || 'Failed to send message', 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="mx-auto max-w-6xl p-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <div className="rounded-3xl bg-white p-6 shadow">
              <h2 className="text-xl font-semibold text-slate-950 mb-4">Conversations</h2>
              <div className="space-y-3">
                {conversations.length === 0 ? (
                  <div className="text-center text-slate-500 py-8">No conversations yet</div>
                ) : (
                  conversations.map((conv) => (
                    <div
                      key={conv._id}
                      className={`rounded-2xl p-4 cursor-pointer transition-colors ${
                        conv._id === conversationId ? 'bg-sky-50 border border-sky-200' : 'bg-slate-50 hover:bg-slate-100'
                      }`}
                      onClick={() => window.location.href = `/chat/${conv._id}`}
                    >
                      <p className="font-medium text-slate-950">{conv.book.title}</p>
                      <p className="text-sm text-slate-600">by {conv.book.author}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {conv.buyer.name === conv.seller.name ? 'Self' : `with ${conv.buyer.name === 'You' ? conv.seller.name : conv.buyer.name}`}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="lg:col-span-2">
            {conversationId ? (
              <div className="rounded-3xl bg-white shadow min-h-[600px] flex flex-col">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-xl font-semibold text-slate-950">Messages</h2>
                </div>
                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                  {loading ? (
                    <div className="text-center text-slate-500">Loading messages...</div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-slate-500 py-8">No messages yet. Start the conversation!</div>
                  ) : (
                    messages.map((msg) => (
                      <div key={msg._id} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-medium">
                          {msg.sender.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-950">{msg.sender.name}</p>
                          <p className="text-slate-700 mt-1">{msg.content}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(msg.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <form onSubmit={handleSendMessage} className="p-6 border-t border-slate-200">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 focus:border-sky-500 focus:ring-sky-100"
                      disabled={sending}
                    />
                    <button
                      type="submit"
                      className="rounded-2xl bg-sky-600 px-6 py-3 text-white hover:bg-sky-700 disabled:opacity-50"
                      disabled={sending || !newMessage.trim()}
                    >
                      {sending ? 'Sending...' : 'Send'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="rounded-3xl bg-white p-12 shadow text-center">
                <p className="text-slate-500">Select a conversation to start chatting</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;