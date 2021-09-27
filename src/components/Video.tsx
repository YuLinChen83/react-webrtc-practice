import React from "react";
import clsx from "clsx";

export const Video = React.forwardRef(
  (
    {
      className,
      ...props
    }: {
      className?: string;
      muted: boolean;
    },
    ref: React.LegacyRef<HTMLVideoElement> | undefined
  ) => (
    <div
      className={clsx(
        "w-full sm:w-1/2 overflow-hidden rounded-lg flex-initial sm:flex-1 relative pt-3/4 sm:pt-3/4m",
        className
      )}
    >
      <video ref={ref} autoPlay playsInline {...props} className="object-center object-cover absolute top-0"/>
    </div>
  )
);
