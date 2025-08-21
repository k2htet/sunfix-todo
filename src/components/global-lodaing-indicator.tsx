"use client";
import { useIsFetching } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export default function GlobalLoadingIndicator() {
  const isFetching = useIsFetching();

  return isFetching ? (
    <Loader2 className="h-4 w-4 animate-spin mx-auto mb-3" />
  ) : null;
}
