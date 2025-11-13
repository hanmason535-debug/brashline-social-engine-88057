import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        # Increase the default timeout to give animations more time
        page.set_default_timeout(35000)

        await page.goto("http://localhost:8080/case-studies")
        # Wait for the page to be fully loaded, especially the images
        await page.wait_for_load_state('networkidle')
        await page.screenshot(path="/home/jules/verification/screenshots/work-page-fixes.png")

        # --- Test Social Post Lightbox ---
        # Use a more specific selector for the card
        social_post_card = page.locator('div.group:has-text("Grand opening celebration!")').first
        await social_post_card.wait_for(state="visible")
        await social_post_card.click()

        # Use a reliable selector for the lightbox content itself
        lightbox_content = page.locator('div.max-w-5xl:has-text("Engagement")')
        await lightbox_content.wait_for(state="visible")
        await page.screenshot(path="/home/jules/verification/screenshots/social-post-lightbox-fix.png")

        # Close the lightbox
        close_button = page.locator('button[aria-label="Close"]')
        await close_button.click()
        # Wait for the lightbox to disappear
        await lightbox_content.wait_for(state="hidden")

        # --- Test Website Project Lightbox ---
        website_project_card = page.locator('div.group:has-text("Nav Techno Solutions")').first
        await website_project_card.wait_for(state="visible")
        await website_project_card.click()

        # Reuse the lightbox selector, but wait for different content
        website_lightbox_content = page.locator('div.max-w-5xl:has-text("Tech Stack")')
        await website_lightbox_content.wait_for(state="visible")
        await page.screenshot(path="/home/jules/verification/screenshots/website-project-lightbox-fix.png")

        await browser.close()

asyncio.run(main())
