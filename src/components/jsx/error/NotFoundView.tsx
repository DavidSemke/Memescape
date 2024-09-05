import Link from 'next/link';
import { FaceFrownIcon } from '@heroicons/react/24/outline';

type NotFoundViewProps = {
    resourceName: string
}
 
export default function NotFoundView({ resourceName }: NotFoundViewProps) {
  return (
    <main className="grow flex flex-col items-center justify-center gap-8 pb-32 text-center">
      <FaceFrownIcon className="w-16 h-16" />
      <h1>404 - Not Found</h1>
      <p className='text-xl'>The {resourceName} you are looking for does not exist.</p>
      <Link href="/">
        Return Home
      </Link>
    </main>
  );
}