export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

export interface QueryHeader {
  id: string;
  key: string;
  value: string;
}

export interface SavedQuery {
  id: string;
  name: string;
  method: HTTPMethod;
  url: string;
  headers: QueryHeader[];
  body: string;
  tags: string[];
  isTagged: boolean; // Show on main view
  createdAt: number;
  updatedAt: number;
  lastResponse?: {
    status: number;
    body: string;
    duration: number;
    timestamp: number;
  };
}

export interface RequestResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  duration: number;
}
