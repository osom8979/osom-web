import Link from 'next/link';

export default async function NotFound() {
  return (
    <div className="min-h-screen bg-base-200">
      <main>
        <h2>Not Found</h2>
        <p>Could not find requested resource</p>
        <Link href="/">Return Home</Link>
      </main>
    </div>
  );
}
