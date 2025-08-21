"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

const SignOutButton = () => {
  const router = useRouter();
  return (
    <Button
      size={"icon"}
      variant="outline"
      onClick={async () =>
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.replace("/");
            },
          },
        })
      }
    >
      <LogOut className=" h-[1.2rem] w-[1.2rem]" />
    </Button>
  );
};

export default SignOutButton;
