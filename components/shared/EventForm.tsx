"use client";

import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button"
import { FormControl,Form,FormField,FormItem,FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { eventFormSchema } from '@/lib/validator';

import * as z from "zod";
import { eventDefaultValue } from '@/constants';
import Dropdown from './Dropdown';
import FileUploader from './FileUploader';
import Image from 'next/image';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Checkbox } from '../ui/checkbox';
import { useUploadThing } from "@/lib/uploadthing";
import { useRouter } from 'next/navigation';
import { createEvent, updateEvent } from '@/lib/actions/event.actions';
import { IEvent } from '@/lib/database/models/event.model';

type EventTypeProps = {
    userId: string,
    type: "Create" | "Update",
    event?: IEvent,
    eventId?: string
}

const FormArticle = ({ children }: { children: React.ReactNode }) => (
    <div className='flex flex-col gap-5 md:flex-row'>
        {children}
    </div>
)

const EventForm = ({ userId, type, event, eventId }: EventTypeProps) => {
    const Router = useRouter();
    const initialValues = event && type === 'Update' ? {
        ...event, 
        startDateTime: new Date(event.startDateTime),
        endDateTime: new Date(event.endDateTime),
    } : eventDefaultValue;
    const [files, setFiles] = useState<File[]>([]);

    const { startUpload } = useUploadThing('imageUploader');


    const form = useForm<z.infer<typeof eventFormSchema>>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: initialValues,
    })

    async function onSubmit(values: z.infer<typeof eventFormSchema>) {
        const eventData = values;
        let uploadedImageUrl = values.imageUrl;
        if(files.length > 0) {
            const uploadedImages = await startUpload(files);

            if(!uploadedImages) return;

            uploadedImageUrl = uploadedImages[0].url;
        }
        if(type === 'Create') {
            try {
                const newEvent = await createEvent({
                    event: { ...values, imageUrl: uploadedImageUrl },
                    userId,
                    path: '/profile'
                })
                if(newEvent) {
                    form.reset();
                    Router.push(`/events/${newEvent._id}`);
                }
            } catch (error) {
                console.log(error);
                
            }
        }
        if(type === 'Update') {
            if(!eventId) {
                Router.back();
                return;
            }
            try {
                const updatedEvent = await updateEvent({
                    event: { ...values, imageUrl: uploadedImageUrl, _id: eventId },
                    userId,
                    path: `/events/${eventId}`
                })
                if(updatedEvent) {
                    form.reset();
                    Router.push(`/events/${updatedEvent._id}`);
                }
            } catch (error) {
                console.log(error);
                
            }
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <FormArticle>
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormControl>
                                    <Input placeholder="Event title" {...field} className='input-field' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormControl>
                                    <Dropdown onChangeHandler={field.onChange} value={field.value} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </FormArticle>
                <FormArticle>
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormControl className='h-72'>
                                    <Textarea placeholder="Description" {...field} className='textarea rounded-2xl' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormControl className='h-72'>
                                    <FileUploader
                                        imageUrl={field.value}
                                        onFieldChange={field.onChange}
                                        setFiles={setFiles}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </FormArticle>
                <FormArticle>
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormControl>
                                    <div className='flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2'>
                                        <Image 
                                            src="/assets/icons/location-grey.svg"
                                            alt='location'
                                            width={24}
                                            height={24}
                                        />
                                        <Input placeholder="Event location or Online" {...field} className='input-field' />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </FormArticle>
                <FormArticle>
                    <FormField
                        control={form.control}
                        name="startDateTime"
                        render={({ field }) => (
                            <FormItem className="w-full">
                            <FormControl>
                                <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                                <Image
                                    src="/assets/icons/calendar.svg"
                                    alt="calendar"
                                    width={24}
                                    height={24}
                                    className="filter-grey"
                                />
                                <p className="ml-3 whitespace-nowrap text-grey-600">Start Date:</p>
                                <DatePicker 
                                    selected={field.value} 
                                    onChange={(date: Date) => field.onChange(date)} 
                                    showTimeSelect
                                    timeInputLabel="Time:"
                                    dateFormat="MM/dd/yyyy h:mm aa"
                                    wrapperClassName="datePicker"
                                />
                                </div>

                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                    <FormField
                        control={form.control}
                        name="endDateTime"
                        render={({ field }) => (
                            <FormItem className="w-full">
                            <FormControl>
                                <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                                <Image
                                    src="/assets/icons/calendar.svg"
                                    alt="calendar"
                                    width={24}
                                    height={24}
                                    className="filter-grey"
                                />
                                <p className="ml-3 whitespace-nowrap text-grey-600">End Date:</p>
                                <DatePicker 
                                    selected={field.value} 
                                    onChange={(date: Date) => field.onChange(date)} 
                                    showTimeSelect
                                    timeInputLabel="Time:"
                                    dateFormat="MM/dd/yyyy h:mm aa"
                                    wrapperClassName="datePicker"
                                />
                                </div>

                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </FormArticle>
                <FormArticle>
                    <FormField
                        control={form.control}
                        name='price'
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormControl>
                                    <div className='flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2'>
                                        <Image 
                                            src="/assets/icons/dollar.svg"
                                            alt='dollar'
                                            width={24}
                                            height={24}
                                            className='filter-grey'
                                        />
                                        <Input type='number' placeholder='Price' {...field} className='p-regular-16 border-0 mr-3 bg-gray-50 outline-offset-0 focus:border-0 focust-visible:ring-0 focus-visible:ring-offset-0' />                                      
                                        <FormField
                                            control={form.control}
                                            name='isFree'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div className='flex items-center'>
                                                            <label htmlFor='isFree' className='whitespace-nowrap pr-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>Free Ticket</label>
                                                            <Checkbox 
                                                                id='isFree' 
                                                                className='mr-2 h-5 w-5 border-2 border-primary-500'
                                                                onCheckedChange={field.onChange}
                                                                checked={field.value}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="url"
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormControl>
                                    <div className='flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2'>
                                        <Image 
                                            src="/assets/icons/link.svg"
                                            alt='link'
                                            width={24}
                                            height={24}
                                        />
                                        <Input placeholder="URL" {...field} className='input-field' />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </FormArticle>
                <Button 
                    size='lg' 
                    type="submit"
                    className='button col-span-2 w-full'
                    disabled={form.formState.isSubmitting} 
                >
                    {form.formState.isSubmitting ? 'Submitting...' : `${type} Event`}
                </Button>
            </form>
        </Form>
    )
}

    export default EventForm