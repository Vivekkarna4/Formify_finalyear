import { Pen, Share, Star, User2, BarChart, Link } from "lucide-react";
import React from "react";
import SectionBadge from "./SectionBadge";

const StepsSection = () => {
  const stepsList = [
    {
      title: "Sign up or Login",
      description:
        "Create an account or log in to start using our AI-powered form generator.",
      icon: <User2 size={24} />,
    },
    {
      title: "Describe Your Form",
      description:
        "Enter a brief description, and our AI will generate a template.",
      icon: <Pen size={24} />,
    },
    {
      title: "Customize & Refine",
      description: "Use drag-and-drop tools to tweak fields and layout.",
      icon: <Star size={24} />,
    },
    {
      title: "Share & Collect Responses",
      description:
        "Publish your form and start collecting responses instantly.",
      icon: <Share size={24} />,
    },
    {
      title: "Analyze Responses",
      description: "Gain insights from real-time analytics and reports.",
      icon: <BarChart size={24} />,
    },
    {
      title: "Download Responses",
      description: "Download the responses in multiple formats.",
      icon: <Link size={24} />,
    },
  ];

  return (
    <section className="relative py-8 md:py-16">
      <div className="flex flex-col gap-8 items-center">
        <div className="flex flex-col gap-3 items-center w-full text-center">
          <SectionBadge title={"Steps"} />
          <h3 className="text-3xl font-semibold">
            Why Choose <span className="text-primary">Formify AI</span>
          </h3>
          <p className="text-md text-muted-foreground">
            Explore the list of features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {stepsList.map((step, index) => (
            <div
              key={index}
              className="flex flex-col gap-3  bg-background p-6 rounded-xl  border hover:bg-muted/10"
            >
              <div className=" p-3 bg-primary/20 w-fit rounded-lg text-primary">
                {step.icon}
              </div>
              <h2 className="text-xl font-semibold">{step.title}</h2>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StepsSection;
