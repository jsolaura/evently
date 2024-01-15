"use client";

import React from 'react'
import { IEvent } from '@/lib/database/models/event.model'
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs'
import { Button } from '../ui/button';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const Checkout = dynamic(() => import('./Checkout'), {
    ssr: false,
});
const CheckoutButton = ({ event, hasOrderedEvent }: { event: IEvent, hasOrderedEvent?: boolean }) => {
    const { user } = useUser();
    const userId = user?.publicMetadata.userId as string;

    const hasEventFinished = new Date(event.startDateTime) < new Date();

    return (  
        <div className='flex items-center gap-3'>
            {/* can't buy past event */}
            {hasEventFinished || event?.isFree ? (
                <p className='p-2 text-red-400'>{event?.isFree ? 'This is Free admission.' : hasEventFinished && 'Sorry, Tickets are no longer available.'}</p>
            ) : (
                <>
                <SignedOut>
                    <Button asChild className='button rounded-full' size='lg'>
                        <Link href='/sign-in'>
                            Get Tickets
                        </Link>
                    </Button>
                </SignedOut>
                <SignedIn>
                    {hasOrderedEvent ? (
                    <Button asChild className='button rounded-full' size='lg'>
                        <Link href={`/profile`} className='flex gap-2'>
                            <p className='text-white'>View My Ticket</p>
                        </Link>
                    </Button>
                    ) : 
                    <Checkout event={event} userId={userId} />
                }
                </SignedIn>
                </>
            )}
        </div>
    ) 
}

export default CheckoutButton   