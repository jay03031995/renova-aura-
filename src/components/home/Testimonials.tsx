import { getTestimonials } from "@/sanity/lib/fetchers";

const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("");

export default async function Testimonials() {
  const items = await getTestimonials();

  return (
    <section className="section testimonials" id="testimonials">
      <div className="container">
        <div className="section-head reveal">
          <div className="section-head-copy">
            <div className="eyebrow">Patient stories</div>
            <h2>In their own words.</h2>
          </div>
          <p>
            11,200+ verified reviews across Google, Practo and Justdial. Below
            are three we couldn&apos;t stop reading.
          </p>
        </div>
        <div className="testimonials-track">
          {items.map((t, i) => (
            <div className="testimonial reveal" key={i}>
              <div className="testimonial-stars">★ ★ ★ ★ ★</div>
              <div className="testimonial-quote">{t.q}</div>
              <div className="testimonial-meta">
                <div className="testimonial-avatar">{initials(t.name)}</div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-detail">{t.detail}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
