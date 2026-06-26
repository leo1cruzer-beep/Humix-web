export function getDeviceFingerprint() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillText('Humix device check', 2, 2);
  const canvasData = canvas.toDataURL();

  const data = [
    navigator.language,
    navigator.platform,
    screen.width + 'x' + screen.height,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    canvasData.slice(-50),
  ].join('|');

  return btoa(data).slice(0, 32);
}
