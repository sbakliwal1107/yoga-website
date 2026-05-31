import Image from "next/image";

const images = [
  {
    src: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=80",
    alt: "Group yoga class",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=900&q=80",
    alt: "Meditation pose",
  },
  {
    src: "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=900&q=80",
    alt: "Studio mats",
  },
  {
    src: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=80",
    alt: "Teacher demonstrating pose",
  },
  {
    src: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=900&q=80",
    alt: "Outdoor yoga",
  },
  {
    src: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=900&q=80",
    alt: "Sunrise stretch",
    span: "md:col-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1593810451137-fb6a16ee5b66?w=900&q=80",
    alt: "Quiet reading nook",
  },
  {
    src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80",
    alt: "Studio entrance with plants",
  },
];

export default function GalleryPage() {
  return (
    <section className="section">
      <div className="container-x">
        <div className="max-w-2xl mb-16">
          <p className="text-sage-dark tracking-[0.25em] text-sm uppercase mb-4">
            Gallery
          </p>
          <h1 className="font-serif text-5xl md:text-6xl mb-6">
            Moments from the mat.
          </h1>
          <p className="text-muted text-lg leading-relaxed">
            A peek into our daily classes, workshops, and community gatherings.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] md:auto-rows-[260px] gap-4">
          {images.map((img) => (
            <div
              key={img.src}
              className={`relative rounded-2xl overflow-hidden group ${img.span ?? ""}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
