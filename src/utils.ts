import { Json2TsOptions } from './models';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Check if file is TypeScript
 * @param {string} filePath 
 * @returns {boolean}
 */
function isTypeScriptFile(filePath: string): boolean {
  const ext = path.extname(filePath);
  return ext === '.ts' || ext === '.tsx';
}

/**
 * Insert interface after imports in TypeScript file
 * @param {string} filePath 
 * @param {string} content 
 */
function insertAfterImports(filePath: string, content: string): void {
  if (!isTypeScriptFile(filePath)) {
    throw new Error('Inline generation only supports .ts or .tsx files');
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const lines = fileContent.split('\n');
  
  // Find the last import statement
  let lastImportIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import ')) {
      lastImportIndex = i;
    }
  }

  // Insert interfaces after the last import or at the beginning
  const insertIndex = lastImportIndex === -1 ? 0 : lastImportIndex + 1;
  lines.splice(insertIndex, 0, '\n' + content + '\n');
  
  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
}

/**
 * Detect type of a value
 * @param {unknown} value 
 * @returns {string}
 */
function detectType(value: unknown): string {
  if (Array.isArray(value)) {
    const elementType = value.length > 0 ? detectType(value[0]) : 'any';
    return `${elementType}[]`;
  }

  if (value === null) return 'null';
  if (typeof value === 'object') return 'object';
  return typeof value;
}

/**
 * Generate interface for nested objects
 * @param {object} obj 
 * @param {Json2TsOptions} options 
 * @param {Set<string>} generatedInterfaces 
 * @returns {string}
 */
function generateInterface(obj: Record<string, unknown>, options: Json2TsOptions, generatedInterfaces: Set<string> = new Set()): string {
  let output = '';
  const interfaces = new Map<string, string>();

  function processObject(obj: Record<string, unknown>, interfaceName: string): void {
    if (generatedInterfaces.has(interfaceName)) return;
    generatedInterfaces.add(interfaceName);

    const isRoot = interfaceName === options.rootObjectName;
    const shouldExport = (options.exportWord || (options.exportWordAtRoot && isRoot)) ? 'export ' : '';
    
    let interfaceStr = `${shouldExport}interface ${interfaceName} {\n`;
    
    for (const [key, value] of Object.entries(obj)) {
      let type = detectType(value);
      
      if (type === 'object') {
        const nestedInterfaceName = `${interfaceName}${key.charAt(0).toUpperCase()}${key.slice(1)}`;
        if (value !== null && typeof value === 'object') {
          processObject(value as Record<string, unknown>, nestedInterfaceName);
          type = nestedInterfaceName;
        }
      } else if (type.endsWith('[]') && type !== 'any[]' && Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
        const nestedInterfaceName = `${interfaceName}${key.charAt(0).toUpperCase()}${key.slice(1)}Item`;
        processObject(value[0] as Record<string, unknown>, nestedInterfaceName);
        type = `${nestedInterfaceName}[]`;
      }
      
      interfaceStr += `  ${key}: ${type};\n`;
    }
    
    interfaceStr += '}\n\n';
    interfaces.set(interfaceName, interfaceStr);
  }

  processObject(obj, options.rootObjectName || 'RootObject');
  
  // Combine all interfaces in correct order
  for (const interfaceStr of interfaces.values()) {
    output += interfaceStr;
  }

  return output.trim();
}

export {
  detectType,
  generateInterface,
  isTypeScriptFile,
  insertAfterImports
};