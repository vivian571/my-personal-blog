import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Guestbook',
  description: 'Sign my guestbook and leave a mark.',
};

export default function GuestbookPage() {
  return (
    <section>
      <h1 className="font-medium text-2xl mb-8 tracking-tighter">Guestbook</h1>
      <div className="w-full">
        <p className="mb-4 text-neutral-600 dark:text-neutral-400">
          Leave a comment below. It could be anything – appreciation, information, wisdom, or even humor.
        </p>
        
        <div className="my-8 p-4 rounded-lg bg-neutral-100 dark:bg-neutral-900">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Guestbook signing is currently disabled in this demo.
          </p>
        </div>

        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-between w-full space-x-2">
              <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">alice_dev</span>
              <span className="text-xs text-neutral-500 dark:text-neutral-500">Today</span>
            </div>
            <p className="text-neutral-800 dark:text-neutral-200">
              Just passing through! Love the minimal aesthetic. 🚀
            </p>
          </div>
          
          <div className="w-full h-px bg-neutral-200 dark:bg-neutral-800" />

          <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-between w-full space-x-2">
              <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">design_fan</span>
              <span className="text-xs text-neutral-500 dark:text-neutral-500">Yesterday</span>
            </div>
            <p className="text-neutral-800 dark:text-neutral-200">
              The typography choices here are excellent. Keep it up!
            </p>
          </div>

          <div className="w-full h-px bg-neutral-200 dark:bg-neutral-800" />

          <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-between w-full space-x-2">
              <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">traveler</span>
              <span className="text-xs text-neutral-500 dark:text-neutral-500">3 days ago</span>
            </div>
            <p className="text-neutral-800 dark:text-neutral-200">
              Hello from Tokyo! 🇯🇵
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
