import Link from 'next/link'

export default function CTA() {
  return (
    <section id="contact" className="mx-auto max-w-5xl px-4 py-20 md:px-0">
      <div className="bg-card border-primary/20 space-y-6 rounded-lg border p-12 text-center md:p-16">
        <h2 className="text-foreground text-3xl font-bold md:text-4xl">Ready to work together?</h2>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          Let&apos;s create something amazing. Get in touch and let&apos;s discuss how I can help
          bring your ideas to life.
        </p>
        <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
          <a
            href="mailto:hello@example.com"
            className="bg-primary text-primary-foreground inline-flex items-center justify-center rounded-lg px-8 py-3 font-semibold transition-opacity hover:opacity-90"
          >
            Send me an email
          </a>
          <Link
            href="https://calendly.com"
            target="_blank"
            className="border-border text-foreground hover:bg-card inline-flex items-center justify-center rounded-lg border px-8 py-3 font-semibold transition-colors"
          >
            Schedule a call
          </Link>
        </div>
      </div>
    </section>
  )
}
