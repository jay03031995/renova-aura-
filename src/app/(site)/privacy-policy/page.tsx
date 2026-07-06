import type { Metadata } from "next";
import { getClinic } from "@/sanity/lib/fetchers";

export const metadata: Metadata = {
  title: "Privacy Policy | RenovaAura",
  description:
    "Read RenovaAura's privacy policy covering information collection, patient privacy, cookies, data security and contact details.",
  alternates: { canonical: "/privacy-policy" },
};

const sections = [
  {
    title: "Information We Collect",
    body: [
      "We may collect information you provide when you submit a contact form, book a consultation, call or message the clinic, use an assessment tool, or otherwise communicate with RenovaAura.",
      "This may include your name, phone number, email address, treatment interests, appointment preferences, uploaded images, medical or aesthetic concerns shared by you, and messages sent to our team.",
    ],
  },
  {
    title: "How We Use Your Information",
    body: [
      "We use your information to respond to enquiries, schedule appointments, provide consultation support, maintain patient records, improve our services, and share clinic updates related to your care or enquiry.",
      "We do not sell patient or enquiry information. Marketing communication, where used, is limited to relevant clinic updates and can be opted out of by contacting us.",
    ],
  },
  {
    title: "Cookies",
    body: [
      "Our website may use cookies or similar technologies to keep the site functional, understand page performance, improve user experience, and support basic analytics or advertising measurement.",
      "You can control cookies through your browser settings. Some website features may not work as intended if cookies are disabled.",
    ],
  },
  {
    title: "Data Security",
    body: [
      "We use reasonable administrative, technical, and operational safeguards to protect information shared with us from unauthorized access, misuse, loss, or alteration.",
      "No online transmission or storage system is completely secure. Please avoid sharing highly sensitive medical information through public or unsecured channels unless requested by our clinical team.",
    ],
  },
  {
    title: "Third-Party Services",
    body: [
      "We may use trusted third-party services for website hosting, analytics, communication, maps, forms, appointment workflows, payment coordination, or patient support.",
      "These providers may process limited information only as needed to deliver their services. Their own privacy practices may apply when you interact with external platforms.",
    ],
  },
  {
    title: "Patient Privacy",
    body: [
      "Patient consultations, treatment plans, medical history, and clinical images are handled with care and confidentiality.",
      "Before-and-after images or patient stories are published only when appropriate consent has been obtained. Clinical information may be shared internally with relevant doctors or staff involved in patient care.",
    ],
  },
];

export default async function PrivacyPolicyPage() {
  const clinic = await getClinic();

  return (
    <>
      <section className="pillar-hero">
        <div className="container">
          <div className="pillar-hero-eyebrow">Privacy Policy</div>
          <h1 className="pillar-hero-headline">
            How RenovaAura handles your information.
          </h1>
          <p className="pillar-hero-subtitle">
            We respect the privacy of every patient and website visitor. This
            policy explains what we collect, why we collect it, and how we
            protect information shared with our clinic.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container policy-shell">
          <p className="policy-intro">
            This Privacy Policy applies to information collected through the
            RenovaAura website, clinic enquiry channels, booking workflows, and
            related patient communication. It is intended to provide clear,
            practical information and does not replace consent forms or clinical
            documents provided during treatment.
          </p>

          <div className="policy-list">
            {sections.map((section) => (
              <section className="policy-block" key={section.title}>
                <h2>{section.title}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}

            <section className="policy-block">
              <h2>Contact Information</h2>
              <p>
                For privacy questions, corrections, consent requests, or
                concerns about information shared with RenovaAura, please
                contact us using the details below.
              </p>
              <ul>
                <li>Clinic: {clinic.name}</li>
                <li>Address: {clinic.address}</li>
                <li>Phone: {clinic.phone}</li>
                <li>Email: {clinic.email}</li>
              </ul>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}
