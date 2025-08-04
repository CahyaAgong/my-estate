import { notFound } from 'next/navigation';
import Image from 'next/image';

type Property = {
  id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  image: string
  location?: string;
  price?: string;
  description?: string;
};

async function getPropertyBySlug(slug: string): Promise<Property | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/properties?where[slug][equals]=${slug}`,
      { cache: 'no-store' } // ensure fresh data
    );
    const json = await res.json();
    const property = json.docs[0];
    return property || null;
  } catch (err) {
    console.error('Fetch error:', err);
    return null;
  }
}

export default async function PropertyDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const property = await getPropertyBySlug(params.slug);

  if (!property) return notFound();


  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden">
        {/* Image */}
        {property.image && (
          <div className="w-full h-72 relative">
            <Image
              src={property.image}
              alt={property.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-4">
          <h1 className="text-2xl font-bold text-gray-800">{property.title}</h1>

          {/* Location */}
          {property.location && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
              {property.location}
            </div>
          )}

          {/* Price */}
          {property.price && (
            <div className="text-xl font-semibold text-blue-600">{Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(property.price))}</div>
          )}

          {/* Description */}
          {property.description && (
            <p className="text-sm text-gray-700 leading-relaxed">
              {property.description}
            </p>
          )}

          {/* Status */}
          <p className="text-xs text-gray-400">
            Status: {property.isPublished ? 'Published' : 'Draft'}
          </p>
        </div>
      </div>
    </div>
  );
}
