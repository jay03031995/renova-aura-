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
            <h2 className="reveal">Talk to a dermatologist this week.</h2>
            <p className="reveal">
              A one-on-one consultation with an MD dermatologist. A written
              plan, on the spot. Honest, unhurried, and built for your skin.
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
              <div className="sbv-title">Dr. Navjot Singh Arora</div>
              <div className="sbv-sub">Dwarka Clinic · Skin Consultation</div>
              <div className="sbv-row">
                <span style={{ color: "var(--muted)" }}>Availability</span>
                <span className="pill">2 slots left</span>
              </div>
            </div>
            <div className="sbv-card c2">
              <div className="sbv-hd">Tomorrow · 11:00 AM</div>
              <div className="sbv-title">Dr. Jasmine Kohli</div>
              <div className="sbv-sub">Dwarka Clinic · Aesthetics Review</div>
              <div className="sbv-row">
                <span style={{ color: "var(--muted)" }}>Availability</span>
                <span className="pill cocoa">Open</span>
              </div>
            </div>
            <div className="sbv-card c3">
              <div className="sbv-hd">Saturday · 2:00 PM</div>
              <div className="sbv-title">Dr. Sonika Soni</div>
              <div className="sbv-sub">Dwarka Clinic · Laser Plan</div>
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
