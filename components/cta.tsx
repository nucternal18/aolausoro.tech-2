import Link from "next/link";

export default function CTA() {
  return (
    <section id="contact" className="px-4 py-20 mx-auto max-w-5xl md:px-0">
      <div className="p-12 space-y-6 text-center rounded-lg border bg-card border-primary/20 md:p-16">
        <h2 className="text-3xl font-bold md:text-4xl text-foreground">
          Ready to work together?
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Let's create something amazing. Get in touch and let's discuss how I
          can help bring your ideas to life.
        </p>
        <div className="flex flex-col gap-4 justify-center pt-4 sm:flex-row">
          <a
            href="mailto:hello@example.com"
            className="inline-flex justify-center items-center px-8 py-3 font-semibold rounded-lg transition-opacity bg-primary text-primary-foreground hover:opacity-90"
          >
            Send me an email
          </a>
          <Link
            href="https://calendly.com"
            target="_blank"
            className="inline-flex justify-center items-center px-8 py-3 font-semibold rounded-lg border transition-colors border-border text-foreground hover:bg-card"
          >
            Schedule a call
          </Link>
        </div>
      </div>
    </section>
  );
}
