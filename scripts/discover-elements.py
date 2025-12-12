#!/usr/bin/env python3
"""
Element Discovery Script for Brashline
Based on Anthropic's webapp-testing skill patterns.

Discovers interactive elements on the running dev server:
- Buttons
- Links  
- Form inputs
- Headings
- Data test IDs

Usage:
    # Make sure dev server is running on port 8080
    python scripts/discover-elements.py
    
    # Or specify a different URL
    python scripts/discover-elements.py --url http://localhost:3000
"""

import argparse
import json
from datetime import datetime

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    print("❌ Playwright not installed. Run: pip install playwright && playwright install chromium")
    exit(1)


def discover_elements(url: str, output_dir: str = "e2e"):
    """Discover all interactive elements on the page."""
    
    print(f"🔍 Discovering elements at {url}...")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        try:
            page.goto(url, wait_until="networkidle", timeout=30000)
            page.wait_for_timeout(2000)  # Wait for React hydration
        except Exception as e:
            print(f"❌ Failed to load page: {e}")
            browser.close()
            return
        
        results = {
            "url": url,
            "timestamp": datetime.now().isoformat(),
            "elements": {}
        }
        
        # Discover buttons
        buttons = page.locator("button").all()
        results["elements"]["buttons"] = []
        print(f"\n📦 BUTTONS ({len(buttons)} found):")
        for i, btn in enumerate(buttons):
            try:
                text = btn.inner_text().strip()[:50] if btn.is_visible() else "[hidden]"
                test_id = btn.get_attribute("data-testid") or ""
                btn_class = btn.get_attribute("class") or ""
                
                results["elements"]["buttons"].append({
                    "index": i,
                    "text": text,
                    "testId": test_id,
                    "visible": btn.is_visible()
                })
                
                if test_id:
                    print(f"  [{i}] {text} (data-testid=\"{test_id}\")")
                else:
                    print(f"  [{i}] {text}")
            except:
                print(f"  [{i}] [Error reading button]")
        
        # Discover links
        links = page.locator("a[href]").all()
        results["elements"]["links"] = []
        print(f"\n🔗 LINKS ({len(links)} found):")
        for i, link in enumerate(links[:20]):  # Limit to first 20
            try:
                text = link.inner_text().strip()[:30] if link.is_visible() else "[hidden]"
                href = link.get_attribute("href") or ""
                
                results["elements"]["links"].append({
                    "index": i,
                    "text": text,
                    "href": href,
                    "visible": link.is_visible()
                })
                
                print(f"  [{i}] {text} → {href[:50]}")
            except:
                print(f"  [{i}] [Error reading link]")
        
        if len(links) > 20:
            print(f"  ... and {len(links) - 20} more")
        
        # Discover form inputs
        inputs = page.locator("input, textarea, select").all()
        results["elements"]["inputs"] = []
        print(f"\n📝 FORM INPUTS ({len(inputs)} found):")
        for i, inp in enumerate(inputs):
            try:
                name = inp.get_attribute("name") or inp.get_attribute("id") or f"input-{i}"
                input_type = inp.get_attribute("type") or "text"
                placeholder = inp.get_attribute("placeholder") or ""
                
                results["elements"]["inputs"].append({
                    "index": i,
                    "name": name,
                    "type": input_type,
                    "placeholder": placeholder
                })
                
                print(f"  [{i}] {name} ({input_type}) - \"{placeholder[:30]}\"")
            except:
                print(f"  [{i}] [Error reading input]")
        
        # Discover data-testid elements
        testids = page.locator("[data-testid]").all()
        results["elements"]["testIds"] = []
        print(f"\n🎯 DATA-TESTID ELEMENTS ({len(testids)} found):")
        for i, elem in enumerate(testids[:30]):
            try:
                test_id = elem.get_attribute("data-testid")
                tag = elem.evaluate("el => el.tagName.toLowerCase()")
                
                results["elements"]["testIds"].append({
                    "testId": test_id,
                    "tag": tag
                })
                
                print(f"  <{tag} data-testid=\"{test_id}\">")
            except:
                pass
        
        # Discover headings
        headings = page.locator("h1, h2, h3").all()
        results["elements"]["headings"] = []
        print(f"\n📰 HEADINGS ({len(headings)} found):")
        for i, h in enumerate(headings[:15]):
            try:
                tag = h.evaluate("el => el.tagName")
                text = h.inner_text().strip()[:60]
                
                results["elements"]["headings"].append({
                    "tag": tag,
                    "text": text
                })
                
                print(f"  <{tag}> {text}")
            except:
                pass
        
        # Take screenshot
        screenshot_path = f"{output_dir}/page-discovery.png"
        try:
            page.screenshot(path=screenshot_path, full_page=True)
            print(f"\n📸 Screenshot saved to {screenshot_path}")
        except Exception as e:
            print(f"\n⚠️ Could not save screenshot: {e}")
        
        # Save JSON results
        json_path = f"{output_dir}/elements.json"
        try:
            with open(json_path, 'w') as f:
                json.dump(results, f, indent=2)
            print(f"📄 Results saved to {json_path}")
        except Exception as e:
            print(f"⚠️ Could not save JSON: {e}")
        
        browser.close()
        
        # Summary
        print(f"\n" + "="*50)
        print("📊 SUMMARY")
        print("="*50)
        print(f"  Buttons:   {len(results['elements']['buttons'])}")
        print(f"  Links:     {len(results['elements']['links'])}")
        print(f"  Inputs:    {len(results['elements']['inputs'])}")
        print(f"  Test IDs:  {len(results['elements']['testIds'])}")
        print(f"  Headings:  {len(results['elements']['headings'])}")
        print(f"\nUse these selectors in your Playwright tests!")


def main():
    parser = argparse.ArgumentParser(
        description="Discover interactive elements on a web page"
    )
    parser.add_argument(
        "--url",
        default="http://localhost:8080",
        help="URL to analyze (default: http://localhost:8080)"
    )
    parser.add_argument(
        "--output",
        default="e2e",
        help="Output directory for results (default: e2e)"
    )
    
    args = parser.parse_args()
    
    import os
    os.makedirs(args.output, exist_ok=True)
    
    discover_elements(args.url, args.output)


if __name__ == "__main__":
    main()
