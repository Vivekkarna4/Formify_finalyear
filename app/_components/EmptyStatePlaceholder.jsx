import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const EmptyStatePlaceholder = ({
  imageSrc,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <section className="flex flex-col items-center text-center gap-4 px-3 py-6 border rounded-xl">
      {imageSrc && (
        <Image src={imageSrc} alt="Empty state" width={200} height={200} />
      )}
      <div className="flex flex-col gap-1 w-full">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </section>
  );
};

export default EmptyStatePlaceholder;
