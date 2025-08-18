"use client";

import { useRouter } from "next/navigation";
import React, { memo, useEffect, useState } from "react";
import { useWindowSize } from "usehooks-ts";

import { SidebarToggle } from "@/components/sidebar-toggle";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "./icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useSidebar } from "./ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { WalletConnect } from "./wallet-connect";

function PureChatHeader({
  chatId,
  isReadonly,
  session,
  selectedChatModel,
  onSelectChatModel,
}: {
  chatId: string;
  isReadonly: boolean;
  session: any;
  selectedChatModel: string;
  onSelectChatModel: (id: string) => void;
}) {
  const router = useRouter();
  const { open } = useSidebar();

  const { width: windowWidth } = useWindowSize();

  const [models, setModels] = useState<
    Array<{
      id: string;
      name: string;
      description: string;
      reasoning?: boolean;
    }>
  >([]);
  const [loadingModels, setLoadingModels] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoadingModels(true);
        const res = await fetch("/api/models", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!active) return;
        setModels(data.models || []);
      } catch {
      } finally {
        if (active) setLoadingModels(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2">
      <SidebarToggle />

      {(!open || windowWidth < 768) && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="order-2 md:order-1 md:px-2 px-2 md:h-fit ml-auto md:ml-0"
              onClick={() => {
                router.push("/");
                router.refresh();
              }}
            >
              <PlusIcon />
              <span className="md:sr-only">New Chat</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>New Chat</TooltipContent>
        </Tooltip>
      )}

      {/* Model selector */}
      {!isReadonly && (
        <div className="order-3 min-w-[220px]">
          <Select
            value={selectedChatModel}
            onValueChange={async (value) => {
              onSelectChatModel(value);
              try {
                await fetch("/api/chat-model", {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify({ model: value }),
                });
              } catch {}
            }}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  loadingModels ? "Loading models..." : "Select model"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {models.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.name} {m.reasoning ? "(Reasoning)" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="order-4 md:ml-auto">
        <WalletConnect />
      </div>
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
  // Always allow re-render; dropdown needs updates on state changes
  return false;
});
