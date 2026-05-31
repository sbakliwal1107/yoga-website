import Image from "next/image";
import Link from "next/link";

const values = [
  {
    title: "Accessible",
    body: "Every class is designed so anyone — at any age or ability — can join in and feel welcome.",
  },
  {
    title: "Mindful",
    body: "We move slowly enough to listen. Breath leads, the body follows.",
  },
  {
    title: "Joyful",
    body: "A practice without joy isn’t much of a practice. Expect light, laughter, and warmth.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="section pb-0">
        <div className="container-x grid md:grid-cols-2 gap-12 items-center">
          <div className="fade-in">
            <p className="text-sage-dark tracking-[0.25em] text-sm uppercase mb-4">
              About the studio
            </p>
            <h1 className="font-serif text-5xl md:text-6xl leading-tight mb-6">
              A quiet place to come home to yourself.
            </h1>
            <p className="text-muted text-lg leading-relaxed mb-4">
              Serenity Yoga began with a simple idea — that yoga should feel
              less like a workout and more like a homecoming. A place where you
              can show up exactly as you are, leave the noise at the door, and
              spend an hour breathing on purpose.
            </p>
            <p className="text-muted text-lg leading-relaxed">
              Our teachers come from a range of traditions — Hatha, Vinyasa,
              Yin, and Iyengar — but they share one belief: every body is a
              good body for yoga.
            </p>
          </div>
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=1200&q=80"
              alt="Yoga studio interior"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <h2 className="font-serif text-4xl md:text-5xl mb-16 max-w-2xl">
            What we believe.
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((v) => (
              <div key={v.title} className="p-8 rounded-3xl bg-cream border border-sand">
                <h3 className="font-serif text-2xl mb-3">{v.title}</h3>
                <p className="text-muted leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="container-x grid md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-square rounded-3xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&q=80"
              alt="Lead instructor"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sage-dark tracking-[0.25em] text-sm uppercase mb-4">
              Meet the founder
            </p>
            <h2 className="font-serif text-4xl md:text-5xl mb-6">Anjali Mehra</h2>
            <p className="text-muted text-lg leading-relaxed mb-4">
              A 500-hour certified yoga teacher with over a decade of practice
              across India and the UK, Anjali founded Serenity Yoga to create a
              studio that felt warm, unpretentious, and deeply human.
            </p>
            <p className="text-muted text-lg leading-relaxed mb-8">
              When she’s not on the mat, you’ll find her hiking in the Western
              Ghats or hunting down the best filter coffee in town.
            </p>
            <Link href="/contact" className="btn-primary">Come say hi</Link>
          </div>
        </div>
      </section>
    </>
  );
}
