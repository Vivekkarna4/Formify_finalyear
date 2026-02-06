import React from "react";

const ResponseStatItem = ({ label, value, icon: Icon }) => {
  return (
    <div className="flex items-center gap-3 p-4 border rounded-xl w-full">
      {Icon && (
        <div className="flex justify-center items-center rounded-xl p-3 bg-primary/20">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      )}
      <div>
        <p className="text-sm font-medium break-words text-muted-foreground">
          {label}
        </p>
        <h1 className="text-xl font-semibold break-words">{value}</h1>
      </div>
    </div>
  );
};

export default ResponseStatItem;
