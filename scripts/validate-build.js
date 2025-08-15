#!/usr/bin/env node

/**
 * Build validation script
 * Validates the build configuration and environment variables
 */

const fs = require('fs');
const path = require('path');

// Load environment variables from .env files
function loadEnvFiles() {
  const envFiles = ['.env.local', '.env'];

  envFiles.forEach(envFile => {
    const envPath = path.join(process.cwd(), envFile);
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      envContent.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0 && !key.startsWith('#')) {
          const value = valueParts.join('=').trim();
          if (!process.env[key]) {
            process.env[key] = value;
          }
        }
      });
    }
  });
}

// Load environment variables at startup
loadEnvFiles();

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function validateEnvironmentVariables() {
  log('\n📋 Validating Environment Variables...', colors.blue);

  const requiredVars = [
    'NODE_ENV',
    'NEXT_PUBLIC_APP_NAME',
    'NEXT_PUBLIC_APP_VERSION',
  ];

  const productionVars = [
    'NEXT_PUBLIC_APP_URL',
  ];

  const isProduction = process.env.NODE_ENV === 'production';
  const varsToCheck = isProduction ? [...requiredVars, ...productionVars] : requiredVars;

  let allValid = true;

  varsToCheck.forEach(varName => {
    const value = process.env[varName];
    if (!value || (isProduction && value.includes('XXXXXXXXXX'))) {
      log(`❌ Missing or invalid: ${varName}`, colors.red);
      allValid = false;
    } else {
      log(`✅ ${varName}: ${value.substring(0, 20)}${value.length > 20 ? '...' : ''}`, colors.green);
    }
  });

  // Check optional GA measurement ID
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (gaId && gaId.trim() && !gaId.includes('XXXXXXXXXX')) {
    log(`✅ NEXT_PUBLIC_GA_MEASUREMENT_ID: ${gaId}`, colors.green);
  } else {
    log(`⚠️  NEXT_PUBLIC_GA_MEASUREMENT_ID: Not configured (optional)`, colors.yellow);
  }

  return allValid;
}

function validateBuildFiles() {
  log('\n📁 Validating Build Files...', colors.blue);

  const requiredFiles = [
    'package.json',
    'next.config.js',
    'vercel.json',
    'tsconfig.json',
    'tailwind.config.ts',
  ];

  let allValid = true;

  requiredFiles.forEach(fileName => {
    const filePath = path.join(process.cwd(), fileName);
    if (fs.existsSync(filePath)) {
      log(`✅ ${fileName}`, colors.green);
    } else {
      log(`❌ Missing: ${fileName}`, colors.red);
      allValid = false;
    }
  });

  return allValid;
}

function validatePackageJson() {
  log('\n📦 Validating Package Configuration...', colors.blue);

  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    let allValid = true;

    // Check required scripts
    const requiredScripts = ['build', 'start', 'lint', 'test'];
    requiredScripts.forEach(script => {
      if (packageJson.scripts && packageJson.scripts[script]) {
        log(`✅ Script: ${script}`, colors.green);
      } else {
        log(`❌ Missing script: ${script}`, colors.red);
        allValid = false;
      }
    });

    // Check dependencies
    const requiredDeps = ['next', 'react', 'react-dom'];
    requiredDeps.forEach(dep => {
      if (packageJson.dependencies && packageJson.dependencies[dep]) {
        log(`✅ Dependency: ${dep}@${packageJson.dependencies[dep]}`, colors.green);
      } else {
        log(`❌ Missing dependency: ${dep}`, colors.red);
        allValid = false;
      }
    });

    return allValid;
  } catch (error) {
    log(`❌ Error reading package.json: ${error.message}`, colors.red);
    return false;
  }
}

function validateVercelConfig() {
  log('\n🚀 Validating Vercel Configuration...', colors.blue);

  try {
    const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
    let allValid = true;

    // Check for modern Vercel config (version 2 is now optional/deprecated)
    if (vercelConfig.version === 2 || !vercelConfig.version) {
      log('✅ Vercel config format is valid', colors.green);
    } else {
      log('❌ Invalid Vercel config version', colors.red);
      allValid = false;
    }

    if (vercelConfig.headers && vercelConfig.headers.length > 0) {
      log('✅ Security headers configured', colors.green);
    } else {
      log('⚠️  No security headers configured', colors.yellow);
    }

    return allValid;
  } catch (error) {
    log(`❌ Error reading vercel.json: ${error.message}`, colors.red);
    return false;
  }
}

function validateNextConfig() {
  log('\n⚡ Validating Next.js Configuration...', colors.blue);

  try {
    // Since next.config.js is a module, we need to require it
    const nextConfig = require(path.join(process.cwd(), 'next.config.js'));
    let allValid = true;

    if (nextConfig.headers) {
      log('✅ Security headers configured in Next.js', colors.green);
    } else {
      log('⚠️  No security headers in Next.js config', colors.yellow);
    }

    if (nextConfig.poweredByHeader === false) {
      log('✅ X-Powered-By header disabled', colors.green);
    } else {
      log('⚠️  X-Powered-By header not disabled', colors.yellow);
    }

    return allValid;
  } catch (error) {
    log(`❌ Error reading next.config.js: ${error.message}`, colors.red);
    return false;
  }
}

function main() {
  log('🔍 Starting Build Validation...', colors.blue);
  log(`Environment: ${process.env.NODE_ENV || 'development'}`, colors.blue);

  const validations = [
    validateEnvironmentVariables(),
    validateBuildFiles(),
    validatePackageJson(),
    validateVercelConfig(),
    validateNextConfig(),
  ];

  const allValid = validations.every(Boolean);

  log('\n📊 Validation Summary:', colors.blue);
  if (allValid) {
    log('🎉 All validations passed! Ready for deployment.', colors.green);
    process.exit(0);
  } else {
    log('❌ Some validations failed. Please fix the issues above.', colors.red);
    process.exit(1);
  }
}

// Run validation if this script is executed directly
if (require.main === module) {
  main();
}

module.exports = { validateEnvironmentVariables, validateBuildFiles, validatePackageJson };