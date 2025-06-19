"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Fade as Hamburger } from "hamburger-react";
import { usePathname } from "next/navigation";
import LightLogo from "@/public/campusCodeImages/lightLogo1.svg";
import DarkLogo from "@/public/campusCodeImages/darkLogo1.svg";
import { useTheme } from "next-themes";
import HeaderDropdown from "./HeaderDropDown";
import ThemeSwitcher from "../DarkThemes";
import InitiativesDropdown from "./InitiativeDropDown";
import { motion } from "framer-motion";
import ToggleButton from "./ToggleButton";

const Header = () => {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [showNavbar, setShowNavbar] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <header className="mt-6 z-40">
      <div className="container mx-auto px-4">
        <nav className="navbar lg:ml-16 lg:mr-20 rounded-lg bg-white dark:border-0 dark:bg-gray-800  flex justify-between items-center">
          <a
            href="https://campuscode.in"
            rel="noopener noreferrer"
          >
            <div className="flex items-center">
              {isClient && (
                <motion.div
                  whileHover={{
                    y: [-3, 5, -3, 0],
                    transition: {
                      duration: 0.5,
                      repeat: Infinity,
                      repeatType: "reverse",
                    },
                  }}
                >
                  <Image
                    src={theme === "dark" ? DarkLogo : LightLogo}
                    width={150}
                    height={50}
                    className="h-[45px] sm:h-[50px] md:h-[58px] w-auto"
                    alt="Header Logo"
                    priority
                  />
                </motion.div>
              )}
            </div>
          </a>

          <div className="hidden md:flex items-center space-x-4">
            <ul className="flex items-center text-textColor dark:text-white font-medium space-x-4">
              <li
                className={
                  pathname === "/" ? "bg-[#9241d40d] rounded-lg" : "rounded-lg"
                }
              >
                <a
                  className="hover:text-[#4BA492] hover:transition-all ease-in-out duration-300 p-2"
                  href="https://campuscode.in"
                  rel="noopener noreferrer"
                >
                  Home
                </a>
              </li>

              <li
                className={
                  pathname.includes("/events")
                    ? "bg-[#9241d40d] rounded-lg"
                    : "rounded-lg"
                }
              >
                <a
                  className="hover:text-[#4BA492] p-2"
                  href="https://www.campuscode.in/events"
                 
                  rel="noopener noreferrer"
                >
                  Events
                </a>
              </li>

              {/* Uncomment if you want to add Jobs page */}
              {/* <li className={pathname.includes("/jobs") ? "bg-[#9241d40d] rounded-lg text-purple-500" : "rounded-lg"}>
                <Link className="hover:text-primaryPurple p-2" href="/jobs">
                  Jobs
                </Link>
              </li> */}

              <HeaderDropdown />
            </ul>
          </div>

          <div className="flex items-center gap-x-5">
           <ToggleButton/>

            <span className="hidden md:flex">
              {/* <Pythonbootcamp /> */}
              {/* <ButtonAuth /> */}
            </span>

            <div className="md:hidden">
              <Hamburger
                toggled={showNavbar}
                toggle={setShowNavbar}
                distance="md"
                size={25}
              />
            </div>
          </div>
        </nav>

        {showNavbar && (
          <div className="md:hidden ease-in-out delay-200 shadow-2xl bg-white dark:bg-gray-800 rounded-lg p-4 mt-2">
            <ul className="flex flex-col space-y-4 text-2xl text-black dark:text-white font-medium">
              <li
                className={
                  pathname === "/" ? "bg-[#9241d40d] rounded-lg" : "rounded-lg"
                }
              >
                <a
                  className="hover:text-[#4BA492] hover:transition-all ease-in-out duration-300 p-2"
                  href="https://campuscode.in"
                 
                  rel="noopener noreferrer"
                >
                  Home
                </a>
              </li>

              <li
                className={
                  pathname.includes("/events")
                    ? "bg-[#9241d40d] rounded-lg"
                    : "rounded-lg"
                }
              >
                <a
                  className="hover:text-[#4BA492] p-2"
                  href="https://www.campuscode.in/events"
                  
                  rel="noopener noreferrer"
                >
                  Events
                </a>
              </li>

              {/* Uncomment if needed */}
              {/* <li className={pathname.includes("/jobs") ? "bg-[#9241d40d] rounded-lg text-purple-500" : "rounded-lg"}>
                <Link className="md:hover:text-primaryPurple p-2" href="/jobs">
                  Jobs
                </Link>
              </li> */}

              <li className="relative">
                <InitiativesDropdown />
              </li>

              <li>
                {/* <Pythonbootcamp /> */}
                {/* <ButtonAuth /> */}
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
