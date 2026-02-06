"use client";

import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { AuroraText } from "@/components/magicui/aurora-text";
import HeroVideoDialog from "@/components/magicui/hero-video-dialog";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React from "react";

const Hero = () => {
  const { user } = useUser(); // Get user authentication state
  const router = useRouter();

  const handleClick = () => {
    if (user) {
      router.push("/create"); // Redirect to /create if signed in
    } else {
      router.push("/sign-in"); // Redirect to sign-in if not signed in
    }
  };

  return (
    <section className="relative py-8 md:py-16">
      <div className="absolute top-0 left-0 right-0 flex justify-center z-0">
        <img
          src="/overlay.svg"
          alt="Overlay Background"
          className="opacity-40 animate-pulse w-[800px]"
        />
      </div>
      <div className="relative w-full">
        <div className="flex flex-col gap-6 items-center mt-6">
          <div className="border border-foreground/10 bg-background/20 backdrop-blur-lg rounded-badge">
            <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:bg-muted-foreground hover:duration-300">
              <span>✨ Introducing Formify AI</span>
            </AnimatedShinyText>
          </div>

          <div className="flex flex-col items-center gap-4 text-center max-w-xl">
            <h1 className="text-4xl md:text-6xl font-bold">
              Create Smart Forms in Minutes with{" "}
              <AuroraText> Formify</AuroraText>
            </h1>
            <p className="text-muted-foreground max-w-xl">
              Say goodbye to manual form-building. Our AI-powered form generator
              helps you create customized, user-friendly forms instantly.
            </p>
          </div>

          {/* Button with Authentication Check */}
          <div>
            <Button onClick={handleClick}>Create Your First AI Form</Button>
          </div>

          <div>
            <HeroVideoDialog
              className="max-w-2xl"
              animationStyle="from-center"
              videoSrc="https://www.youtube.com/embed/jCmCJgUo0Ks"
              thumbnailSrc="/dashboard.png"
              thumbnailAlt="Hero Video"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
