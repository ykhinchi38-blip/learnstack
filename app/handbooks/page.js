import { redirect } from "next/navigation";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "LearnStack Handbooks",
  description: "Browse LearnStack PDF handbooks for students, developers, coding beginners, tools, AI, and practical student learning.",
  path: "/handbooks"
});

export default function HandbooksRedirectPage() {
  redirect("/products");
}
