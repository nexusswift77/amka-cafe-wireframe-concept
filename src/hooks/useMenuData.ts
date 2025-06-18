import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type MenuItemWithCategory = Tables<'menu_items'> & {
  category: Tables<'categories'> | null;
};

export type Category = Tables<'categories'>;

export const useMenuItems = () => {
  return useQuery({
    queryKey: ['menu-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select(`
          *,
          category:categories(*)
        `)
        .order('name');
      
      if (error) throw error;
      return data as MenuItemWithCategory[];
    },
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Category[];
    },
  });
};

export const useMenuItemsByCategory = (categoryId?: string) => {
  return useQuery({
    queryKey: ['menu-items-by-category', categoryId],
    queryFn: async () => {
      let query = supabase
        .from('menu_items')
        .select(`
          *,
          category:categories(*)
        `)
        .order('name');
      
      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as MenuItemWithCategory[];
    },
    enabled: categoryId !== undefined,
  });
};

export const useFeaturedMenuItems = (limit: number = 4) => {
  return useQuery({
    queryKey: ['featured-menu-items', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select(`
          *,
          category:categories(*)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data as MenuItemWithCategory[];
    },
  });
}; 