const assert = require('node:assert/strict');
const { initializeApp, deleteApp } = require('firebase-admin/app');
const { getDatabase } = require('firebase-admin/database');
const { savePost, clientIp } = require('../dist/functions/chat');
const host = process.env.FIREBASE_DATABASE_EMULATOR_HOST;
if (!host) throw new Error('Run with firebase emulators:exec --only database --project demo-supercell');
const app = initializeApp({ projectId: 'demo-supercell', databaseURL: 'https://demo-supercell-default-rtdb.firebaseio.com' });
const db = getDatabase(app);
const message = { name: '', comment: 'こんにちは', id: 'Abcd1234Efgh5678' };
let checks = 0;
async function check(path, method, body, allowed) {
  const response = await fetch(`http://${host}/${path}.json?ns=demo-supercell-default-rtdb`, {
    method, ...(body !== undefined ? { body: JSON.stringify(body) } : {})
  });
  assert.equal(response.status, allowed ? 200 : 401, `${method} ${path}: ${await response.text()}`);
  checks++;
}
async function main() {
  await db.ref().set(null);
  assert.equal(clientIp('192.0.2.99, 198.51.100.1', undefined, false), '198.51.100.1');
  assert.equal(clientIp('spoofed', '::ffff:127.0.0.1', true), '127.0.0.1');
  assert.throws(() => clientIp(undefined, '127.0.0.1', false));
  assert.throws(() => clientIp('invalid', undefined, false));
  assert.equal(clientIp('2001:0db8:0:0:0:0:0:1', undefined, false), '2001:db8::1');
  checks += 5;
  const { postId } = await savePost(db, message, '192.0.2.1');
  const publicPost = (await db.ref(`chat/${postId}`).get()).val();
  assert.deepEqual(Object.keys(publicPost).sort(), ['comment', 'id', 'name', 'time']);
  assert.equal((await db.ref(`chatPrivate/${postId}/ip`).get()).val(), '192.0.2.1');
  checks += 2;
  await check('chat', 'GET', undefined, true);
  for (const path of ['', 'chatPrivate', `chatPrivate/${postId}`, `chatPrivate/${postId}/ip`, 'chatRateLimits']) {
    await check(path, 'GET', undefined, false);
    await check(path, 'PUT', {}, false);
  }
  await check('chat/direct', 'PUT', message, false);
  await check(`chat/${postId}`, 'PUT', message, false);
  await check(`chat/${postId}/comment`, 'PUT', '変更', false);
  await check(`chat/${postId}`, 'DELETE', undefined, false);
  await check('', 'PATCH', { 'chat/bypass': message }, false);
  const invalid = [null, [], { ...message, ip: '192.0.2.5' },
    { ...message, time: 'forged' }, { ...message, name: 'a'.repeat(41) },
    { ...message, comment: '' }, { ...message, comment: ' \t\n　' },
    { ...message, comment: 'a'.repeat(1001) }, { ...message, comment: {} },
    { ...message, id: 'short' }, { name: '', comment: 'missing id' }];
  for (const value of invalid) {
    await assert.rejects(savePost(db, value, '192.0.2.2'), { code: 'invalid-argument' });
    checks++;
  }
  const concurrent = await Promise.allSettled(Array.from({ length: 5 }, () => savePost(db, message, '192.0.2.3')));
  assert.equal(concurrent.filter(result => result.status === 'fulfilled').length, 1);
  for (const result of concurrent.filter(result => result.status === 'rejected')) {
    assert.equal(result.reason.code, 'resource-exhausted');
  }
  checks++;
  await savePost(db, { ...message, name: 'a'.repeat(40), comment: 'a'.repeat(1000) }, '192.0.2.4');
  const { createHash } = require('node:crypto');
  await db.ref(`chatRateLimits/${createHash('sha256').update('192.0.2.1').digest('hex')}`).set(Date.now() - 10001);
  await savePost(db, message, '192.0.2.1');
  checks += 2;
  console.log(`Database and posting: ${checks} checks passed`);
}
main().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => deleteApp(app));
