import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-cream border-t border-sand mt-20">
      <div className="container-x px-6 py-16 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-9 h-9 rounded-full bg-sage flex items-center justify-center text-white font-serif text-lg">
              S
            </span>
            <span className="font-serif text-xl">Serenity Yoga</span>
          </div>
          <p className="text-muted max-w-sm leading-relaxed">
            A calm space to breathe, stretch, and reconnect with yourself.
            Classes for every body, every day.
          </p>
        </div>

        <div>
          <h4 className="font-medium mb-4 text-sm tracking-widest uppercase">
            Explore
          </h4>
          <ul className="space-y-2 text-muted">
            <li><Link href="/about" className="hover:text-foreground">About</Link></li>
            <li><Link href="/gallery" className="hover:text-foreground">Gallery</Link></li>
            <li><Link href="/reviews" className="hover:text-foreground">Reviews</Link></li>
            <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-4 text-sm tracking-widest uppercase">
            Visit
          </h4>
          <ul className="space-y-2 text-muted">
            <li>123 Lotus Lane</li>
            <li>Bengaluru, India</li>
            <li>hello@serenityyoga.com</li>
            <li>+91 98765 43210</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-sand">
        <div className="container-x px-6 py-6 flex flex-col md:flex-row justify-between gap-2 text-sm text-muted">
          <p>© {new Date().getFullYear()} Serenity Yoga. All rights reserved.</p>
          <p>Built with love & a calm breath.</p>
        </div>
      </div>
    </footer>
  );
}
