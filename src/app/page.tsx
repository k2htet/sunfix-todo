import { ErrorBoundary } from "react-error-boundary";

import { Suspense } from "react";

import { getSession } from "@/lib/auth";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import { LoginForm } from "@/components/auth/login-form";
import Todo from "@/components/todo";
import { ModeToggle } from "@/components/mode-toggle";
import { TodoSkeleton } from "@/components/todo-skeletion";
import { Separator } from "@/components/ui/separator";
import type { SearchParams } from "nuqs/server";
import { searchParamsCache } from "@/lib/searchParams";
import StatusDropdown from "@/components/status-dropdown";
import SignOutButton from "@/components/sign-out";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

const LandingPage = async ({ searchParams }: PageProps) => {
  const { filter } = await searchParamsCache.parse(searchParams);
  const session = await getSession();
  prefetch(trpc.task.getAllTasks.queryOptions(filter));

  return (
    <div className="bg-background flex min-h-svh flex-col mx-auto max-w-md relative">
      {session?.user ? (
        <div className=" h-full w-full flex-1 px-4 py-3 relative pt-10">
          <div className="fixed inset-x-0 top-0 z-30">
            <div className="flex justify-between items-center gap-3 relative mx-auto max-w-md px-4 py-2 bg-background">
              <h1 className="text-2xl font-bold ">Sunfix</h1>
              <div className="h-9 flex items-center gap-x-1.5">
                <StatusDropdown />
                <ModeToggle />
                <Separator orientation="vertical" />
                <SignOutButton />
              </div>
            </div>
          </div>
          <Separator className="mt-3" />
          <HydrateClient>
            <ErrorBoundary fallback={<div>There was an error</div>}>
              <Suspense fallback={<TodoSkeleton />}>
                <Todo />
              </Suspense>
            </ErrorBoundary>
          </HydrateClient>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-end gap-6">
          <LoginForm />
        </div>
      )}
    </div>
  );
};

export default LandingPage;
