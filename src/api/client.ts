import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { logger } from '../utils/logger.js';
import { 
  NetworkInfo, 
  Node, 
  NodeSnapshot, 
  Organization, 
  OrganizationSnapshot,
  ApiResponse
} from '../types/index.js';

export class StellarNetworkApiClient {
  private readonly client: AxiosInstance;
  private readonly baseUrl: string;
  private requestCount = 0;
  private readonly maxRequestsPerMinute = 60;
  private lastResetTime = Date.now();

  constructor(baseUrl = 'https://radar.withobsrvr.com/api', isTestnet = false) {
    this.baseUrl = isTestnet ? 'https://radar.withobsrvr.com/testnet-api' : baseUrl;
    
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'stellar-network-monitoring-mcp/1.0.0'
      }
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config) => {
        this.checkRateLimit();
        logger.debug(`Making request to ${config.url}`, { 
          method: config.method, 
          params: config.params 
        });
        return config;
      },
      (error) => {
        logger.error('Request error', { error: error.message });
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        logger.debug(`Response received from ${response.config.url}`, { 
          status: response.status 
        });
        return response;
      },
      (error) => {
        const errorDetails = {
          url: error.config?.url,
          status: error.response?.status,
          message: error.message,
          data: error.response?.data
        };
        logger.error('Response error', errorDetails);
        
        if (error.response?.status === 429) {
          throw new ApiError('Rate limit exceeded. Please try again later.', 'RATE_LIMITED', 429);
        }
        
        if (error.response?.status === 404) {
          throw new ApiError('Resource not found', 'NOT_FOUND', 404);
        }
        
        if (error.response?.status >= 500) {
          throw new ApiError('Server error. Please try again later.', 'SERVER_ERROR', error.response.status);
        }
        
        throw new ApiError(error.message || 'Network request failed', 'NETWORK_ERROR');
      }
    );
  }

  private checkRateLimit(): void {
    const now = Date.now();
    if (now - this.lastResetTime > 60000) {
      this.requestCount = 0;
      this.lastResetTime = now;
    }

    if (this.requestCount >= this.maxRequestsPerMinute) {
      throw new ApiError('Rate limit exceeded', 'RATE_LIMITED', 429);
    }

    this.requestCount++;
  }

  private async makeRequest<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.get(endpoint, { params });
      return {
        data: response.data,
        success: true
      };
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          data: null as T,
          success: false,
          error: error.message
        };
      }
      
      logger.error('Unexpected error in makeRequest', { error });
      return {
        data: null as T,
        success: false,
        error: 'An unexpected error occurred'
      };
    }
  }

  async getNetworkInfo(at?: string): Promise<ApiResponse<NetworkInfo>> {
    const params = at ? { at } : undefined;
    return this.makeRequest<NetworkInfo>('/v1', params);
  }

  async getAllNodes(at?: string): Promise<ApiResponse<Node[]>> {
    const params = at ? { at } : undefined;
    return this.makeRequest<Node[]>('/v1/node', params);
  }

  async getNodeByPublicKey(publicKey: string, at?: string): Promise<ApiResponse<Node>> {
    const params = at ? { at } : undefined;
    return this.makeRequest<Node>(`/v1/node/${publicKey}`, params);
  }

  async getNodeSnapshots(publicKey: string, at?: string): Promise<ApiResponse<NodeSnapshot[]>> {
    const params = at ? { at } : undefined;
    return this.makeRequest<NodeSnapshot[]>(`/v1/node/${publicKey}/snapshots`, params);
  }

  async getNetworkNodeSnapshots(at?: string): Promise<ApiResponse<NodeSnapshot[]>> {
    const params = at ? { at } : undefined;
    return this.makeRequest<NodeSnapshot[]>('/v1/node-snapshots', params);
  }

  async getAllOrganizations(): Promise<ApiResponse<Organization[]>> {
    return this.makeRequest<Organization[]>('/v1/organization');
  }

  async getOrganizationById(id: string, at?: string): Promise<ApiResponse<Organization>> {
    const params = at ? { at } : undefined;
    return this.makeRequest<Organization>(`/v1/organization/${id}`, params);
  }

  async getOrganizationSnapshots(id: string, at?: string): Promise<ApiResponse<OrganizationSnapshot[]>> {
    const params = at ? { at } : undefined;
    return this.makeRequest<OrganizationSnapshot[]>(`/v1/organization/${id}/snapshots`, params);
  }

  async getNetworkOrganizationSnapshots(at?: string): Promise<ApiResponse<OrganizationSnapshot[]>> {
    const params = at ? { at } : undefined;
    return this.makeRequest<OrganizationSnapshot[]>('/v1/organization-snapshots', params);
  }

  async getHistoryScanByUrl(url: string): Promise<ApiResponse<any>> {
    const encodedUrl = encodeURIComponent(url);
    return this.makeRequest<any>(`/v1/history-scan/${encodedUrl}`);
  }
}

class ApiError extends Error {
  public readonly code?: string;
  public readonly status?: number;

  constructor(message: string, code?: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}