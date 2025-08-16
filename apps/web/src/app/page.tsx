const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function fetchListings() {
  if (process.env.NEXT_PUBLIC_USE_MOCK === '1') {
    return [{ id: 1, title: 'Mock Listing', price_rm: 1000 }];
  }
  const res = await fetch(`${API_BASE}/search`);
  const data = await res.json();
  return data.listings as any[];
}

export default async function Page() {
  const listings = await fetchListings();
  return (
    <main className="p-4">
      <h1 className="text-xl">Transit Rentals</h1>
      <ul>
        {listings.map((l) => (
          <li key={l.id}>{l.title} - RM{l.price_rm}</li>
        ))}
      </ul>
    </main>
  );
}
