import { Task } from "@/db/schema";
import { clsx, type ClassValue } from "clsx";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, Circle, PlayCircle } from "lucide-react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatRelativeTime = (date: Date): string => {
  const diffInSeconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";

  return formatDistanceToNow(date, { addSuffix: true });
};

export const isOverdue = (dueDate: Date | null): boolean => {
  if (!dueDate) return false;
  return new Date() > dueDate;
};

export const getPriorityColor = (priority: Task["priority"]) => {
  switch (priority) {
    case "High":
      return "text-destructive";
    case "Medium":
      return "text-blue-600";
    case "Low":
      return "text-green-600";
  }
};

export const getStatusIcon = (status: Task["status"]) => {
  switch (status) {
    case "Todo":
      return <Circle className="h-3 w-3" />;
    case "In Progress":
      return <PlayCircle className="h-3 w-3 text-blue-500" />;
    case "Done":
      return <CheckCircle2 className="h-3 w-3 text-green-500" />;
  }
};

export type CreateTaskAction = {
  actionType: "create";
  taskId: number;
  text: string;
  completed: boolean;
  priority: "Low" | "Medium" | "High";
  status: "Todo" | "In Progress" | "Done";
  order: number;
  dueDate: Date;
};

export type UpdateTaskAction = {
  actionType: "update";
  taskId: number;
  before: Partial<Omit<CreateTaskAction, "actionType">>;
  after: Partial<Omit<CreateTaskAction, "actionType">>;
};

export type DeleteTaskAction = CreateTaskAction & { actionType: "delete" };

export type ReorderAction = {
  actionType: "reorder";
  before: { id: number; order: number }[];
  after: { id: number; order: number }[];
};

export type UserAction =
  | CreateTaskAction
  | UpdateTaskAction
  | DeleteTaskAction
  | ReorderAction;
