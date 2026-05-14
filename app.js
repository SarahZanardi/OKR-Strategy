const okrs = [
  {
    cycle: "Trimestre 1",
    title: "Testar novas ideias com usuários reais",
    keyResults: [
      { title: "Realizar 6 testes com usuários", progress: 65 },
      { title: "Validar ideias em até 15 dias", progress: 45 },
      { title: "Registrar os aprendizados de cada teste", progress: 80 }
    ]
  },
  {
    cycle: "Trimestre 1",
    title: "Conectar estratégia e execução",
    keyResults: [
      { title: "Ligar 4 squads aos objetivos da empresa", progress: 75 },
      { title: "Fazer check-ins semanais com as lideranças", progress: 90 },
      { title: "Definir responsáveis para todas as iniciativas", progress: 55 }
    ]
  },
  {
    cycle: "Trimestre 1",
    title: "Organizar melhor as ideias do time",
    keyResults: [
      { title: "Mapear 40 oportunidades de melhoria", progress: 35 },
      { title: "Priorizar ideias por impacto e confiança", progress: 50 },
      { title: "Transformar 8 ideias em protótipos", progress: 25 }
    ]
  }
];

const grid = document.querySelector("#okrGrid");
const objectiveTemplate = document.querySelector("#objectiveTemplate");
const krTemplate = document.querySelector("#krTemplate");
const addObjectiveButton = document.querySelector("#addObjective");
const objectiveCount = document.querySelector("#objectiveCount");
const averageProgress = document.querySelector("#averageProgress");
const filterButtons = document.querySelectorAll(".filter-button");

let currentFilter = "all";

function getAverage(items) {
  if (!items.length) return 0;
  const total = items.reduce((sum, item) => sum + Number(item.progress), 0);
  return Math.round(total / items.length);
}

function getStatus(progress) {
  if (progress >= 70) return { label: "No alvo", group: "high", color: "var(--green)" };
  if (progress >= 40) return { label: "Em evolução", group: "medium", color: "var(--amber)" };
  return { label: "Atenção", group: "low", color: "var(--red)" };
}

function updateSummary() {
  const progressList = okrs.map((objective) => getAverage(objective.keyResults));
  objectiveCount.textContent = `${okrs.length} ${okrs.length === 1 ? "objetivo" : "objetivos"}`;
  averageProgress.textContent = `${getAverage(progressList.map((progress) => ({ progress })))}%`;
}

function render() {
  grid.innerHTML = "";

  okrs.forEach((objective, objectiveIndex) => {
    const progress = getAverage(objective.keyResults);
    const status = getStatus(progress);

    if (currentFilter !== "all" && status.group !== currentFilter) return;

    const card = objectiveTemplate.content.firstElementChild.cloneNode(true);
    const title = card.querySelector("h3");
    const cycle = card.querySelector(".card-cycle");
    const track = card.querySelector(".progress-track span");
    const progressLabel = card.querySelector(".progress-label");
    const statusLabel = card.querySelector(".status-label");
    const krList = card.querySelector(".kr-list");

    card.style.setProperty("--status-color", status.color);
    card.style.setProperty("--signal", `${Math.max(progress, 8)}%`);
    cycle.textContent = objective.cycle;
    title.textContent = objective.title;
    track.style.width = `${progress}%`;
    track.style.background = status.color;
    progressLabel.textContent = `${progress}%`;
    statusLabel.textContent = status.label;

    title.addEventListener("input", () => {
      objective.title = title.textContent.trim() || "Objetivo sem título";
    });

    card.querySelector(".remove-objective").addEventListener("click", () => {
      okrs.splice(objectiveIndex, 1);
      render();
    });

    card.querySelector(".add-kr").addEventListener("click", () => {
      objective.keyResults.push({ title: "Novo resultado-chave", progress: 0 });
      render();
    });

    objective.keyResults.forEach((kr, krIndex) => {
      const row = krTemplate.content.firstElementChild.cloneNode(true);
      const krTitle = row.querySelector(".kr-title");
      const krProgress = row.querySelector(".kr-progress");
      const krValue = row.querySelector(".kr-value");

      krTitle.value = kr.title;
      krProgress.value = kr.progress;
      krValue.textContent = `${kr.progress}%`;

      krTitle.addEventListener("input", () => {
        kr.title = krTitle.value;
      });

      krProgress.addEventListener("input", () => {
        kr.progress = Number(krProgress.value);
        krValue.textContent = `${kr.progress}%`;
        render();
      });

      row.querySelector(".remove-kr").addEventListener("click", () => {
        objective.keyResults.splice(krIndex, 1);
        render();
      });

      krList.append(row);
    });

    grid.append(card);
  });

  updateSummary();
}

addObjectiveButton.addEventListener("click", () => {
  okrs.unshift({
    cycle: "Novo ciclo",
    title: "Defina um objetivo inspirador e mensurável",
    keyResults: [
      { title: "Resultado-chave 1", progress: 0 },
      { title: "Resultado-chave 2", progress: 0 }
    ]
  });
  render();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    currentFilter = button.dataset.filter;
    render();
  });
});

render();
