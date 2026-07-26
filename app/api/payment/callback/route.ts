import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const ref = url.searchParams.get("ref");
  const destination = ref
    ? `/shop/success?ref=${encodeURIComponent(ref)}`
    : "/shop/success";
  return NextResponse.redirect(new URL(destination, request.url));
}
