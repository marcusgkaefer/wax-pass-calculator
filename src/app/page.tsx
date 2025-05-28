export default function Home() {
  return (
    <main className="container py-12">
      <section className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-6">
          Smart Waxing Solutions for Everyone
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Experience the best waxing services with our customizable Wax Pass system.
        </p>
        <div className="flex justify-center gap-4">
          <a 
            href="/wax-pass/find" 
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Find My Best Pass
          </a>
          <a 
            href="/locations" 
            className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Locate a Center
          </a>
        </div>
      </section>

      <section className="max-w-4xl mx-auto mt-24">
        <h2 className="text-3xl font-bold text-center mb-12">Our Popular Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {['Brazilian Wax', 'Bikini Wax', 'Eyebrow Wax'].map((service) => (
            <div key={service} className="bg-card p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-xl mb-2">{service}</h3>
              <p className="text-muted-foreground mb-4">
                Professional, quick, and comfortable service with lasting results.
              </p>
              <a href="/services" className="text-primary font-medium">
                Learn more →
              </a>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
} 