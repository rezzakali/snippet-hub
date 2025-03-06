import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const getLanguageLogoPath = (language: string) => {
  const languageMap: { [key: string]: string } = {
    'c++': 'cplusplus',
    'c#': 'csharp',
    css: 'css3',
    sql: 'mysql',
  };

  const normalizedLang = language.toLowerCase();
  const mappedLang = languageMap[normalizedLang] || normalizedLang;

  // Use 'plain' for GraphQL, 'original' for everything else
  const suffix = mappedLang === 'graphql' ? 'plain' : 'original';

  const logoPath = `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${mappedLang}/${mappedLang}-${suffix}.svg`;

  return logoPath;
};

export const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description is too long'),
  code: z
    .string()
    .min(1, 'Code snippet is required')
    .max(2000, 'Code snippet is too long'),
  language: z.string().min(1, 'Language is required'),
  tags: z.string().min(1, 'At least one tag is required'),
});

const getSnippetsApiPath = (filter: string, queryParams: URLSearchParams) => {
  const basePath =
    filter === 'all' ? '/api/snippets' : `/api/snippets/${filter}`;
  const queryString = queryParams.toString()
    ? `?${queryParams.toString()}`
    : '';
  return `${basePath}${queryString}`;
};

export const fetchSnippets = async (
  searchTerm: string,
  selectedTags: string[],
  page: number,
  filter: 'all' | 'favourite' | 'trash'
) => {
  try {
    const queryParams = new URLSearchParams();
    if (searchTerm) queryParams.set('search', searchTerm);
    if (selectedTags.length > 0 && selectedTags[0] !== 'all') {
      queryParams.set('tags', selectedTags.join(','));
    }
    queryParams.set('page', page.toString());

    // ✅ Dynamically build the API path
    const apiPath = getSnippetsApiPath(filter, queryParams);

    const response = await fetch(apiPath, { method: 'GET' });

    if (!response.ok)
      throw new Error(`Failed to fetch snippets: ${response.status}`);

    return await response.json();
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Unknown error occurred'
    );
  }
};
