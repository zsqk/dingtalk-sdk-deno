/**
 * 钉钉新版服务端 API
 */
export async function dingtalkFetch(
  path: string,
  token: string,
  { query, body }: { query?: [string, string][]; body?: unknown } = {},
) {
  const url = new URL(`https://api.dingtalk.com${path}`);
  if (query) {
    for (const [k, v] of query) {
      url.searchParams.set(k, v);
    }
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'x-acs-dingtalk-access-token': token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (res.status >= 500) {
    throw new Error(`DINGTALK HTTP ${res.status}`);
  }

  const resBody = await res.json();
  if (res.status >= 400) {
    throw new Error(
      ''.concat(res.status.toString() + ' ')
        .concat(resBody.code + ': ' + resBody.message),
    );
  }

  return {
    status: res.status,
    body: resBody,
  };
}
