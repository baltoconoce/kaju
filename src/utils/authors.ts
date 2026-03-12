// src/utils/authors.ts - UTILIDADES CENTRALIZADAS PARA AUTORES

// 🔧 INTERFACE PARA DATOS DE AUTOR
export interface AuthorData {
  name: string;
  avatar: string;
  bio?: string;
  role?: string;
  email?: string;
  socialMedia?: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

// 🎨 CONFIGURACIÓN DE AUTORES - BASE DE DATOS CENTRALIZADA
const AUTHORS_DATABASE: Record<string, AuthorData> = {
  // Autores principales con datos completos
  'Ana María Prieto': {
    name: 'Ana María Prieto',
    avatar: '/images/ana-p2.webp',
    bio: 'Mamá de Río, mi Aussie, y apasionada por el cuidado y bienestar de las mascotas',
    role: 'Bienestar y cuidado de mascotas ',
    email: 'ana@kajumagazine.com'
  },
  
  'Manuel Alejandro Bedoya': {
    name: 'Manuel Alejandro Bedoya',
    avatar: '/images/manuel-p1.webp',
    bio: 'Papá de Río, creador de Kajú y apasionado por el comportamiento, bienestar y cuidado de los perros.',
    role: 'Creador de Kajú | Papá de Río',
    email: 'manuel@kajumagazine.com'
  },
  
  // MARCA PRINCIPAL: KAJÚ
  'Equipo Editorial Kajú': {
    name: 'Equipo Editorial Kajú',
    avatar: '/images/kajulogo.svg',
    bio: 'Parte de la comunidad de Kajú, compartiendo contenido útil, cercano y relevante sobre mascotas, bienestar y vida pet-friendly.',
    role: 'Equipo editorial',
    email: 'editorial@kajumagazine.com'
  },
  
  'Editor Kajú': {
    name: 'Editor Kajú',
    avatar: '/images/kajulogo.svg',
    bio: 'Parte de la comunidad de Kajú, compartiendo contenido útil, cercano y relevante sobre mascotas, bienestar y vida pet-friendly.',
    role: 'Editor principal',
    email: 'editor@kajumagazine.com'
  },
  
  // Aliases y variaciones (para compatibilidad con contenido anterior)
  'Equipo Editorial Balto': {
    name: 'Equipo Editorial Kajú', // Redirige al nombre actual
    avatar: '/images/kajulogo.svg',
    bio: 'Equipo de expertos en mascotas dedicados a crear contenido de calidad',
    role: 'Equipo editorial',
    email: 'editorial@kajumagazine.com'
  },
  
  'Editor Balto': {
    name: 'Editor Kajú', // Redirige al nombre actual
    avatar: '/images/kajulogo.svg',
    bio: 'Editor principal especializado en contenido sobre mascotas',
    role: 'Editor principal',
    email: 'editor@kajumagazine.com'
  }
};

// 🔧 FUNCIÓN PRINCIPAL PARA OBTENER AVATAR DEL AUTOR
export function getAuthorAvatar(authorName: string | undefined | null): string {
  // Validación inicial
  if (!authorName || typeof authorName !== 'string') {
    return AUTHORS_DATABASE['Editor Kajú'].avatar;
  }

  // Normalizar el nombre
  const normalizedName = normalizeAuthorName(authorName);
  
  // Buscar en la base de datos de autores
  if (AUTHORS_DATABASE[authorName]) {
    return AUTHORS_DATABASE[authorName].avatar;
  }
  
  // Buscar por nombre normalizado
  const foundByNormalized = Object.keys(AUTHORS_DATABASE).find(key => 
    normalizeAuthorName(key) === normalizedName
  );
  
  if (foundByNormalized) {
    return AUTHORS_DATABASE[foundByNormalized].avatar;
  }
  
  // Fallback por defecto
  return AUTHORS_DATABASE['Editor Kajú'].avatar;
}

// 🔧 FUNCIÓN PARA OBTENER DATOS COMPLETOS DEL AUTOR
export function getAuthorData(authorName: string | undefined | null): AuthorData {
  // Validación inicial
  if (!authorName || typeof authorName !== 'string') {
    return AUTHORS_DATABASE['Editor Kajú'];
  }

  // Buscar en la base de datos
  if (AUTHORS_DATABASE[authorName]) {
    return AUTHORS_DATABASE[authorName];
  }

  // Normalizar y buscar
  const normalizedName = normalizeAuthorName(authorName);
  const foundByNormalized = Object.keys(AUTHORS_DATABASE).find(key => 
    normalizeAuthorName(key) === normalizedName
  );
  
  if (foundByNormalized) {
    return AUTHORS_DATABASE[foundByNormalized];
  }

  // Crear datos por defecto para autor desconocido
  return {
    name: authorName,
    avatar: AUTHORS_DATABASE['Editor Kajú'].avatar,
    bio: 'Colaborador especialista en mascotas',
    role: 'Colaborador',
    email: 'colaborador@kajumagazine.com'
  };
}

// 🔧 FUNCIÓN PARA OBTENER BIO DEL AUTOR
export function getAuthorBio(authorName: string | undefined | null): string {
  const authorData = getAuthorData(authorName);
  return authorData.bio || 'Mamá de Río, mi Aussie, apasionada por el bienestar, el cuidado y la felicidad de las mascotas';
}

// 🔧 FUNCIÓN PARA NORMALIZAR NOMBRES DE AUTORES
function normalizeAuthorName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/\s+/g, ' '); // Normalizar espacios
}

// 🔧 FUNCIÓN PARA VALIDAR SI UN AUTOR EXISTE
export function isValidAuthor(authorName: string | undefined | null): boolean {
  if (!authorName || typeof authorName !== 'string') {
    return false;
  }
  
  return AUTHORS_DATABASE.hasOwnProperty(authorName) || 
         Object.keys(AUTHORS_DATABASE).some(key => 
           normalizeAuthorName(key) === normalizeAuthorName(authorName)
         );
}

// 🔧 FUNCIÓN PARA OBTENER LISTA DE TODOS LOS AUTORES
export function getAllAuthors(): AuthorData[] {
  return Object.values(AUTHORS_DATABASE).filter((author, index, arr) => 
    // Filtrar duplicados por nombre
    arr.findIndex(a => a.name === author.name) === index
  );
}

// 🔧 FUNCIÓN PARA BÚSQUEDA DE AUTORES
export function searchAuthors(query: string): AuthorData[] {
  if (!query || typeof query !== 'string') {
    return [];
  }
  
  const searchTerm = normalizeAuthorName(query);
  
  return getAllAuthors().filter(author => 
    normalizeAuthorName(author.name).includes(searchTerm) ||
    normalizeAuthorName(author.bio || '').includes(searchTerm) ||
    normalizeAuthorName(author.role || '').includes(searchTerm)
  );
}

// 🔧 FUNCIONES DE COMPATIBILIDAD (para uso legacy)
export const getAuthor = getAuthorData;
export const authorExists = isValidAuthor;

// 🔧 EXPORT DEFAULT CON TODAS LAS FUNCIONES
export default {
  getAuthorAvatar,
  getAuthorData,
  getAuthorBio,
  isValidAuthor,
  getAllAuthors,
  searchAuthors,
}