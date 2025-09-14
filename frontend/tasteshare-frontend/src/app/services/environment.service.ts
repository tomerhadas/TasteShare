import { Injectable } from '@angular/core';

/**
 * Service to manage environment-specific functionality and settings
 */
@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  private isProd = false; // Default to development mode

  constructor() {
    // In a real application, this would be set based on environment variables
    // For now, we'll manually set it to true to disable sensitive logs
    this.isProd = true;
  }

  /**
   * Check if application is running in production mode
   */
  isProduction(): boolean {
    return this.isProd;
  }

  /**
   * Log for development environments only
   * @param message Message to log
   * @param optionalParams Additional parameters to log
   */
  devLog(message?: any, ...optionalParams: any[]): void {
    if (!this.isProd) {
      console.log(message, ...optionalParams);
    }
  }

  /**
   * Log errors in any environment
   * @param message Error message to log
   * @param optionalParams Additional parameters to log
   */
  errorLog(message?: any, ...optionalParams: any[]): void {
    console.error(message, ...optionalParams);
  }
}
