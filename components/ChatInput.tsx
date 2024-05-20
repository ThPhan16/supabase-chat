"use client";
import React from "react";
import { Input } from "./ui/input";
import { supabaseBrowserClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@/lib/store/user";
import { Imessage, useMessage } from "@/lib/store/messages";

export default function ChatInput() {
  const user = useUser((state) => state.user);
  const addMessage = useMessage((state) => state.addMessage);
  const setOptimisticIds = useMessage((state) => state.setOptimisticIds);

  const supabase = supabaseBrowserClient();

  const handleSendMessage = async (text: string) => {
    if (!user?.id || !user?.user_metadata) {
      toast.error("User not found!!!");
      return;
    }

    if (text.trim()) {
      const id = uuidv4();
      const newMessage: Imessage = {
        id,
        text,
        send_by: user.id,
        is_edit: false,
        created_at: new Date().toISOString(),
        profiles: {
          id: user.id,
          avatar_url: user.user_metadata.avatar_url,
          created_at: new Date().toISOString(),
          display_name: user.user_metadata.user_name,
        },
      };

      addMessage(newMessage);
      setOptimisticIds(newMessage.id);

      const { error } = await supabase.from("messages").insert({ text, id });
      if (error) {
        toast.error(error.message);
      }
    } else {
      toast.error("Message can not be empty!!");
    }
  };

  return (
    <div className="p-5">
      <Input
        placeholder="send message"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSendMessage(e.currentTarget.value);
            e.currentTarget.value = "";
          }
        }}
      />
    </div>
  );
}
