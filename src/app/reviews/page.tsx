const reviews = [
  {
    name: "Priya R.",
    role: "Student since 2023",
    body: "I walked in nervous about being a beginner and walked out feeling like I’d found a second home. The teachers are patient, the space is gorgeous, and I actually look forward to the 6am class now.",
    rating: 5,
  },
  {
    name: "Arjun S.",
    role: "Vinyasa regular",
    body: "Best yoga studio in the city, hands down. The flows are challenging but always grounded in breath. I’ve never felt more present.",
    rating: 5,
  },
  {
    name: "Meera K.",
    role: "Yin & restore",
    body: "After a tough year, the yin classes here helped me slow down and just breathe. It’s genuine, gentle, and exactly what I needed.",
    rating: 5,
  },
  {
    name: "Daniel T.",
    role: "Workshop attendee",
    body: "The weekend breathwork workshop was transformative. Anjali holds space beautifully — you can tell she really cares.",
    rating: 5,
  },
  {
    name: "Sneha V.",
    role: "Beginner",
    body: "I was scared I wouldn’t be flexible enough. Two months later, I can touch my toes — but more importantly, I’m sleeping better.",
    rating: 5,
  },
  {
    name: "Rahul M.",
    role: "Corporate program",
    body: "We brought Serenity Yoga into our office. The team is calmer, more focused, and weirdly… happier. Cannot recommend enough.",
    rating: 5,
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-1 text-terracotta">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} aria-hidden>★</span>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <section className="section">
      <div className="container-x">
        <div className="max-w-2xl mb-16 text-center mx-auto">
          <p className="text-sage-dark tracking-[0.25em] text-sm uppercase mb-4">
            Kind words
          </p>
          <h1 className="font-serif text-5xl md:text-6xl mb-6">
            Loved by our community.
          </h1>
          <p className="text-muted text-lg leading-relaxed">
            Real stories from students who walked in curious and stayed for the
            calm.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <article
              key={r.name}
              className="p-8 rounded-3xl bg-cream border border-sand flex flex-col"
            >
              <Stars count={r.rating} />
              <p className="text-foreground/85 leading-relaxed mt-4 mb-6 flex-1">
                &ldquo;{r.body}&rdquo;
              </p>
              <div>
                <div className="font-serif text-lg">{r.name}</div>
                <div className="text-sm text-muted">{r.role}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
