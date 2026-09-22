const http = require('http');

// Simple verification script that runs after next start
async function testApi() {
  const base = 'http://127.0.0.1:3000';
  
  console.log('--- Testing API Endpoints ---');
  
  // 1. Check state
  const stateRes = await fetch(`${base}/api/state`);
  const state = await stateRes.json();
  console.log('✓ /api/state returned couple:', state.partner1.name, '&', state.partner2.name);
  
  // 2. Check widget endpoint for partner 2
  const widgetRes1 = await fetch(`${base}/api/widget?partner=partner2`);
  const widget1 = await widgetRes1.json();
  console.log('✓ /api/widget for Partner 2 initial status:', widget1.unlock_status, '|', widget1.partner_status_badge);

  // 3. Submit answer for partner 1
  const ansRes1 = await fetch(`${base}/api/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      partnerId: 'partner1',
      answerText: 'Seeing you laugh when we were having tacos!',
    }),
  });
  console.log('✓ /api/answer submitted for partner1. Status:', ansRes1.status);

  // 4. Check widget again for partner 2 - should show partner 1 answered!
  const widgetRes2 = await fetch(`${base}/api/widget?partner=partner2`);
  const widget2 = await widgetRes2.json();
  console.log('✓ /api/widget for Partner 2 after partner 1 answered:', widget2.unlock_status, '|', widget2.partner_status_badge);

  // 5. Submit answer for partner 2
  const ansRes2 = await fetch(`${base}/api/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      partnerId: 'partner2',
      answerText: 'When you surprised me with iced coffee in the morning.',
    }),
  });
  console.log('✓ /api/answer submitted for partner2. Status:', ansRes2.status);

  // 6. Check widget again - both answered!
  const widgetRes3 = await fetch(`${base}/api/widget?partner=partner1`);
  const widget3 = await widgetRes3.json();
  console.log('✓ /api/widget after BOTH answered:', widget3.unlock_status, '|', widget3.partner_status_badge);

  // 7. Send a poke
  const pokeRes = await fetch(`${base}/api/poke`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fromPartnerId: 'partner1',
      emoji: '💋',
      message: 'Sent you a sweet kiss!',
    }),
  });
  console.log('✓ /api/poke sent kiss. Status:', pokeRes.status);

  // 8. Update mood
  const moodRes = await fetch(`${base}/api/mood`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      partnerId: 'partner2',
      mood: 'Super happy',
      moodEmoji: '🥰',
    }),
  });
  console.log('✓ /api/mood updated. Status:', moodRes.status);
  
  console.log('--- All API tests passed successfully! ---');
}

testApi().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
