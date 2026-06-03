export default function Home() {
  return (
    <section className="flex min-h-[50vh] flex-col justify-center py-12 text-center sm:text-left">
      <div className="max-w-2xl space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Forecastly
        </h1>
        <div className="text-foreground/70 space-y-2 text-lg leading-8 sm:text-xl">
          <p>Smart weather forecasts and recommendations.</p>
          <p>Search for a city to get started.</p>
        </div>
      </div>
    </section>
  );
}
