import Link from 'next/link';
import { FaceFrownIcon } from '@heroicons/react/24/outline';

type NotFoundViewProps = {
    resourceName: string
}
 
export default function NotFoundView({ resourceName }: NotFoundViewProps) {
  return (
    <main className="grow flex flex-col items-center justify-center gap-4 pb-32 text-center">
      <FaceFrownIcon className="w-10" />
      <h2>404 - Not Found</h2>
      <p>The {resourceName} you are looking for does not exist.</p>
      <Link href="/">
        Return Home
      </Link>
    </main>
  );
}