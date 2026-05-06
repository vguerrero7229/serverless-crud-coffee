import type { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { readFileSync } from 'fs';
import { join } from 'path';

const cors = { 'Access-Control-Allow-Origin': '*' } as const;

function loadRawSpec(): string {
  const paths = [join(process.cwd(), 'docs', 'openapi.yaml'), join(__dirname, 'docs', 'openapi.yaml')];
  for (const p of paths) {
    try {
      return readFileSync(p, 'utf8');
    } catch {
      /* try next */
    }
  }
  throw new Error('openapi.yaml not packaged with this function');
}

function apiBaseUrl(event: APIGatewayProxyEvent): string {
  const h = event.headers ?? {};
  const proto = String(h['X-Forwarded-Proto'] ?? h['x-forwarded-proto'] ?? 'https')
    .split(',')[0]
    .trim();
  const host = String(h.Host ?? h.host ?? '');
  const stage = event.requestContext.stage;
  return `${proto}://${host}/${stage}`;
}

/** Replace static servers block so Try it out hits this deployment */
function withDynamicServer(raw: string, baseUrl: string): string {
  return raw.replace(/^servers:[\s\S]*?(?=^tags:)/m, `servers:\n  - url: ${baseUrl}\n    description: This deployment\n\n`);
}

const SWAGGER_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Victor Guerrero - Coffee Shop Menu API — Swagger UI</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" crossorigin/>
</head>
<body>
<div id="swagger-ui"></div>
<script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js" crossorigin></script>
<script>
window.onload = function () {
  var path = window.location.pathname || '';
  var i = path.indexOf('/docs');
  var prefix = i >= 0 ? path.slice(0, i) : '';
  var specUrl = prefix + '/openapi.yaml';
  SwaggerUIBundle({ url: specUrl, dom_id: '#swagger-ui', deepLinking: true });
};
</script>
</body>
</html>`;

export const handler: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  const path = event.path ?? '';

  try {
    if (path.endsWith('/openapi.yaml')) {
      const body = withDynamicServer(loadRawSpec(), apiBaseUrl(event));
      return {
        statusCode: 200,
        headers: { ...cors, 'Content-Type': 'application/yaml; charset=utf-8' },
        body,
      };
    }

    if (path.endsWith('/docs') || path.endsWith('/docs/')) {
      return {
        statusCode: 200,
        headers: { ...cors, 'Content-Type': 'text/html; charset=utf-8' },
        body: SWAGGER_HTML,
      };
    }

    return {
      statusCode: 404,
      headers: { ...cors, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Not found' }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers: { ...cors, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Failed to serve API docs' }),
    };
  }
};
