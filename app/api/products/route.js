import { fetchGumroadProducts } from "@/lib/gumroadApi";

export const revalidate = 600;
export const dynamic = "force-dynamic";

function normalizeAudienceParam(value) {
  if (value === "kids") return "kids";
  if (value === "all") return "all";
  return "regular";
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const audience = normalizeAudienceParam(searchParams.get("audience"));
    const result = await fetchGumroadProducts({ audience });

    return Response.json(result);
  } catch (error) {
    console.error("[Gumroad products API] error:", error);

    return Response.json(
      {
        success: false,
        products: [],
        message: "Could not load Gumroad products right now.",
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 503 }
    );
  }
}
