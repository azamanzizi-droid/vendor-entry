export interface InventoryItem {
  id: string;
  date: string;
  nama: string;
  vendor: string;
  imageUrl?: string;
  hargaKos?: number;
  hargaJual?: number;
  kuantitiStok: number;
  notes: string;
}

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error';
}
