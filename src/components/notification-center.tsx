import { useState } from 'react';
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { 
  Bell, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Award, 
  DollarSign,
  Shield,
  X,
  Stethoscope,
  Calendar
} from "lucide-react";

interface Notification {
  id: string;
  type: 'certification' | 'job' | 'approval' | 'expiring' | 'shift' | 'completion' | 'system' | 'payment';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  actionRequired?: boolean;
  relatedId?: string;
}

interface NotificationCenterProps {
  userRole: 'nurse' | 'admin' | 'supplier';
  userName: string;
}

// Mock notifications for different user roles
const mockNotifications = {
  nurse: [
    {
      id: '1',
      type: 'certification' as const,
      title: 'IV Therapy Certification Approved',
      message: 'Your IV Therapy certification has been verified and approved. You can now accept IV infusion visits.',
      timestamp: '2025-09-22 14:30',
      isRead: false,
      priority: 'high' as const,
      actionRequired: false
    },
    {
      id: '2',
      type: 'job' as const,
      title: 'New High-Priority Visit Available',
      message: 'A new Remicade infusion visit is available in your area for tomorrow at 10:00 AM. Pays $165.',
      timestamp: '2025-09-22 12:15',
      isRead: false,
      priority: 'medium' as const,
      actionRequired: true
    },
    {
      id: '3',
      type: 'expiring' as const,
      title: 'BLS Certification Expiring Soon',
      message: 'Your BLS certification expires on December 1st, 2025. Please upload your renewal.',
      timestamp: '2025-09-21 09:00',
      isRead: true,
      priority: 'medium' as const,
      actionRequired: true
    },
    {
      id: '4',
      type: 'approval' as const,
      title: 'Visit Confirmation Required',
      message: 'Patient Maria Rodriguez has confirmed your visit for tomorrow at 10:00 AM. Please review final details.',
      timestamp: '2025-09-21 16:45',
      isRead: true,
      priority: 'high' as const,
      actionRequired: true
    },
    {
      id: '5',
      type: 'payment' as const,
      title: 'Payment Processed',
      message: 'Your payment of $285 for last week\'s visits has been processed and will be deposited within 24 hours.',
      timestamp: '2025-09-20 08:30',
      isRead: true,
      priority: 'low' as const,
      actionRequired: false
    }
  ],
  supplier: [
    {
      id: '1',
      type: 'shift' as const,
      title: 'Visit Picked Up',
      message: 'Jane Doe, RN has accepted the Remicade infusion visit for Patient R-2847 scheduled for tomorrow.',
      timestamp: '2025-09-22 14:30',
      isRead: false,
      priority: 'medium' as const,
      actionRequired: false
    },
    {
      id: '2',
      type: 'completion' as const,
      title: 'Visit Completed Successfully',
      message: 'PICC line dressing change for Patient M-1053 was completed by Sarah Mitchell, RN. Documentation submitted.',
      timestamp: '2025-09-22 11:20',
      isRead: false,
      priority: 'low' as const,
      actionRequired: false
    },
    {
      id: '3',
      type: 'system' as const,
      title: 'Nurse Assignment Update',
      message: 'Maria Santos, RN has withdrawn from the IV hydration visit on 9/24. The visit is now available for reassignment.',
      timestamp: '2025-09-21 15:30',
      isRead: true,
      priority: 'high' as const,
      actionRequired: true
    },
    {
      id: '4',
      type: 'payment' as const,
      title: 'Invoice Payment Confirmed',
      message: 'Payment for invoice #INV-2025-0892 ($1,240) has been processed successfully.',
      timestamp: '2025-09-20 10:15',
      isRead: true,
      priority: 'low' as const,
      actionRequired: false
    }
  ],
  admin: [
    {
      id: '1',
      type: 'system' as const,
      title: 'New Nurse Registration',
      message: 'Michael Chen, RN has completed registration and is pending credential verification.',
      timestamp: '2025-09-22 16:20',
      isRead: false,
      priority: 'medium' as const,
      actionRequired: true
    },
    {
      id: '2',
      type: 'certification' as const,
      title: 'Certification Review Required',
      message: '3 nurse certifications are pending review and approval in the credentialing queue.',
      timestamp: '2025-09-22 13:45',
      isRead: false,
      priority: 'high' as const,
      actionRequired: true
    },
    {
      id: '3',
      type: 'system' as const,
      title: 'Platform Usage Report',
      message: 'Weekly platform usage report is ready. 45 visits completed this week with 96% satisfaction rate.',
      timestamp: '2025-09-22 08:00',
      isRead: true,
      priority: 'low' as const,
      actionRequired: false
    },
    {
      id: '4',
      type: 'system' as const,
      title: 'Payment Dispute',
      message: 'A payment dispute has been raised by Jane Doe, RN regarding visit #V-2025-1234.',
      timestamp: '2025-09-21 14:20',
      isRead: true,
      priority: 'high' as const,
      actionRequired: true
    }
  ]
};

export function NotificationCenter({ userRole, userName }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications[userRole]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: string, priority: string) => {
    const iconClass = priority === 'high' ? 'text-red-500' : priority === 'medium' ? 'text-yellow-500' : 'text-blue-500';
    
    switch (type) {
      case 'certification':
        return <Award className={`h-4 w-4 ${iconClass}`} />;
      case 'job':
        return <Stethoscope className={`h-4 w-4 ${iconClass}`} />;
      case 'approval':
        return <CheckCircle className={`h-4 w-4 ${iconClass}`} />;
      case 'expiring':
        return <Clock className={`h-4 w-4 ${iconClass}`} />;
      case 'shift':
        return <Calendar className={`h-4 w-4 ${iconClass}`} />;
      case 'completion':
        return <CheckCircle className={`h-4 w-4 ${iconClass}`} />;
      case 'payment':
        return <DollarSign className={`h-4 w-4 ${iconClass}`} />;
      case 'system':
        return <Shield className={`h-4 w-4 ${iconClass}`} />;
      default:
        return <Bell className={`h-4 w-4 ${iconClass}`} />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">High</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">Medium</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Low</Badge>;
    }
  };

  const getNotificationBgColor = (notification: Notification) => {
    if (!notification.isRead) {
      return notification.priority === 'high' 
        ? 'bg-red-50 border-red-200' 
        : notification.priority === 'medium'
        ? 'bg-yellow-50 border-yellow-200'
        : 'bg-blue-50 border-blue-200';
    }
    return 'bg-gray-50 border-gray-200';
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] p-0">
        <DialogHeader className="p-6 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
              {unreadCount > 0 && (
                <Badge className="ml-2">
                  {unreadCount} unread
                </Badge>
              )}
            </DialogTitle>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
          </div>
        </DialogHeader>
        
        <ScrollArea className="max-h-96 p-6">
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto opacity-50 mb-4" />
                <p>No notifications</p>
                <p className="text-sm">You're all caught up!</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <Card key={notification.id} className={`${getNotificationBgColor(notification)} transition-colors`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type, notification.priority)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className={`text-sm font-medium ${!notification.isRead ? 'font-semibold' : ''}`}>
                                {notification.title}
                              </h4>
                              {getPriorityBadge(notification.priority)}
                              {notification.actionRequired && (
                                <Badge variant="outline" className="text-xs bg-orange-100 text-orange-800">
                                  Action Required
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {notification.timestamp}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            {!notification.isRead && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => markAsRead(notification.id)}
                                className="h-6 w-6 p-0"
                              >
                                <CheckCircle className="h-3 w-3" />
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => deleteNotification(notification.id)}
                              className="h-6 w-6 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        {notification.actionRequired && (
                          <div className="flex gap-2 mt-3">
                            {notification.type === 'job' && (
                              <Button size="sm" className="h-7 text-xs">
                                View Visit
                              </Button>
                            )}
                            {notification.type === 'expiring' && (
                              <Button size="sm" className="h-7 text-xs">
                                Upload Document
                              </Button>
                            )}
                            {notification.type === 'approval' && (
                              <Button size="sm" className="h-7 text-xs">
                                Review Details
                              </Button>
                            )}
                            {notification.type === 'certification' && userRole === 'admin' && (
                              <Button size="sm" className="h-7 text-xs">
                                Review Credentials
                              </Button>
                            )}
                            {notification.type === 'system' && (
                              <Button size="sm" className="h-7 text-xs">
                                Take Action
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
        
        <div className="border-t p-4 text-center">
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
            View All Notifications
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}