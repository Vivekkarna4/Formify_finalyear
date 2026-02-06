import React from "react";
import FeatureCard from "./FeatureCard";
import SectionBadge from "./SectionBadge";

const FeatureSection = () => {
  const featuresList = [
    {
      name: "AI Form Creation",
      description:
        "Effortlessly generate smart forms using AI-powered automation. Just provide a brief description of your needs, and the system will create a fully structured form with relevant fields.",
      imgSrc: "/feature-img.png",
    },

    {
      name: "Form Customization",
      description:
        "Tailor forms to your specific requirements with drag-and-drop editing, custom field options, and multiple themes.",
      imgSrc: "/feature-img.png",
    },

    {
      name: "Form Template Gallery",
      description:
        "Access a curated collection of pre-designed form templates for various use cases, including surveys, feedback forms, registrations, and more. Easily customize and deploy them with a single click.",
      imgSrc: "/feature-img.png",
    },

    {
      name: "Response Management",
      description:
        "View and analyze form submissions in a structured dashboard with a response table and graphical representation. Easily export data for further processing.",
      imgSrc: "/feature-img.png",
    },
  ];
  return (
    <section className="relative py-8 md:py-16">
      <div className="flex flex-col gap-8 items-center">
        <div className="flex flex-col gap-3 w-full items-center text-center">
          <SectionBadge title={"Features"} />
          <h3 className="text-3xl font-semibold">
            Why Choose <span className="text-primary">Formify AI</span>
          </h3>
          <p className="text-md text-muted-foreground">
            Explore the list of features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto ">
          {featuresList.map((feature, index) => (
            <FeatureCard
              key={index}
              featureName={feature.name}
              featureDescription={feature.description}
              featureImgDark={feature.imgSrc}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
