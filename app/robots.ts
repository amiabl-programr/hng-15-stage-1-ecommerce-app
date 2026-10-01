import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://roofingconstructionshop.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/account/", "/checkout/success"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
