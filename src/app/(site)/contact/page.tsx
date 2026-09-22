import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import BookButton from "@/components/BookButton";
import {
  ArrowRight,
  Clock,
  Mail,
  MapPin,
  Phone,
  WhatsappLogo,
  InstagramIcon,
  YoutubeIcon,
  LinkedinIcon,
} from "@/components/icons";
import { CLINIC, telHref, waHref } from "@/data/clinic";
import { getClinic } from "@/sanity/lib/fetchers";

export const metadata: Metadata = {
  title: "Contact RenovaAura — Book a Consultation | Anand Vihar, New Delhi",
  description:
    "Get in touch with RenovaAura in Anand Vihar, New Delhi. Call, WhatsApp or send us a message to book a consultation for hair, skin, plastic surgery and body treatments.",
  alternates: { canonical: "/contact" },
};

const mapsQuery = CLINIC.mapsQuery;

export default async function ContactPage() {
  const clinic = await getClinic();

  return (
    <>
      <section className="pillar-hero">
        <div className="container">
          <div className="pillar-hero-eyebrow">Get in touch</div>
          <h1 className="pillar-hero-headline">We&apos;d love to hear from you.</h1>
          <p className="pillar-hero-subtitle">
            Book a consultation, ask about a treatment, or just say hello. Our
            care team replies within clinic hours.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-page-grid">
          {/* Form */}
          <div className="contact-page-form">
            <div className="eyebrow" style={{ marginBottom: 14 }}>
              Send a message
            </div>
            <h2 style={{ marginBottom: 24 }}>Tell us how we can help.</h2>
            <ContactForm />
          </div>

          {/* Info */}
          <div className="contact-page-info">
            <div className="contact-info-card">
              <div className="contact-item">
                <div className="contact-item-icon"><MapPin /></div>
                <div>
                  <div className="contact-item-label">Clinic address</div>
                  <div className=" text-black">{clinic.address}</div>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-item-icon"><Phone size={16} /></div>
                <div>
                  <div className="contact-item-label">Call us</div>
                  <div className="text-black">
                    <a href={telHref(clinic.phone)}>{clinic.phone}</a>
                  </div>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-item-icon"><WhatsappLogo size={18} /></div>
                <div>
                  <div className="contact-item-label">WhatsApp</div>
                  <div className="text-black">
                    <a href={waHref()} target="_blank" rel="noopener noreferrer">
                      Chat with our care team
                    </a>
                  </div>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-item-icon"><Mail /></div>
                <div>
                  <div className="contact-item-label">Email</div>
                  <div className="text-black">
                    <a href={`mailto:${clinic.email}`}>{clinic.email}</a>
                  </div>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-item-icon"><Clock /></div>
                <div>
                  <div className="contact-item-label">Clinic hours</div>
                  <div className="text-black">{clinic.hours}</div>
                </div>
              </div>
            </div>

            <div className="contact-emergency">
              <strong>Urgent / post-procedure concern?</strong>
              <p>
                For urgent post-treatment questions, call or WhatsApp us on{" "}
                <a href={telHref(clinic.phone)}>{clinic.phone}</a> and mention it
                is urgent.
              </p>
            </div>

            <div className="contact-socials">
              <a href={clinic.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><InstagramIcon /></a>
              <a href={clinic.social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube"><YoutubeIcon /></a>
              <a href={clinic.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><LinkedinIcon /></a>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="contact-map">
            <iframe
              className="contact-map-frame"
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14005.867073023084!2d77.29643845669221!3d28.645739460517085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfbe2a421adb7%3A0xf631ccc92514fec0!2sDr.%20Bhawna%20Bhardwaj%20-%20Dermatologist%20%7C%20Renovaaura!5e0!3m2!1sen!2sin!4v1783320030336!5m2!1sen!2sin`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="RenovaAura · Anand Vihar, New Delhi"
            />
            <div className="contact-map-foot">
              <strong>Easy parking · Near Anand Vihar Metro</strong>
              <a
                href={`https://www.google.com/maps?q=${mapsQuery}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in Google Maps <ArrowRight size={12} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="dp-cta-section">
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 14 }}>Book Appointment</div>
          <h2>Ready when you are.</h2>
          <p>
            A one-on-one assessment, a written treatment plan, and honest
            guidance — that&apos;s how every appointment at RenovaAura begins.
          </p>
          <BookButton>Book a consultation</BookButton>
        </div>
      </section>
    </>
  );
}
