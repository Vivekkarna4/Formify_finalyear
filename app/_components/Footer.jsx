import React from "react";

const Footer = () => {
  return (
    <footer className="relative py-16 md:py-24 overflow-hidden ">
      <div
        className="flex flex-col items-center gap-3 z-10
      "
      >
        <img src="logo-icon.svg" className="w-16" alt="" />
        <div className="text-center flex flex-col gap-2">
          <h3 className="text-2xl font-bold  ">Formify AI</h3>
          <p className="text-muted-foreground">
            A Solution to create forms in Minutes
          </p>
          <p className="text-muted-foreground">© 2025 | All Rights Reserved.</p>
        </div>
      </div>
      <div className="absolute rotate-180 -bottom-40 left-0 right-0 flex justify-center z-0">
        <img
          src="/overlay.svg"
          alt="Overlay Background"
          className="opacity-40 animate-pulse w-[800px]"
        />
      </div>
    </footer>
  );
};

export default Footer;
