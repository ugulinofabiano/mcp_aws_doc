import axios from 'axios';
import * as cheerio from 'cheerio';
import { SearchResult, ServiceInfo, PricingInfo } from '../types/tool.js';

export class AwsDocumentationService {
  private readonly awsDocsBaseUrl = 'https://docs.aws.amazon.com';
  private readonly awsServicesUrl = 'https://aws.amazon.com/services';
  private readonly awsPricingUrl = 'https://aws.amazon.com/pricing';

  async searchDocumentation(query: string, service?: string, maxResults: number = 10): Promise<SearchResult[]> {
    try {
      // Simulate AWS documentation search
      // In a real implementation, you would use AWS's search API or scrape their documentation
      const searchUrl = service 
        ? `${this.awsDocsBaseUrl}/${service}/latest/developerguide/`
        : this.awsDocsBaseUrl;

      const response = await axios.get(searchUrl, {
        params: { q: query },
        timeout: 10000,
      });

      const $ = cheerio.load(response.data);
      const results: SearchResult[] = [];

      // Extract search results from the page
      $('.search-result-item, .result-item, .search-hit').each((index, element) => {
        if (index >= maxResults) return false;

        const $element = $(element);
        const title = $element.find('h3 a, .title a, h4 a').text().trim();
        const url = $element.find('h3 a, .title a, h4 a').attr('href');
        const snippet = $element.find('.snippet, .description, .summary').text().trim();

        if (title && url) {
          results.push({
            title,
            url: url.startsWith('http') ? url : `${this.awsDocsBaseUrl}${url}`,
            snippet: snippet || 'No description available',
            service,
            relevanceScore: Math.random() * 100, // Simulated relevance score
          });
        }
      });

      // If no results found from scraping, return mock data for demonstration
      if (results.length === 0) {
        return this.getMockSearchResults(query, service, maxResults);
      }

      return results;
    } catch (error) {
      console.error('Error searching AWS documentation:', error);
      // Return mock data as fallback
      return this.getMockSearchResults(query, service, maxResults);
    }
  }

  async getServiceDocumentation(serviceName: string, topic?: string): Promise<any> {
    try {
      const serviceUrl = `${this.awsDocsBaseUrl}/${serviceName}/latest/developerguide/`;
      
      if (topic) {
        // Try to get specific topic documentation
        const topicUrl = `${serviceUrl}${topic}.html`;
        const response = await axios.get(topicUrl, { timeout: 10000 });
        const $ = cheerio.load(response.data);
        
        return {
          service: serviceName,
          topic,
          url: topicUrl,
          content: $('.main-content, .content').text().substring(0, 2000),
          lastUpdated: new Date().toISOString(),
        };
      } else {
        // Get general service documentation
        return await this.getMockServiceDocumentation(serviceName);
      }
    } catch (error) {
      console.error(`Error getting documentation for ${serviceName}:`, error);
      return await this.getMockServiceDocumentation(serviceName);
    }
  }

  async listServices(category?: string): Promise<ServiceInfo[]> {
    try {
      const response = await axios.get(this.awsServicesUrl, { timeout: 10000 });
      const $ = cheerio.load(response.data);
      const services: ServiceInfo[] = [];

      // Extract services from AWS services page
      $('.service-item, .aws-service').each((index, element) => {
        const $element = $(element);
        const name = $element.find('h3, .service-name').text().trim().toLowerCase();
        const displayName = $element.find('h3, .service-name').text().trim();
        const description = $element.find('.description, .service-description').text().trim();
        const serviceCategory = $element.find('.category').text().trim() || 'general';

        if (name && displayName) {
          services.push({
            name,
            displayName,
            description: description || 'AWS service',
            category: serviceCategory,
            documentationUrl: `${this.awsDocsBaseUrl}/${name}/latest/developerguide/`,
          });
        }
      });

      // If no services found, return mock data
      if (services.length === 0) {
        return this.getMockServices(category);
      }

      // Filter by category if specified
      if (category) {
        return services.filter(service => 
          service.category.toLowerCase().includes(category.toLowerCase())
        );
      }

      return services;
    } catch (error) {
      console.error('Error listing AWS services:', error);
      return this.getMockServices(category);
    }
  }

  async getPricingInfo(serviceName: string, region?: string): Promise<PricingInfo> {
    try {
      const pricingUrl = `${this.awsPricingUrl}/${serviceName}`;
      const response = await axios.get(pricingUrl, { timeout: 10000 });
      const $ = cheerio.load(response.data);
      
      const pricingDetails: any[] = [];
      
      // Extract pricing information
      $('.pricing-model, .price-item').each((index, element) => {
        const $element = $(element);
        const model = $element.find('.model-name, .pricing-model-name').text().trim();
        const price = $element.find('.price, .cost').text().trim();
        const unit = $element.find('.unit, .per-unit').text().trim();
        const description = $element.find('.description').text().trim();

        if (model && price) {
          pricingDetails.push({
            model,
            price,
            unit: unit || 'per hour',
            description,
          });
        }
      });

      return {
        service: serviceName,
        region,
        pricingDetails,
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      console.error(`Error getting pricing for ${serviceName}:`, error);
      return this.getMockPricingInfo(serviceName, region);
    }
  }

  // Mock data methods for demonstration
  private getMockSearchResults(query: string, service?: string, maxResults: number = 10): SearchResult[] {
    const mockResults: SearchResult[] = [
      {
        title: `${query} - AWS Documentation`,
        url: `${this.awsDocsBaseUrl}/${service || 'general'}/latest/developerguide/${query.toLowerCase().replace(/\s+/g, '-')}.html`,
        snippet: `Learn about ${query} in AWS. This comprehensive guide covers all aspects of ${query} including setup, configuration, and best practices.`,
        service: service || 'general',
        relevanceScore: 95,
      },
      {
        title: `Getting Started with ${query}`,
        url: `${this.awsDocsBaseUrl}/${service || 'general'}/latest/developerguide/getting-started.html`,
        snippet: `Quick start guide for ${query}. Follow these steps to get up and running with ${query} in minutes.`,
        service: service || 'general',
        relevanceScore: 90,
      },
      {
        title: `${query} Best Practices`,
        url: `${this.awsDocsBaseUrl}/${service || 'general'}/latest/developerguide/best-practices.html`,
        snippet: `Best practices and recommendations for implementing ${query} in your AWS environment.`,
        service: service || 'general',
        relevanceScore: 85,
      },
    ];

    return mockResults.slice(0, maxResults);
  }

  private async getMockServiceDocumentation(serviceName: string): Promise<any> {
    return {
      service: serviceName,
      overview: `AWS ${serviceName.toUpperCase()} is a comprehensive cloud service that provides...`,
      keyFeatures: [
        'Scalable and reliable infrastructure',
        'Pay-as-you-go pricing model',
        'Global availability',
        'Enterprise-grade security',
      ],
      commonUseCases: [
        'Web application hosting',
        'Data processing and analytics',
        'Content delivery and storage',
        'Machine learning and AI workloads',
      ],
      documentationUrl: `${this.awsDocsBaseUrl}/${serviceName}/latest/developerguide/`,
      apiReferenceUrl: `${this.awsDocsBaseUrl}/${serviceName}/latest/APIReference/`,
      lastUpdated: new Date().toISOString(),
    };
  }

  private getMockServices(category?: string): ServiceInfo[] {
    const allServices: ServiceInfo[] = [
      {
        name: 'ec2',
        displayName: 'Amazon EC2',
        description: 'Virtual servers in the cloud',
        category: 'compute',
        documentationUrl: `${this.awsDocsBaseUrl}/ec2/latest/developerguide/`,
      },
      {
        name: 's3',
        displayName: 'Amazon S3',
        description: 'Object storage service',
        category: 'storage',
        documentationUrl: `${this.awsDocsBaseUrl}/s3/latest/developerguide/`,
      },
      {
        name: 'lambda',
        displayName: 'AWS Lambda',
        description: 'Serverless compute service',
        category: 'compute',
        documentationUrl: `${this.awsDocsBaseUrl}/lambda/latest/developerguide/`,
      },
      {
        name: 'rds',
        displayName: 'Amazon RDS',
        description: 'Managed relational database service',
        category: 'database',
        documentationUrl: `${this.awsDocsBaseUrl}/rds/latest/developerguide/`,
      },
      {
        name: 'dynamodb',
        displayName: 'Amazon DynamoDB',
        description: 'NoSQL database service',
        category: 'database',
        documentationUrl: `${this.awsDocsBaseUrl}/dynamodb/latest/developerguide/`,
      },
      {
        name: 'cloudfront',
        displayName: 'Amazon CloudFront',
        description: 'Content delivery network',
        category: 'networking',
        documentationUrl: `${this.awsDocsBaseUrl}/cloudfront/latest/developerguide/`,
      },
      {
        name: 'vpc',
        displayName: 'Amazon VPC',
        description: 'Virtual private cloud',
        category: 'networking',
        documentationUrl: `${this.awsDocsBaseUrl}/vpc/latest/developerguide/`,
      },
      {
        name: 'iam',
        displayName: 'AWS IAM',
        description: 'Identity and access management',
        category: 'security',
        documentationUrl: `${this.awsDocsBaseUrl}/iam/latest/developerguide/`,
      },
    ];

    if (category) {
      return allServices.filter(service => 
        service.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    return allServices;
  }

  private getMockPricingInfo(serviceName: string, region?: string): PricingInfo {
    const mockPricing: Record<string, any[]> = {
      ec2: [
        {
          model: 't3.micro',
          price: '$0.0104',
          unit: 'per hour',
          description: '1 vCPU, 1 GB RAM',
        },
        {
          model: 't3.small',
          price: '$0.0208',
          unit: 'per hour',
          description: '2 vCPU, 2 GB RAM',
        },
      ],
      s3: [
        {
          model: 'Standard Storage',
          price: '$0.023',
          unit: 'per GB per month',
          description: 'First 50 TB',
        },
        {
          model: 'Standard-IA Storage',
          price: '$0.0125',
          unit: 'per GB per month',
          description: 'Infrequent access',
        },
      ],
      lambda: [
        {
          model: 'Compute',
          price: '$0.0000166667',
          unit: 'per GB-second',
          description: 'First 1M requests per month',
        },
        {
          model: 'Requests',
          price: '$0.20',
          unit: 'per 1M requests',
          description: 'After first 1M requests',
        },
      ],
    };

    return {
      service: serviceName,
      region: region || 'us-east-1',
      pricingDetails: mockPricing[serviceName] || [
        {
          model: 'Basic',
          price: 'Contact AWS',
          unit: 'pricing',
          description: 'Contact AWS for pricing information',
        },
      ],
      lastUpdated: new Date().toISOString(),
    };
  }
}
