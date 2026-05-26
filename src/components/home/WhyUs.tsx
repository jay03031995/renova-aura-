import { getEeatPillars } from "@/sanity/lib/fetchers";

export default async function WhyUs() {
  const pillars = await getEeatPillars();

  return (
    <section className="section why">
      <div className="container">
        <div className="why-grid">
          <div className="why-visual reveal">
            <div className="why-img main">
              <div className="why-tag">Procedure Room, Dwarka Clinic</div>
            </div>
            <div className="why-img sub" />
            <div className="why-stat">
              <div className="why-stat-num">
                97<sup>%</sup>
              </div>
              <div className="why-stat-label">Would refer a friend</div>
            </div>
          </div>
          <div className="reveal">
            <div className="eyebrow" style={{ marginBottom: 16 }}>
              The Dermaheal standard · EEAT
            </div>
            <h2 style={{ marginBottom: 38 }}>
              Four pillars behind every treatment we perform.
            </h2>
            <div className="eeat-list">
              {pillars.map((e, i) => (
                <div className="eeat-card" key={i}>
                  <div className="eeat-icon">
                    <span className="eeat-letter">{e.letter}</span>
                  </div>
                  <div>
                    <div className="eeat-title">{e.title}</div>
                    <div className="eeat-desc">{e.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
