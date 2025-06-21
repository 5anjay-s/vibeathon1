
'use client';

import { useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { sendSmsAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const initialState = {
  success: false,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Send Message
    </Button>
  );
}

export default function SmsInterface() {
  const { toast } = useToast();
  const [state, formAction] = useFormState(sendSmsAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      toast({
        title: 'Success!',
        description: 'The SMS has been sent.',
      });
      formRef.current?.reset();
    } else if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    }
  }, [state, toast]);

  return (
    <div className="flex justify-center items-start pt-0 md:pt-8">
        <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
            <CardTitle>Send an SMS</CardTitle>
            <CardDescription>
            Compose and send a message directly from the app.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form ref={formRef} action={formAction} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="phoneNumberSms">Phone Number</Label>
                    <Input
                        id="phoneNumberSms"
                        name="phoneNumber"
                        placeholder="e.g. +15551234567"
                        required
                        type="tel"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="messageSms">Message</Label>
                    <Textarea
                        id="messageSms"
                        name="message"
                        placeholder="Enter your message here..."
                        required
                        className="min-h-[120px]"
                    />
                </div>
                <SubmitButton />
            </form>
        </CardContent>
        </Card>
    </div>
  );
}
