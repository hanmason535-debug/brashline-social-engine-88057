import { LocalizedContent } from './service.types';

export interface BlogPost {
  title: LocalizedContent;
  summary: LocalizedContent;
  image: string;
  date: string;
}

export interface LocalizedBlogPost extends Omit<BlogPost, 'title' | 'summary'> {
  title: string;
  summary: string;
}
