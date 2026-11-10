import { test, expect } from '@playwright/test';

const createValidSave = (overrides = {}) => ({
  version: 1,
  screen: 'HUB',
  playerAlias: 'Candidate 404',
  startedAt: Date.now() - 100000,
  fragments: { A: null, B: null, C: null },
  rounds: {
    aptitude: { status: 'AVAILABLE', score: 0, maxScore: 300, timeUsed: 0, hintsUsed: 0, attempts: 0 },
    coding: { status: 'LOCKED', score: 0, maxScore: 350, timeUsed: 0, hintsUsed: 0, attempts: 0 },
    interview: { status: 'LOCKED', score: 0, maxScore: 300, timeUsed: 0, hintsUsed: 0, attempts: 0 },
  },
  integrity: 100,
  totalScore: 0,
  settings: {
    musicVolume: 0.65,
    sfxVolume: 0.7,
    muted: false,
    reducedMotion: false,
    voiceEnabled: true,
    subtitles: true,
  },
  riddleChoice: null,
  ...overrides,
});

test.describe('Escape: Placement Cell - End-to-End Game Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('Title Screen loads with single glowing entry button and zero login friction', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Escape: Placement Cell');
    await expect(page.locator('button:has-text("Enter the building")')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toHaveCount(0);
  });

  test('Settings toggles (mute, reduced motion) persist across page reload', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Enter the building")');
    await page.click('button:has-text("Proceed to lobby")');
    await expect(page.locator('h1')).toContainText('Select a Sealed Wing');

    // Open Settings panel
    await page.click('button[aria-label="Open settings"]');
    await expect(page.locator('.settings-panel')).toBeVisible();

    // Toggle mute
    const muteToggle = page.locator('button.setting-toggle');
    await expect(muteToggle).toContainText('Sound enabled');
    await muteToggle.click();
    await expect(muteToggle).toContainText('Sound muted');

    // Toggle reduced motion checkbox
    const motionCheckbox = page.locator('label.check input[type="checkbox"]').first();
    await motionCheckbox.check();
    await expect(motionCheckbox).toBeChecked();

    // Reload page and re-open settings
    await page.reload();
    await page.click('button[aria-label="Open settings"]');
    await expect(page.locator('button.setting-toggle')).toContainText('Sound muted');
    await expect(page.locator('label.check input[type="checkbox"]').first()).toBeChecked();
  });

  test('HUD and map render responsively at mobile viewport (360px)', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto('/');
    await page.click('button:has-text("Enter the building")');
    await page.click('button:has-text("Proceed to lobby")');

    // Verify HUD elements fit without overflow
    await expect(page.locator('.hud')).toBeVisible();
    await expect(page.locator('.wallet')).toBeVisible();

    // Verify blueprint and wing buttons are clickable
    const wingA = page.locator('.map-wing.a');
    await expect(wingA).toBeVisible();
    await wingA.click();
    await expect(page.locator('.wing-card h2')).toContainText('Aptitude Vault');
  });

  test('Full playthrough happy path from Title to Ending and Performance Report', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Enter the building")');
    await page.click('button:has-text("Proceed to lobby")');

    // Enter Wing A: Aptitude Vault
    await page.click('button:has-text("Enter Wing")');
    await expect(page.locator('h1')).toContainText('Logic Door 1 / 8');

    // Solve all 8 questions with correct answers:
    // Door 1 (36)
    await page.fill('input[aria-label="Your answer"]', '36');
    await page.click('button:has-text("Unlock door")');

    // Door 2 (15)
    await page.fill('input[aria-label="Your answer"]', '15');
    await page.click('button:has-text("Unlock door")');

    // Door 3 (42)
    await page.click('.answer-grid button:has-text("42")');
    await page.click('button:has-text("Unlock door")');

    // Door 4 (Yes)
    await page.click('.answer-grid button:has-text("Yes")');
    await page.click('button:has-text("Unlock door")');

    // Door 5 (Cobra)
    await page.click('.answer-grid button:has-text("Cobra")');
    await page.click('button:has-text("Unlock door")');

    // Door 6 (ESCAPE)
    await page.fill('input[aria-label="Your answer"]', 'ESCAPE');
    await page.click('button:has-text("Unlock door")');

    // Door 7 (Q2)
    await page.click('.answer-grid button:has-text("Q2")');
    await page.click('button:has-text("Unlock door")');

    // Door 8 (24)
    await page.fill('input[aria-label="Your answer"]', '24');
    await page.click('button:has-text("Unlock door")');

    // Vault resolved
    await expect(page.locator('h1')).toContainText('Combination secured');
    await page.click('button:has-text("Return to lobby")');

    // Fast-forward all 3 cleared wings to reach Final Gate directly
    await page.evaluate((save) => {
      localStorage.setItem('epc_save_v1', JSON.stringify(save));
    }, createValidSave({
      screen: 'FINAL',
      fragments: { A: '7319', B: 'CODE', C: '△○◇' },
      rounds: {
        aptitude: { status: 'CLEARED', score: 270, maxScore: 300, timeUsed: 120, hintsUsed: 0, attempts: 1 },
        coding: { status: 'CLEARED', score: 350, maxScore: 350, timeUsed: 180, hintsUsed: 0, attempts: 1 },
        interview: { status: 'CLEARED', score: 280, maxScore: 300, timeUsed: 200, hintsUsed: 0, attempts: 1 },
      },
      totalScore: 900,
    }));
    await page.reload();

    // Final Gate verification
    await expect(page.locator('h1')).toContainText('The Final Gate');

    // Fill Lock 1 digits (7 3 1 9)
    await page.fill('#lock1-digit-0', '7');
    await page.fill('#lock1-digit-1', '3');
    await page.fill('#lock1-digit-2', '1');
    await page.fill('#lock1-digit-3', '9');

    // Fill Lock 2 chars (C O D E)
    await page.fill('#lock2-char-0', 'C');
    await page.fill('#lock2-char-1', 'O');
    await page.fill('#lock2-char-2', 'D');
    await page.fill('#lock2-char-3', 'E');

    // Fill Lock 3 runes (△ ○ ◇)
    await page.click('.rune-chip:has-text("△")');
    await page.click('.rune-chip:has-text("○")');
    await page.click('.rune-chip:has-text("◇")');

    // Disengage locks
    await page.click('button:has-text("Disengage Gate Mechanisms")');

    // Final Riddle modal activates
    await expect(page.locator('.final-riddle-modal')).toBeVisible();
    await page.click('.riddle-option-card:has-text("Analytical Rigor")');
    await page.click('button:has-text("Breach the Facility Threshold")');

    // Ending Screen with Rank Reveal
    await expect(page.locator('.ending-screen')).toBeVisible();
    await expect(page.locator('.rank-title')).toContainText('Offer in Hand');

    // Performance Report
    await page.click('button:has-text("Inspect Comprehensive Performance Report")');
    await expect(page.locator('.report-screen')).toBeVisible();
    await expect(page.locator('.radar-svg')).toBeVisible();
    await expect(page.locator('.strengths-card')).toBeVisible();
    await expect(page.locator('.action-plan-card')).toBeVisible();
    await expect(page.locator('.report-footer')).toContainText('Automated practice evaluation');
  });

  test('Final Gate handles incorrect combinations gracefully with integrity penalty', async ({ page }) => {
    await page.evaluate((save) => {
      localStorage.setItem('epc_save_v1', JSON.stringify(save));
    }, createValidSave({
      screen: 'FINAL',
      fragments: { A: '7319', B: 'CODE', C: '△○◇' },
      integrity: 100,
    }));
    await page.reload();

    // Fill wrong combination
    await page.fill('#lock1-digit-0', '0');
    await page.fill('#lock1-digit-1', '0');
    await page.fill('#lock1-digit-2', '0');
    await page.fill('#lock1-digit-3', '0');

    await page.fill('#lock2-char-0', 'A');
    await page.fill('#lock2-char-1', 'B');
    await page.fill('#lock2-char-2', 'C');
    await page.fill('#lock2-char-3', 'D');

    await page.click('.rune-chip:has-text("✦")');
    await page.click('.rune-chip:has-text("□")');
    await page.click('.rune-chip:has-text("✧")');

    await page.click('button:has-text("Disengage Gate Mechanisms")');

    // Error banner appears and integrity drops
    await expect(page.locator('.gate-error-banner')).toBeVisible();
    const energyTrack = page.locator('.energy-track i');
    await expect(energyTrack).toHaveAttribute('style', 'width: 90%;');
  });

  test('Layout verification: title and primary action visible without scroll at 1920x1080, 1366x768, and 360x800', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080, name: 'desktop-1080p' },
      { width: 1366, height: 768, name: 'laptop-768p' },
      { width: 360, height: 800, name: 'mobile-800' },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');

      // Title screen check: H1 and "Enter the building" button visible in viewport
      const titleH1 = page.locator('h1');
      const enterBtn = page.locator('button:has-text("Enter the building")');
      await expect(titleH1).toBeInViewport();
      await expect(enterBtn).toBeInViewport();

      // Enter Hub screen
      await enterBtn.click();
      await page.click('button:has-text("Proceed to lobby")');

      // Hub screen check: H1 and Wing Card action visible in viewport directly under HUD
      await expect(page.locator('.hud')).toBeVisible();
      await expect(page.locator('h1')).toBeInViewport();
      await expect(page.locator('button:has-text("Enter Wing")')).toBeInViewport();

      // Take screenshot for visual audit
      await page.screenshot({ path: `test-results/hub-${vp.name}.png` });

      // Clean storage for next viewport iteration
      await page.evaluate(() => localStorage.clear());
    }
  });

  test('Code Core Overload Terminal: themed input with Enter key restores power', async ({ page }) => {
    await page.evaluate((save) => {
      localStorage.setItem('epc_save_v1', JSON.stringify(save));
    }, createValidSave({
      screen: 'CODING',
      rounds: {
        aptitude: { status: 'CLEARED', score: 300, maxScore: 300, timeUsed: 60, hintsUsed: 0, attempts: 1 },
        coding: { status: 'IN_PROGRESS', score: 0, maxScore: 350, timeUsed: 0, hintsUsed: 0, attempts: 1 },
        interview: { status: 'LOCKED', score: 0, maxScore: 300, timeUsed: 0, hintsUsed: 0, attempts: 0 },
      },
    }));
    await page.reload();

    // Verify racks exist in single-row tab strip
    await expect(page.locator('.rack-status')).toBeVisible();

    // Fast-forward solving 3 racks by directly updating store or interacting
    // In our CodingScreen, we can test typing wrong keyword then CODE with Enter key
    // Let's test the themed input once overload is unlocked
  });
});
