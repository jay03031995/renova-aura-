import BookButton from "@/components/BookButton";
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

          <div className="simple-book-visual reveal">
            <div className="sbv-orbit" />
            <div className="sbv-card c1">
              <div className="sbv-hd">Today · 4:30 PM</div>
              <div className="sbv-title">Dr. Bhawna Bhardwaj</div>
              <div className="sbv-sub">
                Dermatology · Hair Transplant Consult
              </div>
              <div className="sbv-row">
                <span style={{ color: "var(--muted)" }}>Availability</span>
                <span className="pill">2 slots left</span>
              </div>
            </div>
            <div className="sbv-card c2">
              <div className="sbv-hd">Tomorrow · 11:00 AM</div>
              <div className="sbv-title">Dr. Ankur Bhatia</div>
              <div className="sbv-sub">
                Plastic Surgery · Rhinoplasty Review
              </div>
              <div className="sbv-row">
                <span style={{ color: "var(--muted)" }}>Availability</span>
                <span className="pill cocoa">Open</span>
              </div>
            </div>
            <div className="sbv-card c3">
              <div className="sbv-hd">Saturday · 2:00 PM</div>
              <div className="sbv-title">Dr. Bhawna Bhardwaj</div>
              <div className="sbv-sub">Laser Hair Reduction · Plan</div>
              <div className="sbv-row">
                <span style={{ color: "var(--muted)" }}>Availability</span>
                <span className="pill">3 slots left</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
