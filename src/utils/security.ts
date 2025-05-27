// Security and validation utilities

// Input sanitization
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, 1000); // Limit length
};

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// URL validation
export const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

// Image URL validation
export const isValidImageUrl = (url: string): boolean => {
  if (!isValidUrl(url)) return false;
  
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const urlLower = url.toLowerCase();
  
  return imageExtensions.some(ext => urlLower.includes(ext)) ||
         url.includes('unsplash.com') ||
         url.includes('placeholder.com');
};

// Recipe data validation
export const validateRecipeData = (recipe: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!recipe.id || typeof recipe.id !== 'string') {
    errors.push('Recipe ID is required and must be a string');
  }
  
  if (!recipe.title || typeof recipe.title !== 'string' || recipe.title.trim().length < 3) {
    errors.push('Recipe title is required and must be at least 3 characters');
  }
  
  if (!recipe.time || typeof recipe.time !== 'string') {
    errors.push('Recipe time is required');
  }
  
  if (!recipe.image || !isValidImageUrl(recipe.image)) {
    errors.push('Valid recipe image URL is required');
  }
  
  if (recipe.category && typeof recipe.category !== 'string') {
    errors.push('Recipe category must be a string');
  }
  
  if (recipe.difficulty && !['Easy', 'Medium', 'Hard'].includes(recipe.difficulty)) {
    errors.push('Recipe difficulty must be Easy, Medium, or Hard');
  }
  
  if (recipe.servings && (!Number.isInteger(recipe.servings) || recipe.servings < 1)) {
    errors.push('Recipe servings must be a positive integer');
  }
  
  if (recipe.rating && (typeof recipe.rating !== 'number' || recipe.rating < 0 || recipe.rating > 5)) {
    errors.push('Recipe rating must be a number between 0 and 5');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Search query validation
export const validateSearchQuery = (query: string): { isValid: boolean; sanitized: string } => {
  const sanitized = sanitizeInput(query);
  const isValid = sanitized.length >= 2 && sanitized.length <= 100;
  
  return { isValid, sanitized };
};

// Category data validation
export const validateCategoryData = (category: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!category.id || typeof category.id !== 'string') {
    errors.push('Category ID is required and must be a string');
  }
  
  if (!category.name || typeof category.name !== 'string' || category.name.trim().length < 2) {
    errors.push('Category name is required and must be at least 2 characters');
  }
  
  if (!category.icon || typeof category.icon !== 'string') {
    errors.push('Category icon is required');
  }
  
  if (typeof category.isActive !== 'boolean') {
    errors.push('Category isActive must be a boolean');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Rate limiting utility
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;
  
  constructor(maxRequests: number = 100, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }
  
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    
    return true;
  }
  
  getRemainingRequests(identifier: string): number {
    const requests = this.requests.get(identifier) || [];
    const now = Date.now();
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    return Math.max(0, this.maxRequests - validRequests.length);
  }
  
  reset(identifier?: string): void {
    if (identifier) {
      this.requests.delete(identifier);
    } else {
      this.requests.clear();
    }
  }
}

// Content Security Policy helpers
export const cspHelpers = {
  // Check if URL is from allowed domains
  isAllowedDomain: (url: string, allowedDomains: string[]): boolean => {
    try {
      const urlObj = new URL(url);
      return allowedDomains.some(domain => 
        urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`)
      );
    } catch {
      return false;
    }
  },
  
  // Default allowed domains for images
  getAllowedImageDomains: (): string[] => [
    'unsplash.com',
    'images.unsplash.com',
    'via.placeholder.com',
    'picsum.photos',
    'localhost',
  ],
  
  // Validate image source
  isAllowedImageSource: (url: string): boolean => {
    const allowedDomains = cspHelpers.getAllowedImageDomains();
    return cspHelpers.isAllowedDomain(url, allowedDomains);
  },
};

// Data encryption/decryption (simplified for demo)
export const cryptoHelpers = {
  // Simple base64 encoding (not for sensitive data)
  encode: (data: string): string => {
    try {
      return btoa(data);
    } catch {
      return data;
    }
  },
  
  // Simple base64 decoding
  decode: (encodedData: string): string => {
    try {
      return atob(encodedData);
    } catch {
      return encodedData;
    }
  },
  
  // Generate simple hash (not cryptographically secure)
  simpleHash: (data: string): string => {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  },
};

// Privacy helpers
export const privacyHelpers = {
  // Mask sensitive data
  maskEmail: (email: string): string => {
    const [username, domain] = email.split('@');
    if (!username || !domain) return email;
    
    const maskedUsername = username.length > 2 
      ? username[0] + '*'.repeat(username.length - 2) + username[username.length - 1]
      : username;
    
    return `${maskedUsername}@${domain}`;
  },
  
  // Remove sensitive data from objects
  sanitizeUserData: (userData: any): any => {
    const sanitized = { ...userData };
    
    // Remove sensitive fields
    delete sanitized.password;
    delete sanitized.token;
    delete sanitized.refreshToken;
    delete sanitized.apiKey;
    
    // Mask email if present
    if (sanitized.email) {
      sanitized.email = privacyHelpers.maskEmail(sanitized.email);
    }
    
    return sanitized;
  },
};

// Security audit helpers
export const securityAudit = {
  // Check for common security issues
  auditComponent: (componentProps: any): string[] => {
    const issues: string[] = [];
    
    // Check for dangerous props
    if (componentProps.dangerouslySetInnerHTML) {
      issues.push('Component uses dangerouslySetInnerHTML');
    }
    
    // Check for unvalidated URLs
    Object.entries(componentProps).forEach(([key, value]) => {
      if (typeof value === 'string' && value.startsWith('http')) {
        if (!isValidUrl(value)) {
          issues.push(`Invalid URL in prop ${key}`);
        }
        
        if (key.toLowerCase().includes('image') && !isValidImageUrl(value)) {
          issues.push(`Invalid image URL in prop ${key}`);
        }
      }
    });
    
    return issues;
  },
  
  // Audit data before storage
  auditDataForStorage: (data: any): { safe: boolean; issues: string[] } => {
    const issues: string[] = [];
    
    // Check data size
    const dataSize = JSON.stringify(data).length;
    if (dataSize > 1024 * 1024) { // 1MB limit
      issues.push('Data size exceeds 1MB limit');
    }
    
    // Check for sensitive data
    const sensitiveKeys = ['password', 'token', 'apiKey', 'secret'];
    const checkForSensitiveData = (obj: any, path: string = ''): void => {
      if (typeof obj === 'object' && obj !== null) {
        Object.entries(obj).forEach(([key, value]) => {
          const currentPath = path ? `${path}.${key}` : key;
          
          if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
            issues.push(`Sensitive data found at ${currentPath}`);
          }
          
          if (typeof value === 'object') {
            checkForSensitiveData(value, currentPath);
          }
        });
      }
    };
    
    checkForSensitiveData(data);
    
    return {
      safe: issues.length === 0,
      issues
    };
  },
};

// Export default security configuration
export const securityConfig = {
  rateLimiter: new RateLimiter(100, 60000), // 100 requests per minute
  allowedImageDomains: cspHelpers.getAllowedImageDomains(),
  maxInputLength: 1000,
  maxDataSize: 1024 * 1024, // 1MB
  enableAuditLogging: __DEV__,
}; 