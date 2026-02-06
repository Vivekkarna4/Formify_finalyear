"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import TemplateList from "../templates/_comonents/TemplateList";
import PromptInput from "../_components/PromptInput";
import { ProtectedPage } from "../_components/Protected";

const promptMessage = [
  {
    id: 1,
    prompt:
      "Create a job application form with fields for personal information, work experience, education, and references.",
    title: "Job Application",
  },
  {
    id: 2,
    prompt:
      "Create a registration form with fields for name, email, password, and profile picture.",
    title: "Registration Form",
  },
  {
    id: 3,
    prompt:
      "Create a course exit form with fields for student details, course completion status, and feedback.",
    title: "Course Exit Form",
  },
  {
    id: 4,
    prompt:
      "Create a feedback form with fields for rating, comments, and contact information.",
    title: "Feedback Form",
  },
  {
    id: 5,
    prompt:
      "Create a customer support form with fields for issue description, priority level, and contact details.",
    title: "Customer Support Form",
  },
];

const Create = () => {
  const router = useRouter();
  const [selectedPrompt, setSelectedPrompt] = useState("");

  return (
    <ProtectedPage>
      <section className="relative">
        <div className="absolute top-0 left-0 right-0 flex justify-center z-0">
          <img
            src="/overlay.svg"
            alt="Overlay Background"
            className="opacity-40 animate-pulse w-[800px]"
          />
        </div>

        <div className="relative z-10 max-w-[1376px] mx-auto p-4 md:p-8">
          <div className="flex flex-col items-center gap-6 md:gap-8 max-w-4xl min-h-screen mx-auto">
            {/* Header Section */}
            <div className="flex flex-col items-center gap-6">
              <div className="flex flex-col items-center gap-4 text-center mt-4 max-w-lg">
                <Image
                  src="/logo-icon.svg"
                  className="rotate-6"
                  alt="logo"
                  width={48}
                  height={48}
                  priority
                />
                <h1 className="text-4xl md:text-5xl font-semibold">
                  Create a form with{" "}
                  <span className="text-primary">Formify</span> in Minutes
                </h1>
              </div>
              <PromptInput prompt={selectedPrompt} />
            </div>

            {/* Prompt Buttons */}
            <div className="flex flex-wrap justify-center gap-4 w-full">
              {promptMessage.map((item) => (
                <Button
                  key={item.id}
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => setSelectedPrompt(item.prompt)}
                >
                  {item.title}
                </Button>
              ))}
            </div>

            {/* Template List Section */}
            <div className="py-6 flex flex-col gap-6 w-full">
              <div className="flex justify-between items-center">
                <h1 className="text-base font-semibold">
                  Recently created Templates
                </h1>
                <Button
                  variant="outline"
                  className="border-none"
                  onClick={() => router.push("/templates")}
                >
                  View More
                </Button>
              </div>
              <TemplateList columns={3} limit={3} />
            </div>
          </div>
        </div>
      </section>
    </ProtectedPage>
  );
};

export default Create;
