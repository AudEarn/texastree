"use client";

import React from "react";
import { TooltipProvider } from "../ui/tooltip";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="client-wrapper">
      <TooltipProvider>
        {/* You can wrap the children with any UI elements */}
        {children}
      </TooltipProvider>
    </div>
  );
}
