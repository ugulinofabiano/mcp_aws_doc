export interface Tool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  service?: string;
  relevanceScore?: number;
}

export interface ServiceInfo {
  name: string;
  displayName: string;
  description: string;
  category: string;
  documentationUrl: string;
}

export interface PricingInfo {
  service: string;
  region?: string;
  pricingDetails: {
    model: string;
    price: string;
    unit: string;
    description?: string;
  }[];
  lastUpdated: string;
}
