import { baseURL } from "./constants";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
     {
      url: `${baseURL}/`,
      },
    {
      url: `${baseURL}/privacy`,
    },
    {
      url: `${baseURL}/refund-policy`,
    },
    {
      url: `${baseURL}/terms`,
    },
  ];
}
