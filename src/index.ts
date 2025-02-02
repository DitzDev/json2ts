import { Json2TsOptions, parseJSON, validateOptions } from './models';
import { detectType, generateInterface, isTypeScriptFile, insertAfterImports } from './utils';
import * as fs from 'fs';
import callsites from 'callsites';
import { fileURLToPath } from 'url';

/**
 * Get caller file path
 * @returns {string}
 */
function getCallerFilePath(): string {
  const sites = callsites();
  // Get the caller of json2ts function (index 2 in the stack)
  const callerSite = sites[2];
  
  if (!callerSite) {
    throw new Error('Could not determine caller site');
  }

  const fileName = callerSite.getFileName();
  
  if (!fileName) {
    throw new Error('Could not determine caller file name');
  }

  // Handle both file:// URLs and regular paths
  return fileName.startsWith('file://') ? fileURLToPath(fileName) : fileName;
}

/**
 * Convert JSON to TypeScript interface
 * @param {object | string} input - JSON object or string
 * @param {Json2TsOptions} options - Configuration options
 * @returns {string} Generated TypeScript interface
 */
function json2ts(input: object | string, options: Json2TsOptions = {}): string {
  // Default options
  const defaultOptions: Json2TsOptions = {
    saveToFile: false,
    outputPath: './interfaces.ts',
    inlineGeneration: false,
    rootObjectName: 'RootObject',
    exportWord: false,
    exportWordAtRoot: false
  };

  const finalOptions = { ...defaultOptions, ...options };

  // If inlineGeneration is true, ignore saveToFile and outputPath
  if (finalOptions.inlineGeneration) {
    finalOptions.saveToFile = false;
    delete finalOptions.outputPath;

    try {
      const callerFile = getCallerFilePath();
      
      if (!isTypeScriptFile(callerFile)) {
        throw new Error('Inline generation only supports .ts or .tsx files');
      }

      finalOptions.outputPath = callerFile;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Inline generation failed: ${error.message}`);
      }
      throw error;
    }
  }

  validateOptions(finalOptions);

  // Parse input if it's a string
  let jsonData: Record<string, unknown>;
  try {
    jsonData = typeof input === 'string' ? parseJSON(input) as Record<string, unknown> : input as Record<string, unknown>;
  } catch (error) {
    throw new Error('Invalid input: Must be a valid JSON string or object');
  }

  // Generate interfaces
  const interfaces = generateInterface(jsonData, finalOptions);

  // Handle output based on options
  if (finalOptions.inlineGeneration && finalOptions.outputPath) {
    insertAfterImports(finalOptions.outputPath, interfaces);
  } else if (finalOptions.saveToFile && finalOptions.outputPath) {
    fs.writeFileSync(finalOptions.outputPath, interfaces, 'utf8');
  }

  return interfaces;
}

export { json2ts };
export default json2ts;
export type { Json2TsOptions };