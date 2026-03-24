let questions = [];
let current = 0;
let scores = {
  SE:0, CS:0, IoT:0, AI:0, CG:0, Game:0
};

document.addEventListener("click", function(e){
  if(e.target.id === "startBtn"){
    startTest();
  }
  if(e.target.classList.contains("option-btn")){
    const point = Number(e.target.dataset.point);
    answer(point);
  }
});

async function startTest(){
  const res = await fetch("./questions.json");
  questions = await res.json();
  current = 0;
  showQuestion();
}

function showQuestion(){
  const app = document.getElementById("app");
  const q = questions[current];

  const progress = (current / questions.length) * 100;

  app.innerHTML = `
    <div class="progress">
      <div class="progress-bar" style="width:${progress}%"></div>
    </div>
    <h2>Q${current+1}. ${q.text}</h2>
    ${[1,2,3,4,5].map(i=>`
      <button class="option-btn" data-point="${i}">
      ${["全く思わない","あまり思わない","どちらでもない","ややそう思う","とてもそう思う"][i-1]}
      </button>`).join("")}
  `;
}

function answer(point){
  const type = questions[current].type;
  scores[type] += point;
  current++;

  if(current < questions.length){
    showQuestion();
  } else {
    showResult();
  }
}

function showResult(){
  let maxType = Object.keys(scores).reduce((a,b)=>
    scores[a] > scores[b] ? a : b
  );

  const descriptions = {
    SE: { desc: "システム設計タイプ", img: "images/se.jpg" },
    CS: { desc: "理論探究タイプ", img: "images/cs.jpg" },
    IoT: { desc: "モノづくりタイプ", img: "images/iot.jpg" },
    AI: { desc: "分析タイプ", img: "images/ai.jpg" },
    CG: { desc: "表現タイプ", img: "images/cg.jpg" },
    Game: { desc: "世界設計タイプ", img: "images/game.jpg" }
  };

  document.getElementById("app").innerHTML = `
    <h1>診断結果</h1>
    <h2>${maxType}</h2>
    <img src="${descriptions[maxType].img}" alt="${maxType}のイメージ" style="max-width:300px; height:auto;">
    <p>${descriptions[maxType].desc}</p>
    <button id="startBtn">もう一度診断する</button>
  `;
}