import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

export async function GET() {
  const { isAuthenticated, getUser } = getKindeServerSession()
  const authStatus = await isAuthenticated()
  const user = authStatus ? await getUser() : null

  return Response.json({ isAuthenticated: authStatus, user })
}

