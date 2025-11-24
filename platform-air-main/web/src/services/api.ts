// Configuração base da API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Tipos para respostas da API
export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface ApiError {
  status: 'error';
  message: string;
  errors?: Record<string, string[]>;
  error?: string;
}

// Função para fazer requisições HTTP
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    });

    // Verifica se a resposta tem conteúdo JSON
    const contentType = response.headers.get('content-type');
    let data: any;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // Se não for JSON, tenta ler como texto
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text || 'Erro desconhecido' };
      }
    }

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || data.error || 'Ocorreu um erro na requisição',
        error: data.error || data.message,
        errors: data.errors || (data.status === 'error' && data.errors ? data.errors : undefined),
      };
    }

    return data;
  } catch (error) {
    // Erro de rede ou conexão
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        status: 'error',
        message: 'Erro de conexão com o servidor. Verifique se a API está rodando.',
        error: 'Network error',
      };
    }
    
    return {
      status: 'error',
      message: 'Erro de conexão com o servidor',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

// Funções CRUD genéricas
export const api = {
  get: <T>(endpoint: string): Promise<ApiResponse<T>> =>
    fetchApi<T>(endpoint, { method: 'GET' }),

  post: <T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> =>
    fetchApi<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> =>
    fetchApi<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> =>
    fetchApi<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string): Promise<ApiResponse<T>> =>
    fetchApi<T>(endpoint, { method: 'DELETE' }),
};

export default api;

