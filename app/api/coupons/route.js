import { fetchGumroadCoupons } from "@/lib/gumroadApi";

export const revalidate = 600;
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await fetchGumroadCoupons();
    return Response.json(result);
  } catch (error) {
    return Response.json(
      {
        success: false,
        coupons: [],
        message: "Could not load current Gumroad offers right now. Please check again soon."
      },
      { status: 503 }
    );
  }
}
