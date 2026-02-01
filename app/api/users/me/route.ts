// TEMPORARY: Not using Neynar for now
// import { fetchUser } from "@/lib/neynar";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const fidHeader = request.headers.get("x-user-fid")!;
  const fid = Number(fidHeader);

  // TEMPORARY: Bypass Neynar - create basic user object from FID only
  // Once Neynar API key is working, uncomment the line below and remove this block
  // const user = await fetchUser(fid);
  const user = {
    fid,
    username: `fid-${fid}`,
    display_name: `User ${fid}`,
    pfp_url: '',
    custody_address: '',
    verifications: [],
  };

  return NextResponse.json(user);
}
