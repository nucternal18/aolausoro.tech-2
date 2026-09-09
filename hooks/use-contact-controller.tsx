'use client'

import { useCallback, useRef } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import ReCAPTCHA from 'react-google-recaptcha'

import { useToast } from '@components/ui/use-toast'

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('A valid email is required'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
})

export type ContactFormValues = z.infer<typeof contactSchema>

export default function useContactController() {
  const { toast } = useToast()

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', subject: '', message: '' },
  })

  const recaptchaRef = useRef<ReCAPTCHA>(null)

  const handleSubmit: SubmitHandler<ContactFormValues> = useCallback(
    async (data) => {
      try {
        await recaptchaRef.current?.executeAsync()
        recaptchaRef.current?.reset()

        const res = await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error(`Request failed: ${res.status}`)

        toast({ title: 'Success', description: 'Message sent successfully' })
        form.reset()
      } catch (error) {
        console.error(error)
        toast({
          title: 'Error',
          description: 'Unable to send message. Please try again.',
        })
      }
    },
    [form, toast],
  )

  return { form, handleSubmit, recaptchaRef }
}
