/**
 * TypeScript type definitions
 */
export interface Json2TsOptions {
  saveToFile?: boolean;
  outputPath?: string;
  inlineGeneration?: boolean;
  rootObjectName?: string;
  exportWord?: boolean;
  exportWordAtRoot?: boolean;
}

/**
 * Parse JSON string safely
 * @param {string} jsonString 
 * @returns {Object}
 */
function parseJSON(jsonString: string): object {
  try {
    return JSON.parse(jsonString);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Invalid JSON: ${error.message}`);
    }
    throw new Error('Invalid JSON: An unknown error occurred');
  }
}

/**
 * Validate configuration options
 * @param {Json2TsOptions} options 
 */
function validateOptions(options: Json2TsOptions): void {
  if (typeof options !== 'object') {
    throw new Error('Options must be an object');
  }

  if (options.saveToFile && typeof options.outputPath !== 'string') {
    throw new Error('outputPath must be a string when saveToFile is true');
  }

  if (options.rootObjectName && typeof options.rootObjectName !== 'string') {
    throw new Error('rootObjectName must be a string');
  }

  if (options.exportWord && options.exportWordAtRoot) {
    throw new Error('Cannot use both exportWord and exportWordAtRoot options');
  }
}

export {
  parseJSON,
  validateOptions
};