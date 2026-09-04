import { expect, test } from '@playwright/test';
import createUserData from '../data/createUserData.json';

type CreateUserData = {
  name: string;
  job: string;
  expectedStatus: number;
  responseTimeLimit: number;
};

// run POST rest call '.../api/users' with data from ../data/createUserData.json
// check if response status is correct
// assert id and createdAt timestamp
// assert response time is less than the limit specified in createUserData.json
// The response time limit allows for normal public API network latency.

for (const userData of createUserData as CreateUserData[]) {
  test(`create user ${userData.name} - ${userData.job}`, async ({ request }) => {
    console.log(`\n=================== START TEST: ${userData.name} ===================`);
    console.log('REQUEST DATA:', {
      name: userData.name,
      job: userData.job,
    });

    const requestStartedAt = performance.now();
    
    const response = await request.post('https://reqres.in/api/users', {
      data: {
        name: userData.name,
        job: userData.job,
      },
    });
    
    const responseTime = performance.now() - requestStartedAt;
    const responseBody = await response.json();

    console.log('\n--- RESPONSE DETAILS ---');
    console.log(`STATUS CODE:    ${response.status()} (Expected: ${userData.expectedStatus})`);
    console.log(`RESPONSE TIME:  ${responseTime.toFixed(2)} ms (Limit: ${userData.responseTimeLimit} ms)`);
    console.log(`USER ID:        ${responseBody.id}`);
    console.log(`CREATED AT:     ${responseBody.createdAt}`);
    console.log('FULL BODY:     ', responseBody);
    console.log('------------------------\n');

    // 1. Assert HTTP status
    expect(response.status()).toBe(userData.expectedStatus);

    // 2. Assert ID
    expect(responseBody.id).toBeDefined();
    expect(String(responseBody.id)).toMatch(/^\d+$/);

    // 3. Assert createdAt timestamp
    expect(responseBody.createdAt).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);

    // 4. Assert response data
    expect(responseBody.name).toBe(userData.name);
    expect(responseBody.job).toBe(userData.job);

    // 5. Assert Response Time
    expect(responseTime).toBeLessThan(userData.responseTimeLimit);

    console.log(`STATUS: SUCCESS - User ${userData.name} created successfully.`);
    console.log(`=================== END TEST ===================\n`);
  });
}