"use client";
import Footer from '@/components/shared/Footer'
import Header from '@/components/shared/Header'
import { Suspense, useEffect, useState } from 'react'
import Loading from './loading';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex h-screen flex-col'>
            <Header />
            <Suspense fallback={<Loading />}>
                <main className='flex-1'>{children}</main>
            </Suspense>
            <Footer />
        </div>
    )
}
