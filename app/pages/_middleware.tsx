import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  // return early if url isn"t supposed to be protected
  if (req.cookies.qid) {
    console.info("logged in");
  } else {
    console.info("logged out");
  }
  return NextResponse.next();
  // if (!req.url.includes("/protected-url")) {
  //   return NextResponse.next();
  // }

  // const session = await getToken({ req, secret: process.env.SECRET });
  // // You could also check for any property on the session object,
  // // like role === "admin" or name === "John Doe", etc.
  // if (!session) return NextResponse.redirect("/my-test-link");

  // If user is authenticated, continue.
}
