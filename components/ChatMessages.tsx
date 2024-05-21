"use client";
import { LIMIT_MESSAGE } from "@/lib/constant";
import { useMessage } from "@/lib/store/messages";
import { supabaseBrowserClient } from "@/utils/supabase/client";
import { Suspense, useEffect } from "react";
import { toast } from "sonner";
import ListMessages from "./ListMessages";

export default function ChatMessages() {
  const supabase = supabaseBrowserClient();

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*,profiles(*)")
      .range(0, LIMIT_MESSAGE)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error(error.message);
      return;
    }

    useMessage.setState({
      messages: data,
      hasMore: data?.length >= LIMIT_MESSAGE,
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Suspense fallback={"loading.."}>
      <ListMessages />
    </Suspense>
  );
}
