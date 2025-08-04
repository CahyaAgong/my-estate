'use client'

import {  JSX, useEffect, useState } from "react";
import { Card, Form, Tabs } from "@/components";
import Dialog from "@/components/BaseDialog/Dialog";

type Property = {
  id: string
  title: string;
  image: string;
  location: string;
  price: string;
  description: string;
  isPublished: boolean;
};

type Tab = {
  key: string;
  title: string;
  content: JSX.Element;
};

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isOpen, setIsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [currentDataByIndex, setCurrentDataByIndex] = useState<string | null>(null);

  const renderProperties = (filterFn: (p: Property) => boolean): JSX.Element => {
    const filtered = properties.filter(filterFn);
    if (filtered.length === 0) return <div>No Data...</div>;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((property, index) => (
          <Card key={index} data={property} onUpdate={() => alert('card' + index + ' updated')} onDelete={() => toggleDialog(deleteDialogOpen, setDeleteDialogOpen, property.id)} />
        ))}
      </div>
    );
  };

  const toggleDialog = (
    openDialog: boolean,
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>,
    index: string | null = null
  ) => {
    setOpenDialog(!openDialog);
    setCurrentDataByIndex(index);
  }

  const removeProperty = async(id: string) => {
    if (!id) {
      console.error('No ID provided for deletion');
      return;
    }

    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');

      window.location.reload();
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Delete failed');
    }
  }

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/properties');
        if (!response.ok) throw new Error('Failed to fetch properties');
        const data = await response.json();
        const docs: Property[] = data.docs || [];
        setProperties(docs);
      } catch (error) {
        setProperties([]);
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const tabs: Tab[] = [
    {
      key: "properties",
      title: "All Properties",
      content: renderProperties(() => true),
    },
    {
      key: "published",
      title: "Published",
      content: renderProperties((p) => p.isPublished === true),
    },
    {
      key: "drafts",
      title: "Draft",
      content: renderProperties((p) => p.isPublished === false),
    },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-between py-20 px-8 relative">
      <div className="absolute right-5 cursor-pointer" onClick={() => setIsOpen(true)}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </div>
      <Tabs tabs={tabs} />

      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="overflow-y-auto max-h-[80vh]">
          <Form />
        </div>
      </Dialog>

      <Dialog isOpen={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <div className="overflow-y-auto max-h-[80vh]">
          <h2 className="text-lg font-semibold text-gray-800">Delete Property</h2>
          <p className="text-sm text-gray-600">Are you sure you want to delete this property?</p>
          <div className="flex items-center justify-end gap-2 mt-4">
            <button className="bg-gray-500 text-white px-4 py-2 rounded-md" onClick={() => setDeleteDialogOpen(false)}>Cancel</button>
            <button className="bg-red-500 text-white px-4 py-2 rounded-md" onClick={() => removeProperty(currentDataByIndex || '')}>Delete</button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
