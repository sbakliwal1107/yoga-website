import Link from "next/link";
import Image from "next/image";

const classes = [
  {
    name: "Vinyasa Flow",
    desc: "A dynamic, breath-led practice that links movement to breath.",
    level: "All levels",
  },
  {
    name: "Hatha",
    desc: "A slower-paced class focusing on alignment, posture, and breath.",
    level: "Beginner",
  },
  {
    name: "Yin & Restore",
    desc: "Deep, long-held stretches to release tension and quiet the mind.",
    level: "All levels",
  },
  {
    name: "Meditation",
    desc: "Guided sittings that help you build a calm, sustainable practice.",
    level: "All levels",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=2000&q=80"
            alt="Person practicing yoga at sunrise"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/20" />
        </div>

        <div className="container-x px-6 pt-24 pb-32 md:pt-40 md:pb-48 max-w-3xl fade-in">
          <p className="text-sage-dark tracking-[0.25em] text-sm uppercase mb-6">
            Yoga · Meditation · Breathwork
          </p>
          <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] mb-6">
            Find your <em className="text-sage-dark">inner peace</em>,
            one breath at a time.
          </h1>
          <p className="text-lg md:text-xl text-muted max-w-xl mb-10 leading-relaxed">
            A modern studio rooted in tradition. Join thoughtful, accessible
            classes designed for every body — whether it&apos;s your first time
            on a mat or your thousandth.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/contact" className="btn-primary">Book your first class</Link>
            <Link href="/about" className="btn-secondary">Our story</Link>
          </div>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="container-x grid md:grid-cols-3 gap-12 text-center">
          {[
            { n: "10+", l: "Years of practice" },
            { n: "1,200+", l: "Happy students" },
            { n: "20", l: "Weekly classes" },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-serif text-5xl text-sage-dark mb-2">{s.n}</div>
              <div className="tracking-widest uppercase text-sm text-muted">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <div className="max-w-2xl mb-16">
            <p className="text-sage-dark tracking-[0.25em] text-sm uppercase mb-4">
              Our Classes
            </p>
            <h2 className="font-serif text-4xl md:text-5xl mb-4">
              A practice for every mood.
            </h2>
            <p className="text-muted text-lg leading-relaxed">
              From slow restorative sessions to energising flows, find a class
              that meets you where you are today.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {classes.map((c) => (
              <div
                key={c.name}
                className="p-8 rounded-3xl bg-cream border border-sand hover:border-sage transition-colors"
              >
                <div className="text-xs tracking-widest uppercase text-sage-dark mb-3">
                  {c.level}
                </div>
                <h3 className="font-serif text-2xl mb-3">{c.name}</h3>
                <p className="text-muted leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-sage text-white">
        <div className="container-x text-center max-w-2xl">
          <h2 className="font-serif text-4xl md:text-5xl mb-6">
            Your first class is on us.
          </h2>
          <p className="text-lg mb-10 text-white/85 leading-relaxed">
            Step onto the mat and see how it feels. Book a complimentary intro
            session — no commitment, just an hour for yourself.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-sage-dark px-8 py-4 rounded-full font-medium hover:bg-cream transition-colors"
          >
            Reserve my free class
          </Link>
        </div>
      </section>
    </>
  );
}
