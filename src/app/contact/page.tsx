import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <section className="section">
      <div className="container-x grid lg:grid-cols-2 gap-16">
        <div>
          <p className="text-sage-dark tracking-[0.25em] text-sm uppercase mb-4">
            Contact us
          </p>
          <h1 className="font-serif text-5xl md:text-6xl mb-6 leading-tight">
            We&apos;d love to hear from you.
          </h1>
          <p className="text-muted text-lg leading-relaxed mb-10">
            Whether you&apos;d like to book a class, ask about private sessions,
            or just say hello — drop us a note. We usually reply within a day.
          </p>

          <div className="space-y-6 text-foreground/85">
            <div>
              <div className="text-xs tracking-widest uppercase text-muted mb-1">
                Visit
              </div>
              <div className="font-serif text-xl">123 Lotus Lane, Bengaluru</div>
            </div>
            <div>
              <div className="text-xs tracking-widest uppercase text-muted mb-1">
                Email
              </div>
              <div className="font-serif text-xl">hello@serenityyoga.com</div>
            </div>
            <div>
              <div className="text-xs tracking-widest uppercase text-muted mb-1">
                Phone
              </div>
              <div className="font-serif text-xl">+91 98765 43210</div>
            </div>
            <div>
              <div className="text-xs tracking-widest uppercase text-muted mb-1">
                Hours
              </div>
              <div className="font-serif text-xl">Mon–Sat · 6am – 8pm</div>
            </div>
          </div>
        </div>

        <div className="bg-cream rounded-3xl p-8 md:p-12 border border-sand">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
