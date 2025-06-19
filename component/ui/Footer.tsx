"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";

// Logos
import LightLogo from "@/public/campusCodeImages/lightLogo1.svg";
import DarkLogo from "@/public/campusCodeImages/darkLogo1.svg";

// Icons
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaFacebook,FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
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
    <footer className="block bg-gradient-to-b from-black to-[#212F42] border-t-2 border-gray-800 lg:pl-20 pl-4 pr-4 lg:pr-20 text-white pt-10">
      <div className="custom-container pl-10 pb-5">
        <div className="flex-row flex items-center justify-between max-[767px]:flex-col max-[767px]:items-start">
          {/* Logo + Slogan */}
          <div className="w-full max-w-[560px] max-[991px]:mr-4 max-[991px]:flex-initial">
            <Image
              src={theme === "dark" ? DarkLogo : DarkLogo}
              width={180}
              height={85}
              className="h-[65px] w-auto mb-4 object-contain"
              alt="Footer Logo"
              priority
            />
            <h2 className="font-bold text-3xl md:text-5xl -mt-3">
              Rise Together, Soar Higher
            </h2>
          </div>

          {/* Contact Info + Social Links */}
          <div className="max-[767px]:mt-8">
            <div className="mb-4 flex max-w-[360px] items-center gap-2">
              <FontAwesomeIcon icon={faLocationDot} className="h-[23px]" />
              <p className="max-[479px]:text-sm hover:text-[#5bcae6]">
                Kurukshetra, Haryana, India 136118
              </p>
            </div>
            <div className="mb-4 flex gap-2 max-w-[360px] items-center">
              <AiOutlineMail className="text-xl" />
              <a
                href="mailto:soarxnetwork@gmail.com"
                className="max-[479px]:text-sm hover:text-[#5bcae6]"
              >
                soarxnetwork@gmail.com
              </a>
            </div>
            <div className="mb-4 flex gap-2 max-w-[360px] items-center">
              <BsTelephone className="text-xl" />
              <a href="tel:+91 8708686261" className=" hover:text-[#5bcae6]">
                +91 8708686261
              </a>
            </div>

            {/* Social Icons */}
            <div className="pt-2 flex items-center gap-3">
              <Link href="https://www.youtube.com/@soarxnetwork" target="_blank">
                <div className="w-10 h-10 flex items-center justify-center border border-white rounded-full hover:bg-[#FF0000] hover:border-[#FF0000] transition duration-300">
                  <FaYoutube className="text-xl text-white" />
                </div>
              </Link>
              <Link href="https://x.com/soarxnetwork" target="_blank">
                <div className="w-10 h-10 flex items-center justify-center border border-white rounded-full hover:bg-[#1DA1F2] hover:border-[#1DA1F2] transition duration-300">
                  <FaXTwitter className="text-xl text-white" />
                </div>
              </Link>
              <Link href="https://www.linkedin.com/company/soarxin" target="_blank">
                <div className="w-10 h-10 flex items-center justify-center border border-white rounded-full hover:bg-[#0077b5] hover:border-[#0077b5] transition duration-300">
                  <FaLinkedinIn className="text-xl text-white" />
                </div>
              </Link>
              <Link href="https://www.instagram.com/soarxnetwork" target="_blank">
                <div className="w-10 h-10 flex items-center justify-center border border-white rounded-full hover:bg-[#E1306C] hover:border-[#E1306C] transition duration-300">
                  <FaInstagram className="text-xl text-white" />
                </div>
              </Link>
              <Link
                    href="https://www.facebook.com/soarxnetwork/"
                    target="_blank"
                  >
                    <div className="w-12 h-12 flex items-center justify-center border border-white rounded-full cursor-pointer hover:bg-[#0077b5] hover:border-[#0077b5] ease-in duration-300">
                      <FaFacebook className="text-xl" />
                    </div>
                  </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="pb-6 w-full border-hr md:mt-16"></div>

        {/* Footer Bottom Links */}
        <div className="flex-row pb-6 pt-7 flex justify-between items-center max-[767px]:flex-col text-center max-[767px]:items-start max-[479px]:flex-col-reverse">
          <div className="font-semibold transition-all duration-300 text-center sm:text-center">
            <Link
              href="/privacy"
              className="inline-block font-normal hover:text-[#5bcae6] sm:pr-6 lg:pr-12 py-2"
            >
              Privacy Policy
            </Link>
            <Link
              href="/refund-policy"
              className="inline-block font-normal hover:text-[#5bcae6] sm:pr-6 lg:pr-12 py-2"
            >
              Refunds & Cancellation Policy
            </Link>
            <Link
              href="/terms"
              className="inline-block font-normal hover:text-[#5bcae6] sm:pr-6 lg:pr-12 py-2"
            >
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
