"use client";

import React from "react";
import Image from "next/image";

const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <div className="relative flex items-center justify-center">
        {/* Loading Circle */}
        <div className="animate-spin rounded-full border-4 border-primary border-t-transparent w-24 h-24"></div>

        {/* Logo Icon in the Center */}
        <div className="absolute">
          <Image
            src="/logo-icon.svg" // Replace with your logo path
            alt="Loading..."
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Loading;
