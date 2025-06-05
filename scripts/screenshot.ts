#!/usr/bin/env npx tsx
import { chromium } from 'playwright';
import { join } from 'path';
import { mkdirSync } from 'fs';

// Since we can't import from src in a script, we'll replicate the resolveHref logic
function resolveHref(href: string): string {
  const base = '/chris-wireframe';
  const parts = `${base}${href}`.split('/').filter(Boolean);
  return `/${parts.join('/')}`;
}

async function takeScreenshot() {
  const args = process.argv.slice(2);
  const path = args[0] || '/';
  const customOutputFile = args[1];
  
  // Create screenshots directory in project
  const screenshotsDir = join(process.cwd(), '.screenshots');
  mkdirSync(screenshotsDir, { recursive: true });
  
  const filename = `screenshot-${Date.now()}.png`;
  const outputFile = customOutputFile || join(screenshotsDir, filename);
  
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    // Set a reasonable viewport size
    await page.setViewportSize({ width: 1280, height: 720 });
    
    const urlPath = resolveHref(path);
    const url = `http://localhost:4321${urlPath}`;
    console.log(`Taking screenshot of: ${url}`);
    
    await page.goto(url, { waitUntil: 'networkidle' });
    
    // Wait a bit for any animations to complete
    await page.waitForTimeout(500);
    
    await page.screenshot({ path: outputFile, fullPage: true });
    console.log(`Screenshot saved to: ${outputFile}`);
    
    await browser.close();
  } catch (error) {
    console.error('Error taking screenshot:', error);
    process.exit(1);
  }
}

takeScreenshot();