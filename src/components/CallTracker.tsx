import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2, Edit2, Phone, RotateCcw } from 'lucide-react';
import { useCallTracker } from '@/hooks/useCallTracker';
import { CallOutcome } from '@/types/call-tracker';
import { cn } from '@/lib/utils';

const CALL_OUTCOMES: { value: CallOutcome; label: string; color: string }[] = [
  { value: 'yes-needs-confirmation', label: 'Yes (Needs Confirmation)', color: 'bg-success hover:bg-success-light' },
  { value: 'confirmed-sale', label: 'Confirmed Sale', color: 'bg-success hover:bg-success-light' },
  { value: 'no', label: 'No', color: 'bg-danger hover:bg-danger-light' },
  { value: 'absolutely-no', label: 'Absolutely No', color: 'bg-danger hover:bg-danger-light' },
  { value: 'hangup', label: 'Hangup', color: 'bg-neutral hover:bg-neutral-light' },
  { value: 'call-later', label: 'Call Later', color: 'bg-info hover:bg-info-light' },
  { value: 'call-in-2-months', label: 'Call in 2 Months', color: 'bg-info hover:bg-info-light' },
  { value: 'sickness-medicine', label: 'Sickness/Medicine', color: 'bg-warning hover:bg-warning-light' },
  { value: 'already-customer', label: 'Already a Customer', color: 'bg-warning hover:bg-warning-light' },
  { value: 'not-enough-money', label: 'Not Enough Money', color: 'bg-warning hover:bg-warning-light' },
  { value: 'language-difficulties', label: 'Language Difficulties', color: 'bg-warning hover:bg-warning-light' },
  { value: 'wrong-number', label: 'Wrong Number', color: 'bg-neutral hover:bg-neutral-light' },
  { value: 'dnc', label: 'DNC (Do Not Call)', color: 'bg-neutral hover:bg-neutral-light' },
];

export const CallTracker: React.FC = () => {
  const { calls, addCall, updateCall, deleteCall, startNewSession, stats } = useCallTracker();
  const [notes, setNotes] = useState('');
  const [editingCall, setEditingCall] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState('');

  const handleAddCall = (outcome: CallOutcome) => {
    addCall(outcome, notes.trim() || undefined);
    setNotes('');
  };

  const handleUpdateCall = (callId: string, outcome: CallOutcome) => {
    updateCall(callId, outcome, editNotes.trim() || undefined);
    setEditingCall(null);
    setEditNotes('');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getOutcomeConfig = (outcome: CallOutcome) => {
    return CALL_OUTCOMES.find(config => config.value === outcome) || CALL_OUTCOMES[0];
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Call Tracker</h1>
              <p className="text-muted-foreground">Track your call outcomes and performance</p>
            </div>
          </div>
          <Button 
            onClick={startNewSession}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            New Session
          </Button>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Calls</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalCalls}</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Confirmed Sales</p>
                  <p className="text-2xl font-bold text-success">{stats.confirmedSales}</p>
                </div>
                <div className="p-2 bg-success/10 rounded-lg">
                  <div className="h-5 w-5 bg-success rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Yes Ratio</p>
                  <p className="text-2xl font-bold text-success">{stats.yesRatio.toFixed(1)}%</p>
                </div>
                <div className="p-2 bg-success/10 rounded-lg">
                  <div className="h-5 w-5 bg-success rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Engagement Ratio</p>
                  <p className="text-2xl font-bold text-info">{stats.engagementRatio.toFixed(1)}%</p>
                </div>
                <div className="p-2 bg-info/10 rounded-lg">
                  <div className="h-5 w-5 bg-info rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Call Logging Panel */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Log Call Outcome</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {CALL_OUTCOMES.map((outcome) => (
                    <Button
                      key={outcome.value}
                      onClick={() => handleAddCall(outcome.value)}
                      className={cn(
                        outcome.color,
                        "text-white font-medium transition-all duration-200 hover:scale-105"
                      )}
                    >
                      {outcome.label}
                    </Button>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Notes (Optional)
                  </label>
                  <Textarea
                    placeholder="Add any additional notes about this call..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="resize-none"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Call History Panel */}
          <div className="space-y-4">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Call History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {calls.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No calls logged yet. Start making calls!
                    </p>
                  ) : (
                    calls.map((call) => {
                      const config = getOutcomeConfig(call.outcome);
                      return (
                        <div
                          key={call.id}
                          className="flex items-center justify-between p-3 border rounded-lg bg-card hover:shadow-sm transition-shadow"
                        >
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge className={cn(config.color, "text-white")}>
                                {config.label}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatTime(call.timestamp)}
                              </span>
                            </div>
                            {call.notes && (
                              <p className="text-sm text-muted-foreground">
                                {call.notes}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditingCall(call.id);
                                    setEditNotes(call.notes || '');
                                  }}
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Call</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-2">
                                    {CALL_OUTCOMES.map((outcome) => (
                                      <Button
                                        key={outcome.value}
                                        onClick={() => handleUpdateCall(call.id, outcome.value)}
                                        className={cn(
                                          outcome.color,
                                          "text-white font-medium text-xs"
                                        )}
                                        size="sm"
                                      >
                                        {outcome.label}
                                      </Button>
                                    ))}
                                  </div>
                                  <Textarea
                                    placeholder="Notes..."
                                    value={editNotes}
                                    onChange={(e) => setEditNotes(e.target.value)}
                                    rows={3}
                                  />
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteCall(call.id)}
                              className="text-danger hover:text-danger hover:bg-danger/10"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};