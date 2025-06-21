import ChatInterface from "@/components/chat-interface";
import { Globe } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="bg-card border-b p-4 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="p-2 bg-primary rounded-full text-primary-foreground">
                    <Globe className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-headline font-bold text-foreground">
                    Globetrotter AI
                </h1>
            </div>
            <p className="text-sm text-muted-foreground hidden md:block">Your AI-powered travel companion</p>
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        <div className="h-full container mx-auto py-4 md:py-8">
            <ChatInterface />
        </div>
      </main>
    </div>
  );
}
