"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import React from "react";

const FeatureCard = ({
  featureName,
  featureDescription,
  featureImgDark,
  featureImgLight,
}) => {
  const { theme } = useTheme();
  return (
    <div className="relative group border backdrop-blur-sm  p-5 rounded-2xl min-h-[280px] aspect-square overflow-hidden">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">{featureName}</h2>
        <p className="text-md text-muted-foreground">{featureDescription}</p>
      </div>
      <div className="absolute -bottom-40 md:-bottom-12  -right-4 border rounded-xl overflow-hidden rotate-3 group-hover:rotate-0 transition-all duration-700 ease-out ">
        <Image
          src={theme === "dark" ? featureImgDark : featureImgDark}
          width={320}
          height={320}
          alt=""
        />
      </div>
      <div className="bottom-[-400] left-[50%] group-hover:opacity-100 opacity-0 z-[-1] absolute bg-gradient-to-t from-primary to-primary/80  blur-3xl rounded-xl transition-all translate-x-[-50%] duration-700 ease-out w-[400px] h-[400px] rotate-[54deg]"></div>
    </div>
  );
};

export default FeatureCard;
