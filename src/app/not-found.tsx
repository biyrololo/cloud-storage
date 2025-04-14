import Link from "next/link";

export default function NotFound() {
    return (
        <div className="box-border p-2 flex flex-col gap-4 items-center justify-center h-screen">
            <h1 className="text-4xl font-bold">Not Found</h1>
            <p className="text-gray-500">The page you are looking for does not exist.</p>
            <Link href="/" className="text-primary">Go back to the home page</Link>
        </div>
    )
}