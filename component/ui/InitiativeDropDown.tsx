"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaPython, FaSalesforce } from "react-icons/fa";

const InitiativesDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMouseEnter = () => {
    if (window.innerWidth >= 768) setIsOpen(true); // Desktop only
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 768) setIsOpen(false); // Desktop only
  };

  const toggleDropdown = () => {
    if (window.innerWidth < 768) setIsOpen((prev) => !prev); // Mobile only
  };

  function cn(baseClass: string, conditionalClasses: { [key: string]: boolean }): string {
    const conditionalClassNames = Object.entries(conditionalClasses)
      .filter(([_, condition]) => condition)
      .map(([className]) => className)
      .join(" ");
    return `${baseClass} ${conditionalClassNames}`.trim();
  }

  return (
    <div
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full z-50 dark:text-white"
    >
      <button onClick={toggleDropdown} className="p-2">
        <p className="flex items-center gap-x-2 text-2xl">
          Initiatives
          <IoMdArrowDropdown
            className={cn("rotate-0 transition-all duration-300", {
              "rotate-180": isOpen,
            })}
          />
        </p>
      </button>

      {isOpen && (
        <ul className="absolute z-50 bg-[#4BA492] rounded-lg shadow-lg mt-2">
          <li>
            <a
              href="https://www.campuscode.in/python-bootcamp"
              className="block px-4 py-2 hover:text-white text-white text-2xl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <p className="flex items-center gap-x-3">
                <FaPython size={24} className="text-white" />
                <span>5 Days Python Bootcamp</span>
              </p>
            </a>
          </li>
          <hr className="border-white opacity-20" />
          {/* Add more <li> items here as needed */}
        </ul>
      )}
    </div>
  );
};

export default InitiativesDropdown;
