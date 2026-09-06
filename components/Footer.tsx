import Link from 'next/link'
import { links, social } from '../data'

export function Footer() {
  return (
    <footer className="border-border bg-card/60 z-50 min-w-screen border-t py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 grid gap-8 md:grid-cols-3">
          <div>
            <div className="mb-4 flex items-center gap-2 rounded-md">
              <img src={'/android-chrome-512x512.png'} alt="logo" className="h-8 w-8" />
              <h3 className="text-foreground font-bold">John A. Oladipupo-Usoro</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Full-Stack Developer crafting digital experiences
            </p>
          </div>

          <div>
            <h4 className="text-foreground mb-4 font-semibold">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <Link
                href="#projects"
                className="text-muted-foreground hover:text-primary block transition-colors"
              >
                Projects
              </Link>
              <Link
                href="#skills"
                className="text-muted-foreground hover:text-primary block transition-colors"
              >
                Skills
              </Link>
              <a
                href="mailto:hello@example.com"
                className="text-muted-foreground hover:text-primary block transition-colors"
              >
                Contact
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-foreground mb-4 font-semibold">Connect</h4>
            <div className="flex gap-4">
              {social.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  rel="noreferrer"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-0 w-full p-6 text-current dark:text-yellow-500">
          <div className="z-50 container mx-auto my-4 text-center">
            <p className="z-50">© {new Date().getFullYear()} Portfolio. aolausoro.tech</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
