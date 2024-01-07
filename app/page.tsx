'use client'
import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { user } = useUser();

  useEffect(() => {
    const createUserInDb = async () => {
      if (user?.id) {
        const primaryEmail = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress || '';
        const name = `${user.firstName || ''} ${user.lastName || ''}`.trim();

        const response = await fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: user.id, email: primaryEmail, name }),
        });

        if (response.status === 201) {
          console.log("User created successfully");
        } else if (response.status === 200) {
          console.log("User already exists");
        } else {
          console.error("Error creating the user");
        }
      }
    };

    createUserInDb();
  }, [user]);

  return (
    <main className="space-y-6">
      <Link href="/account">
        <Button variant="outline">Account and Billing</Button>
      </Link>
      <pre className="bg-card p-4 rounded-sm">
        {JSON.stringify(user, null, 2)}
      </pre>
    </main>
  );
}
