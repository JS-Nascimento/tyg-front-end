import { parseISO } from 'date-fns';

export interface PaginatedResult<T> {
  data: T[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

export type SortOrder = 'ASC' | 'DESC';

export function paginate<T>(
  items: T[],
  currentPage: number,
  itemsPerPage: number,
  sortBy?: keyof T,
  sortOrder: SortOrder = 'ASC',
): PaginatedResult<T> {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const sortedItems = sortBy
    ? [...items].sort((a, b) => {
      const valueA = a[sortBy];
      const valueB = b[sortBy];

      // Se os valores são datas em formato string
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        const dateA = parseISO(valueA);
        const dateB = parseISO(valueB);
        return sortOrder === 'ASC'
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      }
        if (valueA < valueB) return sortOrder === 'ASC' ? -1 : 1;
        if (valueA > valueB) return sortOrder === 'ASC' ? 1 : -1;
        return 0;
      }
    )
    :
      items;

      const page = Math.max(1, Math.min(currentPage, totalPages));

      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const paginatedItems = sortedItems.slice(start, end);

      return {
        data: paginatedItems,
        totalPages,
        currentPage: page,
        totalItems,
      };
    }