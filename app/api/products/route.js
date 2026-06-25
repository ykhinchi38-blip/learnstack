import { fetchGumroadProducts } from "@/lib/gumroadApi";
import localProducts from "@/data/products";

export const revalidate = 600;
export const dynamic = "force-dynamic";

function normalizeAudienceParam(value) {
  if (value === "kids") return "kids";
  if (value === "all") return "all";
  return "regular";
}

function localFallbackProducts(audience) {
  if (audience === "all") return localProducts;
  return localProducts.filter((product) => (product.audience || "regular") === audience);
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const audience = normalizeAudienceParam(searchParams.get("audience"));
    const result = await fetchGumroadProducts({ audience });

    return Response.json(result);
  } catch (error) {
    console.error("[Gumroad products API] error:", error);
    const { searchParams } = new URL(request.url);
    const audience = normalizeAudienceParam(searchParams.get("audience"));
    const products = localFallbackProducts(audience);

    return Response.json(
      {
        success: true,
        cached: true,
        stale: true,
        products,
        message: "Showing the local LearnStack catalog because Gumroad is unavailable in this environment.",
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 200 }
    );
  }
}
