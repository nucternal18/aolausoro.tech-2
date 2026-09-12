'use client'
import React, { useRef, useCallback } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

import { Button } from '@components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@components/ui/form'
import { Textarea } from '@components/ui/textarea'
import { Input } from '@components/ui/input'

import useContactController from '../hooks/use-contact-controller'

const labelClassName = 'font-mono text-[11px] tracking-[0.12em] uppercase text-ink'

function ContactForm() {
  const { form, recaptchaRef, handleSubmit } = useContactController()
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClassName}>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClassName}>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClassName}>Subject</FormLabel>
              <FormControl>
                <Input placeholder="Enter a subject" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClassName}>Message</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter your message" className="h-24 resize-y" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit">SEND IT</Button>
          <p className="font-mono text-[11px] leading-[1.5] text-ink-3">
            PROTECTED BY RECAPTCHA
            <br />
            NO NEWSLETTER, NO LIST
          </p>
        </div>
      </form>
      <ReCAPTCHA
        ref={recaptchaRef}
        size="invisible"
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ''}
      />
    </Form>
  )
}

export default ContactForm
