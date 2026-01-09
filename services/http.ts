import { HTTPMethod, QueryHeader, RequestResponse } from '@/types/query';

export const httpService = {
  async sendRequest(
    method: HTTPMethod,
    url: string,
    headers: QueryHeader[],
    body?: string
  ): Promise<RequestResponse> {
    const startTime = Date.now();

    try {
      // Convert headers array to object
      const headerObject: Record<string, string> = {};
      headers.forEach((h) => {
        if (h.key && h.value) {
          headerObject[h.key] = h.value;
        }
      });

      const fetchOptions: RequestInit = {
        method,
        headers: headerObject,
      };

      if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        fetchOptions.body = body;
      }

      const response = await fetch(url, fetchOptions);
      const responseBody = await response.text();
      const duration = Date.now() - startTime;

      return {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: responseBody,
        duration,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      throw {
        status: 0,
        statusText: error instanceof Error ? error.message : 'Network Error',
        headers: {},
        body: error instanceof Error ? error.message : 'Unknown error',
        duration,
      };
    }
  },
};
