import { CLINIC, telHref, waHref } from "@/data/clinic";
import {
  ArrowRight,
  Clock,
  Mail,
  MapPin,
  Phone,
  WhatsappLine,
} from "@/components/icons";

export default function Contact() {
  return (
    <section className="contact-section" id="contact">
      <div className="container">
        <div className="section-head reveal" style={{ marginBottom: 50 }}>
          <div className="section-head-copy">
            <div className="eyebrow">Get in touch</div>
            <h2>Two ways to reach us. Both are answered.</h2>
          </div>
          <p>
            Walk in, call, message or email, our care team replies within 10
            minutes during clinic hours.
          </p>
        </div>
        <div className="contact-grid">
          <div className="contact-info reveal">
            <div className="eyebrow">Dwarka, New Delhi</div>
            <h2>We&apos;d love to hear from you.</h2>
            <p>
              Whether you have a question about a treatment, want to book a
              consultation, or simply explore your options, we&apos;re here.
            </p>
            <div className="contact-list">
              <div className="contact-item">
                <div className="contact-item-icon">
                  <MapPin />
                </div>
                <div>
                  <div className="contact-item-label">Clinic Address</div>
                  <div className="contact-item-val">{CLINIC.address}</div>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-item-icon">
                  <Phone size={16} />
                </div>
                <div>
                  <div className="contact-item-label">Call us</div>
                  <div className="contact-item-val">
                    <a href={telHref(CLINIC.phone)}>{CLINIC.phone}</a>
                    <br />
                    <a href={telHref(CLINIC.phone2)}>{CLINIC.phone2}</a>
                  </div>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-item-icon">
                  <WhatsappLine />
                </div>
                <div>
                  <div className="contact-item-label">WhatsApp</div>
                  <div className="contact-item-val">
                    <a
                      href={waHref()}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Chat with our care team
                    </a>
                  </div>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-item-icon">
                  <Mail />
                </div>
                <div>
                  <div className="contact-item-label">Email</div>
                  <div className="contact-item-val">
                    <a href={`mailto:${CLINIC.email}`}>{CLINIC.email}</a>
                  </div>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-item-icon">
                  <Clock />
                </div>
                <div>
                  <div className="contact-item-label">Clinic hours</div>
                  <div className="contact-item-val">{CLINIC.hours}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-map reveal">
            <iframe
              className="contact-map-frame"
              src="https://www.google.com/maps?q=Dermaheal+Skin+Clinic+Ramphal+Chowk+Dwarka&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Dermaheal Skin & Hair Clinic. Dwarka"
            />
            <div className="contact-map-foot">
              <strong>Easy parking · Near Ramphal Chowk Metro</strong>
              <a
                href="https://www.google.com/maps?q=Dermaheal+Skin+Clinic+Ramphal+Chowk+Dwarka"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in Google Maps <ArrowRight size={12} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
