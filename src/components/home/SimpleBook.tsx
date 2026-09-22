import BookButton from "@/components/BookButton";
import SimpleBookCards from "@/components/home/SimpleBookCards";
import { Check } from "@/components/icons";

export default function SimpleBook() {
  return (
    <section className="simple-book" id="book">
      <div className="container">
        <div className="simple-book-grid">
          <div>
            <div
              className="eyebrow reveal"
              style={{ color: "var(--sand)", marginBottom: 16 }}
            >
              Book Appointment
            </div>
            <h2 className="reveal">Talk to a specialist this week.</h2>
            <p className="reveal">
              A one-on-one consultation with a board-certified consultant. A
              written plan, on the spot. Honest, unhurried, and built for what
              you actually need.
            </p>
            <BookButton className="btn btn-primary reveal">
              Book Appointment
            </BookButton>
            <div className="simple-book-meta reveal">
              <span>
                <Check /> Same-day slots
              </span>
              <span>
                <Check /> Confirmed on WhatsApp in 10 min
              </span>
              <span>
                <Check /> Mon to Sat 10 AM to 7:30 PM
              </span>
            </div>
          </div>

          <SimpleBookCards />
        </div>
      </div>
    </section>
  );
}
