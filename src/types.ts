export interface Link { label: string; url: string }
export interface Session { user: string; avatar: string }
export interface TopicItem {
  id: string; url: string; title: string; author: string; avatar: string;
  node: Link; replies: number; time: string; lastUser: string;
}
export interface Pagination { current: number; total: number; links: Link[] }
export interface TopicList {
  url: string; title: string; items: TopicItem[]; tabs: Link[]; nodes: Link[];
  pagination: Pagination; session: Session;
}
export interface NativeForm {
  action: string; method: string; fields: Record<string, string>; contentKey: string;
  titleKey?: string; nodeKey?: string; nodes: Link[];
}
export interface Action { url: string; method: 'GET' | 'POST'; label: string; done: boolean; prompt: string }
export interface Message {
  id: string; floor: string; author: string; avatar: string; time: string;
  html: string; thank?: Action;
}
export interface Topic {
  id: string; url: string; title: string; node: Link; author: string; avatar: string;
  time: string; html: string; supplements: { label: string; html: string }[];
  messages: Message[]; replies: number; pagination: Pagination;
  session: Session; replyForm?: NativeForm; replyNotice: string;
  favorite?: Action; thank?: Action;
}
