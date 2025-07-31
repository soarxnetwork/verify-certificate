import { baseURL } from "./constants";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${baseURL}/events`,
    },
    {
      url: `${baseURL}/about`,
    },
    {
      url: `${baseURL}/dsa`,
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
    {
      url: `${baseURL}/dsa-live-classes`,
    },
    {
      url: `${baseURL}/campus-ambassador`,
    },
  ];
}
