import { useState } from 'react';

export function useResourcePage<T extends { _id: string }>() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [editItem, setEditItem] = useState<T | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const openCreate = () => {
    setEditItem(null);
    setIsFormOpen(true);
  };

  const openEdit = (item: T) => {
    setEditItem(item);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditItem(null);
  };

  return {
    page,
    setPage,
    search,
    setSearch: (v: string) => { setSearch(v); setPage(1); },
    editItem,
    deleteId,
    setDeleteId,
    isFormOpen,
    openCreate,
    openEdit,
    closeForm,
  };
}
