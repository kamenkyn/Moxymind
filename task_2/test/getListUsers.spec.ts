import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, test } from '@playwright/test';

// run GET rest call '.../api/users?page=2'
// check if response status is 200, validate the response body contains 'total' and first two 'last names' of the users
// and write the response to console and JSON file

test('getListUsers returns users', async ({ request }) => {
  const response = await request.get('https://reqres.in/api/users?page=2');

  expect(response.status()).toBe(200);

  const responseBody = await response.json();
  const lastNames = responseBody.data.slice(0, 2).map(
    (user: { last_name: string }) => user.last_name,
  );
  const receivedUsersCount = responseBody.data.length;
  const usersCountComparison = receivedUsersCount <= responseBody.total;
  console.log('COMPARISON (receivedUsersCount <= total):', usersCountComparison);

  expect(receivedUsersCount).toBeLessThanOrEqual(responseBody.total);
  console.log('RECEIVED USERS:', receivedUsersCount);
  console.log('TOTAL:', responseBody.total);
  console.log('LAST NAMES:', lastNames);

  const containsUserWithLastName = responseBody.data.some(
    (user: { last_name?: unknown }) => typeof user.last_name === 'string',
  );
  console.log(
    'COMPARISON (data contains a user with a string last_name):',
    containsUserWithLastName,
  );

  expect(responseBody.data).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ last_name: expect.any(String) }),
    ]),
  );
  
   writeFileSync(
    resolve(__dirname, '../results/getListUsers.json'),
    JSON.stringify(responseBody, null, 2),
  );
  writeFileSync(
    resolve(__dirname, '../results/total.json'),
    JSON.stringify({ total: responseBody.total }, null, 2),
  );
  writeFileSync(
    resolve(__dirname, '../results/last_name.json'),
    JSON.stringify({ last_name: lastNames }, null, 2),
  );
});
