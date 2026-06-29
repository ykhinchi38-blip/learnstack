import { redirect } from "next/navigation";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Free Samples",
  description: "Preview selected LearnStack books before buying with free PDF samples.",
  path: "/free-resources"
});

export default function FreeResourcesPage() {
  redirect("/free-samples");
}
