import { cache } from "react";
import { isCartLine } from "@/lib/share-copy";
import { createClient } from "@/lib/supabase/server";

export const getSharedCartItems = cache(async (id: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_shared_cart", {
    p_id: id,
  });

  if (error || data == null) {
    return [];
  }

  return Array.isArray(data) ? data.filter(isCartLine) : [];
});
