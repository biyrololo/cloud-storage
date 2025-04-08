import { Header } from "@/widgets/header";
import { cookies } from "next/headers";
import { jwtService } from "@/shared/lib/jwtService";
import Link from "next/link";
export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
  const user = token ? jwtService.verifyToken(token.value) : null;
  return (
    <>
      <Header />
      {
        user && (
          <Link href="/storage" className="underline">
            Go to storage
          </Link>
        )
      }
    </>
  );
}
