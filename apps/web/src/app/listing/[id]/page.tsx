const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface Props { params: { id: string } }

async function fetchListing(id: string) {
  if (process.env.NEXT_PUBLIC_USE_MOCK === '1') {
    return { id: 1, title: 'Mock Listing', price_rm: 1000, provenance: [{ id: 1, source_name: 'Demo', price_rm: 1000 }] };
  }
  const res = await fetch(`${API_BASE}/listing/${id}`);
  return res.json();
}

export default async function ListingPage({ params }: Props) {
  const listing = await fetchListing(params.id);
  return (
    <main className="p-4">
      <h1 className="text-xl">{listing.title}</h1>
      <p>Price: RM{listing.price_rm}</p>
      <h2>Provenance</h2>
      <ul>
        {listing.provenance?.map((p: any) => (
          <li key={p.id}>{p.source_name}: RM{p.price_rm}</li>
        ))}
      </ul>
    </main>
  );
}
