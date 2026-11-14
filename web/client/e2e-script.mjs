export default async (page, ui) => {
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' });
  await page.getByText('Smart Helmet Command Center').waitFor({ timeout: 10000 });

  await page.getByRole('button', { name: 'Simulate Impact' }).click();
  await page.getByText('False Alarm Check').waitFor({ timeout: 5000 });
  const modalVisible = await page.getByText('False Alarm Check').isVisible();
  await page.getByRole('button', { name: 'CANCEL ALERT' }).click();
  await page.waitForTimeout(400);

  await page.getByRole('button', { name: 'Simulate Manual SOS' }).click();
  await page.waitForTimeout(500);

  await page.getByRole('link', { name: 'Incidents' }).click();
  const incidentsOk = (await page.locator('h1').textContent())?.includes('Incident History');

  await page.getByRole('link', { name: 'Analytics' }).click();
  const analyticsOk = (await page.locator('h1').textContent())?.includes('Ride Analytics');

  await page.getByRole('link', { name: 'Devices' }).click();
  const devicesOk = (await page.locator('h1').textContent())?.includes('Device Manager');

  await page.getByRole('link', { name: 'Profile' }).click();
  const profileOk = (await page.locator('h1').textContent())?.includes('Profile Settings');

  await page.getByRole('link', { name: 'Dashboard' }).click();
  await page.getByText('Smart Helmet Command Center').waitFor({ timeout: 5000 });

  await page.getByRole('button', { name: 'Toggle Network Drop' }).click();
  await page.waitForTimeout(600);
  const networkToggleWorked = await page.evaluate(() =>
    document.body.innerText.includes('OFFLINE') || document.body.innerText.includes('Network Drop'),
  );

  await page.getByRole('button', { name: 'Toggle Helmet Worn/Unworn' }).click();
  await page.waitForTimeout(600);

  await page.getByRole('button', { name: 'Settings' }).click();
  await page.waitForTimeout(300);
  const settingsOpen = await page.getByText('Configuration').isVisible();
  await page.getByRole('button', { name: 'Close' }).click();

  const alertCount = await page.evaluate(() => {
    const row = Array.from(document.querySelectorAll('div,span')).find((el) => /records$/.test(el.textContent || ''));
    return row?.textContent || null;
  });

  return {
    modalVisible,
    incidentsOk,
    analyticsOk,
    devicesOk,
    profileOk,
    networkToggleWorked,
    settingsOpen,
    alertCount,
    apiStatus: await page.evaluate(() =>
      Array.from(document.querySelectorAll('p')).map((p) => p.textContent).find((t) => t && t.includes('API status')),
    ),
  };
};
