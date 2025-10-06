import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Shield, 
  GraduationCap, 
  Heart,
  Upload,
  Play,
  Award
} from "lucide-react";

interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending' | 'required';
  category: 'documents' | 'training' | 'verification';
  icon: React.ComponentType<any>;
  estimatedTime?: string;
  dueDate?: string;
  priority: 'high' | 'medium' | 'low';
}

const onboardingTasks: OnboardingTask[] = [
  // High Priority - Required for first job
  {
    id: 'license-verification',
    title: 'License Verification',
    description: 'State nursing license verification in progress',
    status: 'in-progress',
    category: 'verification',
    icon: Shield,
    estimatedTime: '24-48 hours',
    priority: 'high'
  },
  {
    id: 'background-check',
    title: 'Background Check',
    description: 'Criminal background and reference verification',
    status: 'in-progress',
    category: 'verification',
    icon: Shield,
    estimatedTime: '3-5 business days',
    priority: 'high'
  },
  {
    id: 'hipaa-training',
    title: 'HIPAA Privacy Training',
    description: 'Complete mandatory HIPAA privacy and security training',
    status: 'required',
    category: 'training',
    icon: GraduationCap,
    estimatedTime: '30 minutes',
    dueDate: '2025-09-25',
    priority: 'high'
  },
  {
    id: 'iv-certification',
    title: 'IV Therapy Certification Upload',
    description: 'Upload current IV therapy certification documents',
    status: 'required',
    category: 'documents',
    icon: FileText,
    estimatedTime: '5 minutes',
    dueDate: '2025-09-23',
    priority: 'high'
  },
  // Medium Priority - Recommended before first job
  {
    id: 'infusion-training',
    title: 'Platform Infusion Training',
    description: 'Learn platform-specific infusion protocols and procedures',
    status: 'pending',
    category: 'training',
    icon: GraduationCap,
    estimatedTime: '45 minutes',
    priority: 'medium'
  },
  {
    id: 'emergency-protocols',
    title: 'Emergency Response Protocols',
    description: 'Review emergency procedures for home-based care',
    status: 'pending',
    category: 'training',
    icon: AlertTriangle,
    estimatedTime: '20 minutes',
    priority: 'medium'
  },
  {
    id: 'documentation-training',
    title: 'Visit Documentation Training',
    description: 'Learn how to complete visit documentation in the app',
    status: 'pending',
    category: 'training',
    icon: FileText,
    estimatedTime: '15 minutes',
    priority: 'medium'
  },
  // Low Priority - Optional enhancements
  {
    id: 'oncology-cert',
    title: 'Oncology Certification (Optional)',
    description: 'Upload OCN or other oncology certifications for specialized visits',
    status: 'pending',
    category: 'documents',
    icon: Award,
    estimatedTime: '5 minutes',
    priority: 'low'
  },
  {
    id: 'customer-service',
    title: 'Patient Communication Best Practices',
    description: 'Training on effective patient communication and care',
    status: 'pending',
    category: 'training',
    icon: Heart,
    estimatedTime: '25 minutes',
    priority: 'low'
  }
];

interface NurseOnboardingTasksProps {
  onTaskComplete?: (taskId: string) => void;
}

export function NurseOnboardingTasks({ onTaskComplete }: NurseOnboardingTasksProps) {
  const [tasks, setTasks] = useState(onboardingTasks);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'required':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string, priority: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'in-progress':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'required':
        return <Badge variant="destructive">Required</Badge>;
      default:
        return priority === 'high' ? 
          <Badge variant="outline" className="border-orange-300 text-orange-600">Recommended</Badge> :
          <Badge variant="outline">Optional</Badge>;
    }
  };

  const handleStartTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: 'in-progress' as const } : task
    ));
  };

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;
  const requiredTasks = tasks.filter(task => task.status === 'required').length;
  const readyForFirstJob = tasks.filter(task => task.priority === 'high' && task.status !== 'completed').length === 0;

  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder = { 'high': 0, 'medium': 1, 'low': 2 };
    const statusOrder = { 'required': 0, 'in-progress': 1, 'pending': 2, 'completed': 3 };
    
    if (a.status !== b.status) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="space-y-6">
      {/* Header and Progress */}
      <div>
        <h2 className="text-2xl font-semibold">Onboarding Tasks</h2>
        <p className="text-muted-foreground">Complete these tasks to start accepting patient visits</p>
      </div>

      {/* Progress Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Overall Progress</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}/{totalTasks}</div>
            <p className="text-xs text-muted-foreground">Tasks completed</p>
            <Progress value={(completedTasks / totalTasks) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Required Tasks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{requiredTasks}</div>
            <p className="text-xs text-muted-foreground">Need immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Job Readiness</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${readyForFirstJob ? 'text-green-600' : 'text-orange-600'}`}>
              {readyForFirstJob ? 'Ready!' : 'Pending'}
            </div>
            <p className="text-xs text-muted-foreground">
              {readyForFirstJob ? 'Can accept first job' : 'Complete required tasks'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Ready Status Alert */}
      {readyForFirstJob ? (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            🎉 Congratulations! You've completed all required onboarding tasks and can now accept your first patient visit.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Complete {tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length} more high-priority tasks to become eligible for your first patient visit.
          </AlertDescription>
        </Alert>
      )}

      {/* Task Categories */}
      <div className="space-y-6">
        {/* Required/High Priority Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              High Priority Tasks
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              These tasks must be completed before you can accept your first patient visit
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedTasks.filter(task => task.priority === 'high').map((task) => {
                const Icon = task.icon;
                return (
                  <div key={task.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      {getStatusIcon(task.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <h4 className="font-medium">{task.title}</h4>
                        {getStatusBadge(task.status, task.priority)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{task.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {task.estimatedTime && (
                          <span>⏱️ {task.estimatedTime}</span>
                        )}
                        {task.dueDate && (
                          <span className="text-red-600">📅 Due: {task.dueDate}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {task.status === 'completed' ? (
                        <Button variant="outline" size="sm" disabled>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Completed
                        </Button>
                      ) : task.status === 'in-progress' ? (
                        <Button variant="outline" size="sm" disabled>
                          <Clock className="h-4 w-4 mr-2" />
                          Processing...
                        </Button>
                      ) : task.category === 'training' ? (
                        <Button size="sm" onClick={() => handleStartTask(task.id)}>
                          <Play className="h-4 w-4 mr-2" />
                          Start Training
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => handleStartTask(task.id)}>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Documents
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recommended Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-blue-500" />
              Recommended Tasks
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Complete these tasks to enhance your profile and get priority for premium visits
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedTasks.filter(task => task.priority === 'medium').map((task) => {
                const Icon = task.icon;
                return (
                  <div key={task.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      {getStatusIcon(task.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <h4 className="font-medium">{task.title}</h4>
                        {getStatusBadge(task.status, task.priority)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{task.description}</p>
                      {task.estimatedTime && (
                        <span className="text-xs text-muted-foreground">⏱️ {task.estimatedTime}</span>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      {task.status === 'completed' ? (
                        <Button variant="outline" size="sm" disabled>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Completed
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => handleStartTask(task.id)}>
                          <Play className="h-4 w-4 mr-2" />
                          Start
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Optional Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-green-500" />
              Optional Enhancements
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              These tasks can help you qualify for specialized, higher-paying visits
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedTasks.filter(task => task.priority === 'low').map((task) => {
                const Icon = task.icon;
                return (
                  <div key={task.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      {getStatusIcon(task.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <h4 className="font-medium">{task.title}</h4>
                        {getStatusBadge(task.status, task.priority)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{task.description}</p>
                      {task.estimatedTime && (
                        <span className="text-xs text-muted-foreground">⏱️ {task.estimatedTime}</span>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      {task.status === 'completed' ? (
                        <Button variant="outline" size="sm" disabled>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Completed
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => handleStartTask(task.id)}>
                          <Play className="h-4 w-4 mr-2" />
                          Start
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Having trouble with any of these tasks? Our support team is here to help.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              📧 Email Support
            </Button>
            <Button variant="outline" size="sm">
              💬 Live Chat
            </Button>
            <Button variant="outline" size="sm">
              📞 Call Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}