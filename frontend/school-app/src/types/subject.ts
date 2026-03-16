export interface SubjectRequest {
  name: string;
  code?: string;
}

export interface SubjectResponse {
  id: number;
  name: string;
  code?: string;
}

// This matches the backend PageResponse structure (adjust if needed)
export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // current page number
  // ... other fields like first, last, etc.
}