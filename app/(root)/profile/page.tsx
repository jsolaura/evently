import Collection, { CollectionProps } from '@/components/shared/Collection'
import { Button } from '@/components/ui/button'
import { getEventsByUser } from '@/lib/actions/event.actions'
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
const CollectionSection = ({ data, emptyTitle, emptyStateSubtext, collectionType, limit, page, totalPages, urlParamName }: CollectionProps) => (
    <section className='wrapper my-8'>
        <Collection 
            data={data} 
            emptyTitle={emptyTitle}
            emptyStateSubtext={emptyStateSubtext}
            collectionType={collectionType}
            limit={limit}
            page={page}
            totalPages={totalPages}
            urlParamName={urlParamName}
        />
    </section>
)
const ProfilePage = async () => {
    const { sessionClaims } = auth();
    const userId = sessionClaims?.userId as string;

    const organizedEvents = await getEventsByUser({ userId, page: 1 });

    return (
        <>
        {/* My Tickets */}
        <InfoSection title='My Tickets'>
            <Button asChild size='lg' className='button hidden sm:flex'>
                <Link href='/#events'>
                    Explore More Events
                </Link>
            </Button>
        </InfoSection>
        <CollectionSection 
            data={[]} 
            emptyTitle="No event tickets purchased yet"
            emptyStateSubtext="No worries - plenty of exciting events to explore!"
            collectionType="My_Tickets"
            limit={6}
            page={1}
            totalPages={2}
            urlParamName='ordersPage'
        />
        {/* My Events */}

        {/* Event Organized */}
        <InfoSection title='Event Organized'>
            <Button asChild size='lg' className='button hidden sm:flex'>
                <Link href='/events/create'>
                    Create New Event
                </Link>
            </Button>
        </InfoSection>
        <CollectionSection 
            data={organizedEvents?.data} 
            emptyTitle="No event have been created yet"
            emptyStateSubtext="Go create some now!"
            collectionType="Events_Organized"
            limit={6}
            page={1}
            totalPages={2}
            urlParamName='eventsPage'
        />
        </>
    )
}

export default ProfilePage