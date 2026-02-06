import { Home, Archive, Tag, Library, MessageSquareText, Box, BookOpen, Globe, FileText } from 'lucide-react';

export const navigation = {
  main: [
    { name: '首页', href: '/', icon: Home },
    { name: '归档', href: '/archive', icon: Archive },
    { name: '标签', href: '/tags', icon: Tag },
  ],
  exhibits: [
    { 
      name: '数字古董 (Whitepapers)', 
      href: '/whitepapers', 
      icon: Globe,
      description: '全球化价值布道与美金资产白皮书',
      featured: true 
    },
    { name: '书阁', href: '/library', icon: Library },
    { name: '思想碎片', href: '/fragments', icon: MessageSquareText },
    { name: '万宝箱', href: '/toolbox', icon: Box },
  ],
  categories: [
    { name: '生花梦 · 小说', href: '/category/novels', icon: BookOpen },
    { name: '零壹 · 编程', href: '/category/tech', icon: FileText },
  ]
};
