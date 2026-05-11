const FAVORITES_STORAGE_PREFIX = "smartMoroccoFavorites";

export const getFavoriteOwnerId = (user) => {
  if (user?.id_utilisateur) {
    return `user-${user.id_utilisateur}`;
  }

  if (user?.email) {
    return `email-${String(user.email).toLowerCase()}`;
  }

  return "guest";
};

export const getFavoritesStorageKey = (user) =>
  `${FAVORITES_STORAGE_PREFIX}:${getFavoriteOwnerId(user)}`;

export const normalizeFavoritePack = (pack) => ({
  id: pack.id,
  nomPack: pack.nomPack || "Pack voyage",
  destination: pack.destination || "Maroc",
  description: pack.description || "",
  duree: pack.duree || 0,
  prixTotal: pack.prixTotal || 0,
  imageUrl: pack.imageUrl || "/images/ESSAOUIRA.jpg",
});

export const readFavoritePacks = (user) => {
  try {
    const rawFavorites = localStorage.getItem(getFavoritesStorageKey(user));
    const favorites = JSON.parse(rawFavorites || "[]");
    return Array.isArray(favorites) ? favorites : [];
  } catch {
    return [];
  }
};

export const writeFavoritePacks = (user, favorites) => {
  try {
    localStorage.setItem(getFavoritesStorageKey(user), JSON.stringify(favorites));
  } catch {
    // Keep the UI usable even if persistence is unavailable.
  }
};

export const isFavoritePack = (favorites, packId) =>
  favorites.some((favorite) => String(favorite.id) === String(packId));

export const toggleFavoritePack = (user, favorites, pack) => {
  const isAlreadyFavorite = isFavoritePack(favorites, pack.id);
  const nextFavorites = isAlreadyFavorite
    ? favorites.filter((favorite) => String(favorite.id) !== String(pack.id))
    : [normalizeFavoritePack(pack), ...favorites];

  writeFavoritePacks(user, nextFavorites);
  return nextFavorites;
};

export const removeFavoritePack = (user, favorites, packId) => {
  const nextFavorites = favorites.filter((favorite) => String(favorite.id) !== String(packId));
  writeFavoritePacks(user, nextFavorites);
  return nextFavorites;
};
