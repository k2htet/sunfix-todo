"use client";

import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useState } from "react";

type WithDrawerProps = {
  closeDrawer: () => void;
};

const withDrawer = <P extends object>(
  WrappedComponent: React.ComponentType<P & WithDrawerProps>
) => {
  const WithDrawerComponent = ({
    trigger,
    ...props
  }: Omit<P, "closeDrawer"> & { trigger: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);

    const closeDrawer = () => setIsOpen(false);

    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>

        <DrawerContent className="max-w-md mx-auto">
          <DrawerTitle className="px-4">Add todo</DrawerTitle>
          <WrappedComponent {...(props as P)} closeDrawer={closeDrawer} />
        </DrawerContent>
      </Drawer>
    );
  };

  // Set a display name for easier debugging in React DevTools
  WithDrawerComponent.displayName = `withDrawer($
    {WrappedComponent.displayName || WrappedComponent.name || "Component"}
  )`;

  return WithDrawerComponent;
};

export default withDrawer;
