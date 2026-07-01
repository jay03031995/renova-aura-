import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { getEquipments } from "@/sanity/lib/fetchers";

export const metadata: Metadata = {
  title: "Tools & Equipments — RenovaAura Clinic Technology",
  description:
    "Explore the machines, devices, technologies and equipment used at RenovaAura for hair, skin, body and plastic surgery care.",
  alternates: { canonical: "/tools-equipments" },
};

export default async function ToolsEquipmentsPage() {
  const equipments = await getEquipments();
  const featured = equipments.filter((item) => item.featured);
  const categories = Array.from(new Set(equipments.map((item) => item.category)));

  return (
    <>
      <section className="pillar-hero equipment-hero">
        <div className="container">
          <div className="pillar-hero-eyebrow">Tools & Equipments</div>
          <h1 className="pillar-hero-headline">
            Technology chosen for precision, comfort and safety.
          </h1>
          <p className="pillar-hero-subtitle">
            A curated look at the clinic machines, devices and treatment
            technologies RenovaAura uses across hair, skin, body and surgical
            care.
          </p>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="section equipment-featured-section">
          <div className="container">
            <div className="eyebrow" style={{ marginBottom: 18 }}>
              Featured Technology
            </div>
            <div className="equipment-featured-grid">
              {featured.map((item) => (
                <EquipmentCard key={item.slug} item={item} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          {categories.map((category) => (
            <div key={category} className="equipment-category">
              <h2 className="equipment-category-title">{category}</h2>
              <div className="equipment-grid">
                {equipments
                  .filter((item) => item.category === category)
                  .map((item) => (
                    <EquipmentCard key={item.slug} item={item} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function EquipmentCard({
  item,
  featured = false,
}: {
  item: Awaited<ReturnType<typeof getEquipments>>[number];
  featured?: boolean;
}) {
  return (
    <Link
      href={`/tools-equipments/${item.slug}`}
      className={"equipment-card" + (featured ? " equipment-card-featured" : "")}
    >
      {item.image && (
        <div
          className="equipment-card-image"
          style={{ backgroundImage: `url(${item.image})` }}
        />
      )}
      <div className="equipment-card-body">
        <span className="proc-card-tag">{item.category}</span>
        <h3 className="equipment-card-title">{item.name}</h3>
        <p className="equipment-card-copy">{item.shortDescription}</p>
        <span className="proc-card-link">
          View details <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
}
