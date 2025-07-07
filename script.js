const form = document.getElementById("formAluno");
const listaAlunos = document.getElementById("listaAlunos");
const buscaInput = document.getElementById("busca");

let alunos = JSON.parse(localStorage.getItem("alunos")) || [];

// localstorage
function salvarAlunos() {
  localStorage.setItem("alunos", JSON.stringify(alunos));
  carregarAlunos();
}

function carregarAlunos(filtro = "") {
  listaAlunos.innerHTML = "";

  const filtrados = alunos.filter(aluno =>
    aluno.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  //montar cards do aluno
  filtrados.forEach((aluno, index) => {
    const card = document.createElement("div");
    card.className = "col-md-4";

    if (aluno.cep.length === 8) {
        aluno.cep = aluno.cep.substring(0, 5)+"-"+aluno.cep.substring(5);
    }

    card.innerHTML = `
      <div class="card shadow-sm">
        <div class="card-body">
          <h5 class="card-title text-capitalize">${aluno.nome}</h5>
          <p class="card-text">
            ${aluno.email}<br>
            ${aluno.logradouro}, Nº ${aluno.numero}, ${aluno.bairro}, ${aluno.cidade} - ${aluno.uf}<br>
            CEP: ${aluno.cep}
          </p>
          <button class="btn btn-primary btn-sm me-2" onclick="editarAluno(${index})">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="removerAluno(${index})">Remover</button>
        </div>
      </div>
    `;

    //add a lista
    listaAlunos.appendChild(card);
  });
}

// preencher os outros campos automaticamente atraves do cep, usando o viacep
document.getElementById("cep").addEventListener("blur", async function () {
  const cep = this.value.replace(/\D/g, "");
  if (cep.length !== 8) return;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();

    if (!data.erro) {
      document.getElementById("logradouro").value = data.logradouro || "";
      document.getElementById("bairro").value = data.bairro || "";
      document.getElementById("cidade").value = data.localidade || "";
      document.getElementById("uf").value = data.uf || "";
    }
  } catch (err) {
    console.error("rua dos bobos numero 0", err);
  }
});

// adicionar aluno
form.addEventListener("submit", function (e) {
  e.preventDefault();
  
  //instanciar objeto aluno
  const novoAluno = {
    nome: document.getElementById("nome").value.trim(),
    email: document.getElementById("email").value.trim(),
    cep: document.getElementById("cep").value.trim(),
    logradouro: document.getElementById("logradouro").value.trim(),
    numero: document.getElementById("numero").value.trim(),
    bairro: document.getElementById("bairro").value.trim(),
    cidade: document.getElementById("cidade").value.trim(),
    uf: document.getElementById("uf").value.trim()
  };

  //caso seja uma ediçao, deletar a versao antiga e adicionar a nova
  if (form.dataset.editIndex) {
    alunos[form.dataset.editIndex] = novoAluno;
    delete form.dataset.editIndex;
  } else {
    alunos.push(novoAluno);
  }

  //resetar inputs
  form.reset();

  //salvar no localstorage
  salvarAlunos();
});

// remover aluno
function removerAluno(index) {
  if (confirm("Tem certeza que deseja remover este aluno?")) {
    alunos.splice(index, 1);
    salvarAlunos();
  }
}

// editar aluno
function editarAluno(index) {
  const aluno = alunos[index];

  document.getElementById("nome").value = aluno.nome;
  document.getElementById("email").value = aluno.email;
  document.getElementById("cep").value = aluno.cep;
  document.getElementById("logradouro").value = aluno.logradouro;
  document.getElementById("numero").value = aluno.numero;
  document.getElementById("bairro").value = aluno.bairro;
  document.getElementById("cidade").value = aluno.cidade;
  document.getElementById("uf").value = aluno.uf;

  form.dataset.editIndex = index;
}

// buscar
buscaInput.addEventListener("input", () => {
  carregarAlunos(buscaInput.value);
});

// carregar do localstorage
carregarAlunos();
