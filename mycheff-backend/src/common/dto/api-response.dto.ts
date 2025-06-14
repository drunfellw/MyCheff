import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({ description: 'Success status' })
  success: boolean;

  @ApiProperty({ description: 'Response data' })
  data: T;

  @ApiProperty({ description: 'Response message', required: false })
  message?: string;

  @ApiProperty({ description: 'Error messages', required: false })
  errors?: string[];

  @ApiProperty({ description: 'Response timestamp' })
  timestamp: string;

  constructor(data: T, message?: string, success: boolean = true) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.timestamp = new Date().toISOString();
  }
}

export class PaginationMetaDto {
  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Items per page' })
  limit: number;

  @ApiProperty({ description: 'Total number of items' })
  total: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages: number;

  @ApiProperty({ description: 'Has next page' })
  hasNext: boolean;

  @ApiProperty({ description: 'Has previous page' })
  hasPrev: boolean;
}

export class PaginatedResponseDto<T> {
  @ApiProperty({ description: 'Response data array' })
  data: T[];

  @ApiProperty({ description: 'Pagination metadata' })
  pagination: PaginationMetaDto;

  constructor(data: T[], paginationOrTotal: PaginationMetaDto | number, page?: number, limit?: number) {
    this.data = data;
    
    if (typeof paginationOrTotal === 'number') {
      // Legacy constructor: (data, total, page, limit)
      const total = paginationOrTotal;
      const currentPage = page || 1;
      const currentLimit = limit || 20;
      const totalPages = Math.ceil(total / currentLimit);
      
      this.pagination = {
        page: currentPage,
        limit: currentLimit,
        total,
        totalPages,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1,
      };
    } else {
      // New constructor: (data, pagination)
      this.pagination = paginationOrTotal;
    }
  }
}

export class ErrorResponseDto {
  @ApiProperty({ description: 'Success status', default: false })
  success: boolean = false;

  @ApiProperty({ description: 'Error message' })
  message: string;

  @ApiProperty({ description: 'Error details', required: false })
  errors?: string[];

  @ApiProperty({ description: 'Error code', required: false })
  code?: string;

  @ApiProperty({ description: 'Response timestamp' })
  timestamp: string;

  constructor(message: string, errors?: string[], code?: string) {
    this.message = message;
    this.errors = errors;
    this.code = code;
    this.timestamp = new Date().toISOString();
  }
} 