"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { RxDropdownMenu } from "react-icons/rx";
import { IoMdArrowDropdown } from "react-icons/io";

import { FaPython, FaUser } from "react-icons/fa";
import { PiBankDuotone } from "react-icons/pi";

const dsa = [
  {
    name: "5 Day Python Bootcamp",
    desc: "Master Python: Join Live Classes!",
    code: "https://soarx.me/python-bootcamp", 
    image: <FaPython size={24} className="text-white" />,
  },
  {
    name: "Chapter Leader Program",
    desc: "Represent us at your college",
    code: "https://soarx.me/chapter-leaders",
    image: <PiBankDuotone size={24} />,
  },
  {
    name: "Apply to our Campus Programs",
    desc: "Be the face of SoarX in your college!",
    code: "https://soarx.me/campus", // 
    image: <FaUser size={24} />,
  },
];

const HeaderDropdown = () => {
  const pathname = usePathname();
  const [_, setSelectedDsa] = useState<null | typeof dsa>(null);
  const [hovered, setHovered] = useState(false);

  const actualDsa = dsa.find((d) => d.code === pathname);

  useEffect(() => {
    if (pathname.includes(actualDsa?.code!)) {
      setSelectedDsa(null);
    }
  }, [pathname, actualDsa]);
  function cn(baseClass: string, conditionalClasses: { [key: string]: boolean }): string {
    return [
      baseClass,
      ...Object.entries(conditionalClasses)
        .filter(([_, condition]) => condition)
        .map(([className]) => className),
    ].join(" ");
  }
  return (
    <li
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative  hover:cursor-pointer"
    >
      <div>
        <div className="relative flex items-center gap-2 hover:cursor-pointer">
          <p
            className={cn("select-none truncate", {
              "text-[#5bcae6]": hovered,
            })}
          >
            Initiatives
          </p>
          
          <span>
            <IoMdArrowDropdown
              className={cn("rotate-0 transition-all duration-300", {
                "rotate-180": hovered,
              })}
            />
          </span>
        </div>
      </div>
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="container-dropdown-nav"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
            }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring" }}
          >
            {/* {dsa.map((d) => {
              return (
                <div key={d.name}>
                  <Link
                    href={d.code}
                    className={cn(
                      "hover:text-primaryPurple transition-all ease-in-out duration-200 text-sm",
                      {
                        "text-primaryPurple": pathname.includes(d.code),
                      }
                    )}
                  >
                    {d.name}
                  </Link>
                </div>
              );
            })} */}

            <div className="w-screen tracking-normal max-w-sm flex-auto overflow-hidden rounded-lg dark:bg-gray-800 bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
              {dsa.map((d) => {
                return (
                  <Link
                    key={d.name}
                    href={d.code}
                    className={cn(
                      "  transition-all ease-in-out duration-200 text-sm",
                      {
                        "text-[#4BA492]": pathname.includes(d.code),
                      }
                    )}
                  >
                    <div className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 ease-in-out transition-all duration-300">
                      <div className="mt-1 flex h-11 w-11 flex-none  items-center justify-center rounded-lg">
                        {/* <Image
                          src={d.image}
                          sizes="100vw"
                          width={23}
                          height={23}
                          alt="img"
                        /> */}
                          {d.image}
                      </div>
                      <div>
                        <div className="font-semibold dark:text-white">
                          {d.name}
                          <span className="absolute inset-0" />
                        </div>
                        <p className="mt-1 font-normal text-sm dark:text-white hover:text-purple-600">{d.desc}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
};

export default HeaderDropdown;
