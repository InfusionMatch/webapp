import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  Search,
  Plus,
  X,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Building2,
  Shield
} from "lucide-react";

interface Message {
  id: string;
  sender: string;
  senderRole: 'nurse' | 'admin' | 'supplier';
  recipient: string;
  recipientRole: 'nurse' | 'admin' | 'supplier';
  content: string;
  timestamp: string;
  attachedVisit?: {
    id: string;
    patientCode: string;
    title: string;
    date: string;
  };
  category?: 'pay' | 'credentialing' | 'visit' | 'general' | 'support';
  status: 'sent' | 'delivered' | 'read';
  isUnread: boolean;
}

interface Conversation {
  id: string;
  participants: string[];
  lastMessage: Message;
  unreadCount: number;
  attachedVisit?: {
    id: string;
    patientCode: string;
    title: string;
  };
}

interface MessagingSystemProps {
  userRole: 'nurse' | 'admin' | 'supplier';
  userName: string;
}

// Mock data
const mockVisits = [
  { id: "1", patientCode: "Patient R-2847", title: "IV Infusion - Remicade", date: "2025-09-25" },
  { id: "2", patientCode: "Patient M-1053", title: "PICC Line Dressing Change", date: "2025-09-23" },
  { id: "3", patientCode: "Patient K-7291", title: "IV Hydration Therapy", date: "2025-09-24" },
];

const mockConversations: Conversation[] = [
  {
    id: "1",
    participants: ["Jane Doe", "Clinical Support"],
    lastMessage: {
      id: "msg1",
      sender: "Clinical Support",
      senderRole: 'admin',
      recipient: "Jane Doe",
      recipientRole: 'nurse',
      content: "Your certification has been approved and uploaded to your profile.",
      timestamp: "2025-09-22 14:30",
      category: 'credentialing',
      status: 'delivered',
      isUnread: true
    },
    unreadCount: 1
  },
  {
    id: "2",
    participants: ["Jane Doe", "St. Mary's Hospital"],
    lastMessage: {
      id: "msg2",
      sender: "Jane Doe",
      senderRole: 'nurse',
      recipient: "St. Mary's Hospital",
      recipientRole: 'supplier',
      content: "I'm running about 15 minutes late due to traffic. Patient has been notified.",
      timestamp: "2025-09-21 09:45",
      attachedVisit: mockVisits[0],
      status: 'read',
      isUnread: false
    },
    unreadCount: 0,
    attachedVisit: mockVisits[0]
  }
];

export function MessagingSystem({ userRole, userName }: MessagingSystemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [newConversationRecipient, setNewConversationRecipient] = useState("");
  const [newConversationCategory, setNewConversationCategory] = useState("");
  const [attachedVisit, setAttachedVisit] = useState<string>("");
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);

  // Get available recipients based on user role
  const getAvailableRecipients = () => {
    switch (userRole) {
      case 'admin':
        return [
          { value: 'all-nurses', label: 'All Nurses', role: 'nurse' },
          { value: 'all-suppliers', label: 'All Suppliers', role: 'supplier' },
          { value: 'jane-doe', label: 'Jane Doe, RN', role: 'nurse' },
          { value: 'st-marys', label: "St. Mary's Hospital", role: 'supplier' },
        ];
      case 'nurse':
        return [
          { value: 'clinical-support', label: 'Clinical Support', role: 'admin' },
          { value: 'admin-support', label: 'Administrative Support', role: 'admin' },
          { value: 'st-marys', label: "St. Mary's Hospital", role: 'supplier' },
          { value: 'city-general', label: 'City General Medical', role: 'supplier' },
        ];
      case 'supplier':
        return [
          { value: 'support', label: 'Platform Support', role: 'admin' },
          { value: 'jane-doe', label: 'Jane Doe, RN', role: 'nurse' },
          { value: 'sarah-mitchell', label: 'Sarah Mitchell, RN', role: 'nurse' },
          { value: 'maria-santos', label: 'Maria Santos, RN', role: 'nurse' },
        ];
      default:
        return [];
    }
  };

  // Get message categories based on user role
  const getMessageCategories = () => {
    if (userRole === 'nurse') {
      return [
        { value: 'pay', label: 'Pay Questions' },
        { value: 'credentialing', label: 'Credentialing Questions' },
        { value: 'visit', label: 'Visit Questions' },
        { value: 'general', label: 'General Support' },
      ];
    }
    return [
      { value: 'support', label: 'Support Request' },
      { value: 'general', label: 'General' },
    ];
  };

  const unreadCount = conversations.reduce((total, conv) => total + conv.unreadCount, 0);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: userName,
      senderRole: userRole,
      recipient: selectedConversation?.participants.find(p => p !== userName) || "",
      recipientRole: userRole === 'nurse' ? 'admin' : 'nurse',
      content: newMessage,
      timestamp: new Date().toLocaleString(),
      attachedVisit: attachedVisit ? mockVisits.find(v => v.id === attachedVisit) : undefined,
      category: newConversationCategory as any,
      status: 'sent',
      isUnread: false
    };

    setNewMessage("");
    setAttachedVisit("");
  };

  const startNewConversation = () => {
    if (!newConversationRecipient || !newMessage.trim()) return;

    const recipient = getAvailableRecipients().find(r => r.value === newConversationRecipient);
    if (!recipient) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: userName,
      senderRole: userRole,
      recipient: recipient.label,
      recipientRole: recipient.role,
      content: newMessage,
      timestamp: new Date().toLocaleString(),
      attachedVisit: attachedVisit ? mockVisits.find(v => v.id === attachedVisit) : undefined,
      category: newConversationCategory as any,
      status: 'sent',
      isUnread: false
    };

    const newConversation: Conversation = {
      id: Date.now().toString(),
      participants: [userName, recipient.label],
      lastMessage: message,
      unreadCount: 0,
      attachedVisit: attachedVisit ? mockVisits.find(v => v.id === attachedVisit) : undefined,
    };

    setConversations([newConversation, ...conversations]);
    setSelectedConversation(newConversation);
    setNewMessage("");
    setNewConversationRecipient("");
    setNewConversationCategory("");
    setAttachedVisit("");
    setShowNewConversation(false);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'nurse': return <User className="h-3 w-3" />;
      case 'supplier': return <Building2 className="h-3 w-3" />;
      case 'admin': return <Shield className="h-3 w-3" />;
      default: return null;
    }
  };

  const getCategoryBadgeColor = (category?: string) => {
    switch (category) {
      case 'pay': return 'bg-green-100 text-green-800';
      case 'credentialing': return 'bg-blue-100 text-blue-800';
      case 'visit': return 'bg-purple-100 text-purple-800';
      case 'support': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <MessageSquare className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[80vh] p-0">
        <div className="flex h-full">
          {/* Conversations List */}
          <div className="w-1/3 border-r">
            <DialogHeader className="p-4 border-b">
              <div className="flex items-center justify-between">
                <DialogTitle>Messages</DialogTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowNewConversation(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search conversations..." className="pl-10" />
              </div>
            </DialogHeader>
            
            <ScrollArea className="h-96">
              <div className="p-2 space-y-1">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedConversation?.id === conversation.id 
                        ? 'bg-primary/10 border border-primary/20' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm truncate">
                            {conversation.participants.find(p => p !== userName)}
                          </p>
                          {getRoleIcon(conversation.lastMessage.senderRole)}
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-1">
                          {conversation.lastMessage.content}
                        </p>
                        {conversation.attachedVisit && (
                          <Badge variant="outline" className="text-xs mt-1">
                            {conversation.attachedVisit.patientCode}
                          </Badge>
                        )}
                        {conversation.lastMessage.category && (
                          <Badge className={`text-xs mt-1 ${getCategoryBadgeColor(conversation.lastMessage.category)}`}>
                            {conversation.lastMessage.category}
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-muted-foreground">
                          {conversation.lastMessage.timestamp.split(' ')[1]}
                        </span>
                        {conversation.unreadCount > 0 && (
                          <Badge className="h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Message View */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Message Header */}
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {selectedConversation.participants
                            .find(p => p !== userName)
                            ?.split(' ')
                            .map(n => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {selectedConversation.participants.find(p => p !== userName)}
                        </p>
                        {selectedConversation.attachedVisit && (
                          <p className="text-xs text-muted-foreground">
                            Visit: {selectedConversation.attachedVisit.patientCode}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedConversation(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    <div className={`flex ${selectedConversation.lastMessage.sender === userName ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        selectedConversation.lastMessage.sender === userName 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-gray-100'
                      }`}>
                        <p className="text-sm">{selectedConversation.lastMessage.content}</p>
                        {selectedConversation.lastMessage.attachedVisit && (
                          <div className="mt-2 p-2 bg-white/20 rounded text-xs">
                            <p className="font-medium">{selectedConversation.lastMessage.attachedVisit.patientCode}</p>
                            <p>{selectedConversation.lastMessage.attachedVisit.title}</p>
                          </div>
                        )}
                        <p className="text-xs opacity-70 mt-1">
                          {selectedConversation.lastMessage.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t space-y-3">
                  {/* Visit Attachment */}
                  <div className="flex gap-2">
                    <Select value={attachedVisit} onValueChange={setAttachedVisit}>
                      <SelectTrigger className="w-48 h-8 text-xs">
                        <SelectValue placeholder="Attach visit (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockVisits.map((visit) => (
                          <SelectItem key={visit.id} value={visit.id}>
                            {visit.patientCode} - {visit.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {attachedVisit && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setAttachedVisit("")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : showNewConversation ? (
              /* New Conversation Form */
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">New Message</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowNewConversation(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label>To:</Label>
                    <Select value={newConversationRecipient} onValueChange={setNewConversationRecipient}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select recipient" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableRecipients().map((recipient) => (
                          <SelectItem key={recipient.value} value={recipient.value}>
                            <div className="flex items-center gap-2">
                              {getRoleIcon(recipient.role)}
                              {recipient.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Category:</Label>
                    <Select value={newConversationCategory} onValueChange={setNewConversationCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {getMessageCategories().map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Attach Visit (Optional):</Label>
                    <Select value={attachedVisit} onValueChange={setAttachedVisit}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a visit" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockVisits.map((visit) => (
                          <SelectItem key={visit.id} value={visit.id}>
                            {visit.patientCode} - {visit.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Message:</Label>
                    <Textarea
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <Button 
                    onClick={startNewConversation} 
                    disabled={!newConversationRecipient || !newMessage.trim()}
                    className="w-full"
                  >
                    Send Message
                  </Button>
                </div>
              </div>
            ) : (
              /* Empty State */
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center space-y-2">
                  <MessageSquare className="h-12 w-12 mx-auto opacity-50" />
                  <p>Select a conversation or start a new message</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}