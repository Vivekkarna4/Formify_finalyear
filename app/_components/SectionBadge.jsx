import React from "react";

const SectionBadge = ({ title }) => {
  return (
    <div className="px-4 py-1 rounded-badge border w-fit border-primary">
      <p className="text-sm font-semibold text-primary uppercase">{title}</p>
    </div>
  );
};

export default SectionBadge;
