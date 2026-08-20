import { listEpisodes } from '@/lib/mdcms';

export default async function PreviewPage() {
  const episodes = await listEpisodes(20, 120);

  // Fallback: if MDCMS not configured, load sample data
  const usingSample = !process.env.MDCMS_API_KEY;
  const items = usingSample ? (await import('../../data/mdcms-sample.json')).default : episodes;

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">MDCMS Preview</h1>
      <ul className="space-y-4">
        {items.map((ep: any) => (
          <li key={ep.slug ?? ep.id} className="p-4 border rounded hover:bg-slate-800">
            <a href={`/episode/${ep.slug ?? ep.id}`} className="block">
              <div className="flex items-start gap-4">
                {ep.image && <img src={ep.image} alt={ep.title} className="w-24 h-24 object-cover rounded" />}
                <div>
                  <h2 className="text-lg font-semibold">{ep.title}</h2>
                  <p className="text-sm text-slate-400">{ep.excerpt ?? ep.summary}</p>
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
