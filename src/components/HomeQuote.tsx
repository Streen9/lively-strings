import React, { useState } from "react";

const EnhancedHeader = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div className="w-full">
      <h1 className="text-4xl font-bold mb-6">
        <p></p>A Thread that feel&apos;s alive💗
        <br />
        <span className="text-primary">Lively Strings</span>
      </h1>
      <blockquote className="text-xl italic font-semibold text-black border-l-4 border-primary pl-4 mb-6">
        &ldquo;Every{" "}
        <span
          className={`relative transition-colors duration-300 ${
            isHovered ? "text-green-500" : "text-primary"
          }`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          thread
          {isHovered && (
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary animate-pulse"></span>
          )}
        </span>{" "}
        connects us, like a friend reaching out to hold our hand. It&apos;s a
        simple touch that can make us feel less alone.&rdquo;
      </blockquote>
      <p className="text-primary text-sm">
        Move your mouse over &ldquo;thread&rdquo; to see it light up, just like
        a real connection!
      </p>
    </div>
  );
};

export default EnhancedHeader;
