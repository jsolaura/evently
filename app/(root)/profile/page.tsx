import Collection, { CollectionProps } from '@/components/shared/Collection'
import { Button } from '@/components/ui/button'
import { getEventsByUser } from '@/lib/actions/event.actions'
import { getOrdersByUser } from '@/lib/actions/order.actions'
import { IOrder } from '@/lib/database/models/order.model'
import { SearchParamProps } from '@/types'
import { auth } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'

const InfoSection = ({ children, title }: {children: React.ReactNode, title: string}) => (
    <section className='bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10'>
        <div className='wrapper flex items-center justify-center sm:justify-between'>
            <h3 className='h3-bold text-center sm:text-left'>{title}</h3>
            {children}
        </div>
    </section>
)

const ProfilePage = async ({ searchParams }: SearchParamProps) => {
    const { sessionClaims } = auth();
    const userId = sessionClaims?.userId as string;

    const ordersPage = Number(searchParams?.ordersPage) || 1;
    const eventsPage = Number(searchParams?.eventsPage) || 1;

    const organizedEvents = await getEventsByUser({ userId, page: 1 });

    const orders = await getOrdersByUser({ userId, page: 1 });
    const orderedEvents = orders?.data.map((order: IOrder) => order.event) || [];

    return (
        <>
        <InfoSection title='My Tickets'>
            <Button asChild size='lg' className='button hidden sm:flex'>
                <Link href='/#events'>
                    Explore More Events
                </Link>
            </Button>
        </InfoSection>
        <section className='wrapper my-8'>
            <Collection 
                data={orderedEvents} 
                emptyTitle="No event tickets purchased yet"
                emptyStateSubtext="No worries - plenty of exciting events to explore!"
                collectionType="My_Tickets"
                limit={6}
                page={ordersPage}
                totalPages={orders?.totalPages}
                urlParamName='ordersPage'
            />
        </section>
        <InfoSection title='Event Organized'>
            <Button asChild size='lg' className='button hidden sm:flex'>
                <Link href='/events/create'>
                    Create New Event
                </Link>
            </Button>
        </InfoSection>
        <section className='wrapper my-8'>
            <Collection 
                data={organizedEvents?.data} 
                emptyTitle="No event have been created yet"
                emptyStateSubtext="Go create some now!"
                collectionType="Events_Organized"
                limit={6}
                page={eventsPage}
                totalPages={orderedEvents?.totalPages}
                urlParamName='eventsPage'
            />
        </section>
        </>
    )
}

export default ProfilePage