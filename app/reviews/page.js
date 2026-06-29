import { redirect } from "next/navigation";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Why LearnStack",
  description: "Learn why LearnStack focuses on visual, practical, easy-to-follow books and honest buyer trust.",
  path: "/reviews"
});

export default function ReviewsPage() {
  redirect("/why-learnstack");
}
