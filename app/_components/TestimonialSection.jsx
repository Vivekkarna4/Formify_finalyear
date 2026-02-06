import { Quote } from "lucide-react";
import React from "react";

const TestimonialSection = () => {
  const testimonialList = [
    {
      title: "AI-Powered Form Creation",
      description:
        "Say goodbye to manual form-building. Our AI-powered generator helps you create customized, user-friendly forms instantly.",
      username: "Mark Smith, Business Owner",
    },
    {
      title: "Seamless Customization",
      description:
        "I was able to tailor my forms exactly how I wanted with an intuitive drag-and-drop interface. Highly recommended!",
      username: "Sarah Johnson, Marketing Manager",
    },
    {
      title: "Efficient Response Management",
      description:
        "Analyzing form responses has never been easier. The dashboard provides clear insights and export options.",
      username: "David Lee, Data Analyst",
    },
    {
      title: "Time-Saving Templates",
      description:
        "The template gallery saved me so much time! I found the perfect survey template and launched it in minutes.",
      username: "Emily White, Event Coordinator",
    },
  ];
  return (
    <section className="relative py-8 md:py-16 bg-primary/5 rounded-3xl px-5 md:px-0">
      <div className="flex flex-col gap-8 items-center">
        <div className="flex flex-col w-full text-center">
          <h3 className="text-3xl font-semibold">
            Why Choose <span className="text-primary">Formify AI</span>
          </h3>
          <p className="text-md text-muted-foreground">
            Explore the list of features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto ">
          {testimonialList.map((review, index) => (
            <div
              className="relative border p-5 flex flex-col gap-4 rounded-xl bg-background"
              key={index}
            >
              <Quote className="absolute right-5 text-primary rotate-3" />
              <div className="flex flex-col gap-2">
                <p className="text-xl font-semibold">{review.title}</p>
                <p className="text-muted-foreground">{review.description}</p>
              </div>

              <p className="italic">- {review.username}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
