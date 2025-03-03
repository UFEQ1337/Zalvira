/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Send, X, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  text: string;
  sender: "user" | "agent";
  timestamp: Date;
};

export function LiveChatButton() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      sender: "agent",
      text: "Witaj w Zalvira Casino! Jak możemy Ci pomóc?",
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const { user } = useAuth();

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Dodaj wiadomość użytkownika
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: newMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");

    // Symulacja odpowiedzi od agenta po 1 sekundzie
    setTimeout(() => {
      const agentMessage: Message = {
        id: `agent-${Date.now()}`,
        sender: "agent",
        text: "Dziękujemy za wiadomość. Nasz konsultant odpowie w ciągu kilku minut.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, agentMessage]);
    }, 1000);
  };

  return (
    <>
      <Button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg z-40"
        size="icon"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>

      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 z-40"
          >
            <Card className="shadow-xl border-primary-100 dark:border-primary-900">
              <CardHeader className="bg-primary-500 text-white rounded-t-lg py-3 px-4 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-medium">
                  Pomoc online
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleChat}
                  className="h-8 w-8 text-white hover:bg-primary-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-80 overflow-y-auto p-4 flex flex-col space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex items-start gap-2",
                        message.sender === "user" ? "flex-row-reverse" : ""
                      )}
                    >
                      <Avatar className="h-8 w-8 mt-1">
                        {message.sender === "agent" ? (
                          <AvatarImage src="/support-agent.png" alt="Agent" />
                        ) : (
                          <AvatarFallback className="bg-primary-100 text-primary-600">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div
                        className={cn(
                          "rounded-lg p-3 max-w-[80%]",
                          message.sender === "agent"
                            ? "bg-surface-light dark:bg-surface-dark"
                            : "bg-primary-500 text-white"
                        )}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-3 border-t">
                <form
                  onSubmit={sendMessage}
                  className="flex w-full items-center gap-2"
                >
                  <Input
                    placeholder="Napisz wiadomość..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!newMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
