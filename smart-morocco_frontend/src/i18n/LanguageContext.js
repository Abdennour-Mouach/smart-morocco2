import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "language";

export const SUPPORTED_LANGUAGES = [
  { code: "fr", short: "FR", label: "Français", locale: "fr-FR", dir: "ltr" },
  { code: "en", short: "EN", label: "English", locale: "en-US", dir: "ltr" },
  { code: "es", short: "ES", label: "Español", locale: "es-ES", dir: "ltr" },
  { code: "ar", short: "AR", label: "العربية", locale: "ar-MA", dir: "rtl" },
];

const translations = {
  fr: {
    nav: {
      home: "Accueil",
      about: "A propos",
      contact: "Contact",
      packs: "Packs",
      reservation: "Reservation",
    },
    auth: {
      login: "Connexion",
      register: "Inscription",
      profile: "Profil",
      myReservations: "Mes Reservations",
      settings: "Parametres",
      logout: "Deconnexion",
    },
    profile: {
      myProfile: "Mon Profil",
      myReservations: "Mes Reservations",
      settings: "Parametres",
      logout: "Deconnexion",
    },
    notifications: {
      title: "Notifications",
      noNotifications: "Aucune notification",
      markAsRead: "Marquer comme lue",
    },
    likes: {
      title: "J'adore",
    },
    language: {
      choose: "Changer la langue",
      current: "Langue actuelle",
    },
    preferences: {
      languageRegion: "Langue et region",
      language: "Langue",
      languageHint: "Ce choix est conserve pour vos prochaines visites",
    },
  },
  en: {
    nav: {
      home: "Home",
      about: "About",
      contact: "Contact",
      packs: "Packs",
      reservation: "Reservation",
    },
    auth: {
      login: "Login",
      register: "Register",
      profile: "Profile",
      myReservations: "My Reservations",
      settings: "Settings",
      logout: "Logout",
    },
    profile: {
      myProfile: "My Profile",
      myReservations: "My Reservations",
      settings: "Settings",
      logout: "Logout",
    },
    notifications: {
      title: "Notifications",
      noNotifications: "No notifications",
      markAsRead: "Mark as read",
    },
    likes: {
      title: "Like",
    },
    language: {
      choose: "Change language",
      current: "Current language",
    },
    preferences: {
      languageRegion: "Language and region",
      language: "Language",
      languageHint: "This choice is saved for your next visits",
    },
  },
  es: {
    nav: {
      home: "Inicio",
      about: "Acerca de",
      contact: "Contacto",
      packs: "Paquetes",
      reservation: "Reservas",
    },
    auth: {
      login: "Iniciar sesion",
      register: "Registrarse",
      profile: "Perfil",
      myReservations: "Mis reservas",
      settings: "Ajustes",
      logout: "Cerrar sesion",
    },
    profile: {
      myProfile: "Mi perfil",
      myReservations: "Mis reservas",
      settings: "Ajustes",
      logout: "Cerrar sesion",
    },
    notifications: {
      title: "Notificaciones",
      noNotifications: "Sin notificaciones",
      markAsRead: "Marcar como leida",
    },
    likes: {
      title: "Me gusta",
    },
    language: {
      choose: "Cambiar idioma",
      current: "Idioma actual",
    },
    preferences: {
      languageRegion: "Idioma y region",
      language: "Idioma",
      languageHint: "Guardaremos esta opcion para tus proximas visitas",
    },
  },
  ar: {
    nav: {
      home: "الرئيسية",
      about: "من نحن",
      contact: "اتصل بنا",
      packs: "العروض",
      reservation: "الحجوزات",
    },
    auth: {
      login: "تسجيل الدخول",
      register: "انشاء حساب",
      profile: "الملف الشخصي",
      myReservations: "حجوزاتي",
      settings: "الاعدادات",
      logout: "تسجيل الخروج",
    },
    profile: {
      myProfile: "ملفي الشخصي",
      myReservations: "حجوزاتي",
      settings: "الاعدادات",
      logout: "تسجيل الخروج",
    },
    notifications: {
      title: "الاشعارات",
      noNotifications: "لا توجد اشعارات",
      markAsRead: "تحديد كمقروء",
    },
    likes: {
      title: "اعجبني",
    },
    language: {
      choose: "تغيير اللغة",
      current: "اللغة الحالية",
    },
    preferences: {
      languageRegion: "اللغة والمنطقة",
      language: "اللغة",
      languageHint: "سيتم حفظ هذا الاختيار لزياراتك القادمة",
    },
  },
};

const LanguageContext = createContext(null);

const isSupportedLanguage = (code) =>
  SUPPORTED_LANGUAGES.some((language) => language.code === code);

const getInitialLanguage = () => {
  try {
    const savedLanguage = localStorage.getItem(STORAGE_KEY);
    if (isSupportedLanguage(savedLanguage)) {
      return savedLanguage;
    }
  } catch {
    // Browser storage can be unavailable in restricted environments.
  }

  return "fr";
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(getInitialLanguage);

  const currentLanguage = useMemo(
    () => SUPPORTED_LANGUAGES.find((item) => item.code === language) || SUPPORTED_LANGUAGES[0],
    [language]
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // Keep the UI working even when persistence is blocked.
    }

    document.documentElement.lang = currentLanguage.locale;
    document.documentElement.dir = currentLanguage.dir;
  }, [language, currentLanguage]);

  const setLanguage = useCallback((nextLanguage) => {
    if (isSupportedLanguage(nextLanguage)) {
      setLanguageState(nextLanguage);
    }
  }, []);

  const value = useMemo(
    () => ({
      language,
      currentLanguage,
      languages: SUPPORTED_LANGUAGES,
      setLanguage,
      t: translations[language] || translations.fr,
    }),
    [language, currentLanguage, setLanguage]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }

  return context;
};
