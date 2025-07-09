import { Button, Card, CardContent, CardMedia, Typography } from "@mui/material";

import { Header } from "@/widgets/header";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { getUsersCount } from "@/shared/lib/actions/usersCount";

export const revalidate = 86400;

export default async function Home() {
  const session = await getServerSession();
  const usersCount = await getUsersCount();
  
  const isUser = Boolean(session?.user);
  const link = isUser ? '/storage' : '/auth';

  return (
    <>
      <Header />
      <section className="flex flex-col items-center justify-center mt-20 mb-30 gap-8">
        <p className="bg-white rounded-full px-4 py-2 text-primary shadow-current/60 shadow-[0_0_10px_0_rgba(0,0,0,0.1)] text-sm">
          Introduce Cloud Storage
        </p>
        <h1 className="px-2 text-center leading-tight tracking-wider text-4xl sm:text-6xl font-bold">Remote <span className="text-primary">Storage</span>
          <br /> Anywhere, Anytime
        </h1>
        <p className="text-center text-2xl  font-bold text-primary">
          {usersCount} users per month
        </p>
        <p className="text-center text-gray-500">
          Upload, download and share files.
        </p>
          {
            isUser ? (
              <div>
                <Link href={link}>
                  <Button variant="contained" size="large" color="primary"
                  fullWidth
                  sx={{
                    textTransform: 'none',
                    px: 4,
                    py: 1.5,
                    borderRadius: 20
                  }}
                  >
                    Go to Storage
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Link href={link}>
                  <Button variant="contained" size="large" color="primary"
                  fullWidth
                  sx={{
                    textTransform: 'none',
                    px: 4,
                    py: 1.5,
                    borderRadius: 20
                  }}
                  >
                    Get Started
                  </Button>
                </Link>
                <Link href={link}>
                  <Button variant="outlined" size="large" color="secondary"
                  fullWidth
                  sx={{
                    textTransform: 'none',
                    px: 4,
                    py: 1.5,
                    borderRadius: 20
                  }}
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            )
          }
      </section>
      <section className="p-10">
        <Card sx={{
          borderRadius: 10, p: 2, display: 'grid', 
          gridTemplateColumns: {
            xs: '1fr',
            md: '1fr 1fr',
          }, 
          gap: 2, 
        }}>
          <CardContent sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
            <Typography variant="h6">
              Powerful and fast
            </Typography>
            <Typography variant="body1" color="text.secondary" fontSize={14}>
              Experience lightning-fast file transfers and robust storage capabilities. Our cloud storage solution is built with cutting-edge technology to ensure your files are always accessible and secure.
            </Typography>
            <Link href={link} className="mt-4 md:mt-auto block">
              <Button variant="outlined" color="secondary"
              sx={{
                textTransform: 'none',
                borderRadius: 20
              }}
              >
                Learn more
              </Button>
            </Link>
          </CardContent>
          <CardMedia
            component="img"
            src="/storage.png"
            alt="hero"
            sx={{width: '100%', height: 'auto', borderRadius: 10, p: 2}}
          />
        </Card>
      </section>
    </>
  );
}
