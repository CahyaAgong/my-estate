'use client'

import { useEffect, useState } from "react";

const Form = () => {
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [location, setLocation] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [isPublished, setIsPublished] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const slugify = (text: string) =>
        text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = {
                title,
                slug,
                location,
                price,
                description,
                image,
                isPublished,
            };
            const res = await fetch('/api/properties', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Gagal menambahkan properti');

        } catch (err: any) {
            console.info(`Error: ${err.message}`);
        } finally {
            setIsSubmitting(false);
            window.location.reload();
        }
    };

    useEffect(() => {
        setSlug(slugify(title));
    }, [title]);
    
    return (
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white space-y-4">
        <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
            required
            />
        </div>

        <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input
            type="text"
            value={slug}
            readOnly
            className="w-full bg-gray-100 border rounded-md px-3 py-2 text-gray-500"
            />
        </div>

        <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
            required
            />
        </div>

        <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
            required
            />
        </div>

        <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
            placeholder="https://example.com/image.jpg"
            />
        </div>

        <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full border rounded-md px-3 py-2"
            ></textarea>
        </div>

        <div className="flex items-center space-x-2">
            <input
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            type="checkbox"
            className="h-4 w-4 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="block text-sm font-medium mb-1">Published</label>
        </div>

        <div>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700" disabled={isSubmitting}>
                {isSubmitting ? 'Loading...' : 'Submit'}
            </button>
        </div>
    </form>
    )
}

export default Form;