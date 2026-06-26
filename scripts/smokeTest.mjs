const FRONT_URL = process.env.SMOKE_FRONT_URL || 'http://localhost:5173';
const API_URL = process.env.SMOKE_API_URL || process.env.VITE_API_URL || 'http://localhost:3000';
const CPF = process.env.SMOKE_CPF;
const PASSWORD = process.env.SMOKE_PASSWORD;

function logOk(message) {
  console.log(`OK - ${message}`);
}

function logInfo(message) {
  console.log(`INFO - ${message}`);
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  let data = null;
  const text = await response.text();

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  return { response, data };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function checkFrontend() {
  const { response, data } = await request(FRONT_URL, {
    headers: { Accept: 'text/html' },
  });

  assert(
    response.ok,
    `Frontend indisponivel em ${FRONT_URL}. Status recebido: ${response.status}`
  );

  assert(
    typeof data === 'string' && data.includes('id="root"'),
    'HTML do frontend nao contem o elemento #root.'
  );

  logOk('Frontend respondendo');
}

async function checkApiHealth() {
  const { response } = await request(API_URL);

  assert(
    response.ok,
    `API indisponivel em ${API_URL}. Status recebido: ${response.status}`
  );

  logOk('API respondendo');
}

async function checkLoginAndProtectedRoutes() {
  if (!CPF || !PASSWORD) {
    logInfo(
      'SMOKE_CPF e SMOKE_PASSWORD nao definidos. Teste de login foi ignorado.'
    );
    return;
  }

  const login = await request(`${API_URL}/login`, {
    method: 'POST',
    body: JSON.stringify({ cpf: CPF, password: PASSWORD }),
  });

  assert(
    login.response.ok,
    `Falha no login. Status: ${login.response.status}. Resposta: ${JSON.stringify(login.data)}`
  );

  const token = login.data?.token;
  assert(token, 'Login nao retornou token.');

  logOk('Login pela API');

  const authHeaders = { Authorization: `Bearer ${token}` };

  const employees = await request(`${API_URL}/employees`, {
    headers: authHeaders,
  });

  assert(
    employees.response.status === 200 || employees.response.status === 403,
    `Rota /employees retornou status inesperado: ${employees.response.status}`
  );

  logOk('Rota protegida /employees respondeu');

  const companies = await request(`${API_URL}/companies`, {
    headers: authHeaders,
  });

  assert(
    companies.response.status === 200 || companies.response.status === 403,
    `Rota /companies retornou status inesperado: ${companies.response.status}`
  );

  logOk('Rota protegida /companies respondeu');
}

async function main() {
  console.log('Iniciando smoke test do frontend...');
  console.log(`Frontend: ${FRONT_URL}`);
  console.log(`API: ${API_URL}`);

  await checkFrontend();
  await checkApiHealth();
  await checkLoginAndProtectedRoutes();

  console.log('Smoke test do frontend finalizado com sucesso.');
}

main().catch((error) => {
  console.error('Smoke test do frontend falhou.');
  console.error(error);
  process.exit(1);
});
