export interface BreadcrumbItem {
  label: string;
  icon?: string;
  route?: string;
}

export interface MessageNotify {
  severity: string;
  icon?: string;
  content: string;
  description: string;
  badge?: string;
}
