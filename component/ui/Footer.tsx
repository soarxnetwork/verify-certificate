"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import "../styles/Footer.css";
import Link from "next/link";
import { useTheme } from "next-themes";

// Logos
import LightLogo from "@/public/campusCodeImages/Light Mode - Footer Logo.svg";
import DarkLogo from "@/public/campusCodeImages/Dark Mode - Footer Logo.svg";

// Icons
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { BsTelephone } from "react-icons/bs";
import { AiOutlineMail } from "react-icons/ai";

const Footer = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <footer className="block bg-[#4BA492] dark:border-t-2 dark:border-gray-800 dark:bg-gradient-to-b dark:from-black dark:to-[#4BA492] lg:pl-20 pl-4 pr-4 lg:pr-20 text-white pt-10">
      <div className="custom-container pl-10 pb-5">
        <div className="flex-row flex items-center justify-between max-[767px]:flex-col max-[767px]:items-start">
          {/* Logo + Slogan */}
          <div className="w-full max-w-[560px]">
            <Image
              src={theme === "dark" ? DarkLogo : LightLogo}
              width={180}
              height={85}
              className="h-[50px] sm:h-[65px] md:h-[85px] w-auto"
              alt="Footer Logo"
            />
            <h2 className="font-bold text-3xl md:text-5xl -mt-3">
              Rise Together, Soar Higher
            </h2>
          </div>

          {/* Contact Info + Social Links */}
          <div className="max-[767px]:mt-8">
            <div className="mb-4 flex max-w-[360px] items-center gap-2">
              <FontAwesomeIcon icon={faLocationDot} className="h-[23px]" />
              <p className="max-[479px]:text-sm">
                Kurukshetra, Haryana, India 136118
              </p>
            </div>
            <div className="mb-4 flex gap-2 max-w-[360px] items-center">
              <AiOutlineMail className="text-xl" />
              <a href="mailto:team@campuscode.in" className="max-[479px]:text-sm">
                team@campuscode.in
              </a>
            </div>
            <div className="mb-4 flex gap-2 max-w-[360px] items-center">
              <BsTelephone className="text-xl" />
              <a href="tel:+91 8708686261">+91 8708686261</a>
            </div>

            {/* Social Icons */}
            <div className="social-icons-footer pt-2 flex items-center gap-2">
              <Link href="https://www.youtube.com/@campuscodein" target="_blank">
                <FaYoutube className="text-4xl p-2 hover:fill-white border border-white rounded-full cursor-pointer hover:bg-[#FF0000] hover:border-[#FF0000] transition duration-300" />
              </Link>
              <Link href="https://x.com/campuscodein" target="_blank">
                <div className="border border-white rounded-full w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-[#1DA1F2] hover:border-[#1DA1F2] transition duration-300">
                  <FaXTwitter className="text-xl fill-white" />
                </div>
              </Link>
              <Link href="https://www.linkedin.com/company/campuscodein" target="_blank">
                <FaLinkedinIn className="text-4xl p-2 hover:fill-white border border-white rounded-full cursor-pointer hover:bg-[#0077b5] hover:border-[#0077b5] transition duration-300" />
              </Link>
              <Link href="https://www.instagram.com/campuscode" target="_blank">
                <FaInstagram className="text-4xl p-2 hover:fill-white border border-white rounded-full cursor-pointer hover:bg-[#E1306C] hover:border-[#E1306C] transition duration-300" />
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="pb-6 w-full border-hr md:mt-16"></div>

        {/* Footer Bottom Links */}
        <div className="flex-row pb-6 pt-7 flex justify-between items-center max-[767px]:flex-col text-center max-[767px]:items-start max-[479px]:flex-col-reverse">
          <div className="font-semibold transition-all duration-300 text-center sm:text-center">
            <Link href="/privacy" className="inline-block font-normal hover:text-slate-500 dark:hover:text-black sm:pr-6 lg:pr-12 py-2">
              Privacy Policy
            </Link>
            <Link href="/refund-policy" className="inline-block font-normal hover:text-slate-500 dark:hover:text-black sm:pr-6 lg:pr-12 py-2">
              Refunds & Cancellation Policy
            </Link>
            <Link href="/terms" className="inline-block font-normal hover:text-slate-500 dark:hover:text-black sm:pr-6 lg:pr-12 py-2">
              Terms & Conditions
            </Link>
          </div>

          <div>
            <p className="max-[479px]:text-sm">
              © Copyright 2024. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
