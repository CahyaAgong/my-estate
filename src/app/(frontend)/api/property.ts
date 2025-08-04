import type { NextApiRequest, NextApiResponse } from 'next';

const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}api/properties`; // Ganti jika payload CMS di port/host lain

type Property = {
  id: string;
  title: string;
  slug: string;
  location: string;
  price: string;
  description: string;
  isPublished: boolean;
  image: string;
};

type UpdatePayload = {
  id: string;
  update: Partial<Property>;
};

type DeletePayload = {
  id: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET': {
        const response = await fetch(baseUrl);
        const data = await response.json();
        return res.status(200).json(data);
      }

      case 'POST': {
        console.info('Received POST request:', req.body);
        const property: Property = req.body;

        const response = await fetch(baseUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(property),
        });

        const data = await response.json();
        return res.status(response.status).json(data);
      }

      case 'PATCH': {
        const { id, update } = req.body as UpdatePayload;

        const response = await fetch(`${baseUrl}/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(update),
        });

        const data = await response.json();
        return res.status(response.status).json(data);
      }

      case 'DELETE': {
        const { id } = req.body as DeletePayload;

        const response = await fetch(`${baseUrl}/${id}`, {
          method: 'DELETE',
        });

        const data = await response.json();
        return res.status(response.status).json(data);
      }

      default:
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('[API ERROR]', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
}
