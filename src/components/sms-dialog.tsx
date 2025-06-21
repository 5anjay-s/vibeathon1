
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useFormState, useFormStatus } from 'react-dom';
import { sendSmsAction } from '@/app/actions';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

type SmsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: string;
};

const initialState = {
  success: false,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Send SMS
    </Button>
  );
}

export function SmsDialog({ open, onOpenChange, message }: SmsDialogProps) {
  const { toast } = useToast();
  const [state, formAction] = useFormState(sendSmsAction, initialState);

  useEffect(() => {
    if (state.success) {
      toast({
        title: 'Success!',
        description: 'The SMS has been sent.',
      });
      onOpenChange(false);
    } else if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    }
  }, [state, toast, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send via SMS</DialogTitle>
          <DialogDescription>
            Enter a phone number to send this message to. Include the country code.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <div className="grid gap-4 py-4">
            <Card className="bg-muted">
              <CardContent className="p-3 text-sm text-muted-foreground whitespace-pre-wrap max-h-48 overflow-y-auto">
                {message}
              </CardContent>
            </Card>
            <input type="hidden" name="message" value={message} />
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                id="phoneNumber"
                name="phoneNumber"
                placeholder="e.g. +15551234567"
                className="col-span-4"
                required
                type="tel"
              />
            </div>
          </div>
          <DialogFooter>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
