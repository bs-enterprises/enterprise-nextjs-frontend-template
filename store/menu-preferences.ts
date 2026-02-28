import StorageKeys from '@/constants/storage-constants';

const DEFAULT_PINNED: string[] = ['dashboard', 'analytics', 'projects', 'tasks', 'settings'];

export function getPinnedMenuIds(): string[] {
  if (typeof window === 'undefined') return DEFAULT_PINNED;
  try {
    const stored = localStorage.getItem(StorageKeys.PINNED_MENUS);
    if (!stored) return DEFAULT_PINNED;
    return JSON.parse(stored) as string[];
  } catch {
    return DEFAULT_PINNED;
  }
}

export function getMenuOrder(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(StorageKeys.MENU_ORDER);
    if (!stored) return [];
    return JSON.parse(stored) as string[];
  } catch {
    return [];
  }
}

export function getOrderedPinnedMenuIds(): string[] {
  const pinned = getPinnedMenuIds();
  const order = getMenuOrder();

  if (order.length === 0) return pinned;

  const ordered = order.filter((id) => pinned.includes(id));
  const remaining = pinned.filter((id) => !order.includes(id));
  return [...ordered, ...remaining];
}

export function addPinnedMenu(menuId: string): void {
  if (typeof window === 'undefined') return;
  const pinned = getPinnedMenuIds();
  if (!pinned.includes(menuId)) {
    const updated = [...pinned, menuId];
    localStorage.setItem(StorageKeys.PINNED_MENUS, JSON.stringify(updated));
    const order = getMenuOrder();
    localStorage.setItem(StorageKeys.MENU_ORDER, JSON.stringify([...order, menuId]));
  }
}

export function removePinnedMenu(menuId: string): void {
  if (typeof window === 'undefined') return;
  const pinned = getPinnedMenuIds();
  const updated = pinned.filter((id) => id !== menuId);
  localStorage.setItem(StorageKeys.PINNED_MENUS, JSON.stringify(updated));
}
