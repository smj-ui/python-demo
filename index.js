let currentId = null;
let isOn = false;
let answers = [];

const prompts = [
  "What's the name of the city you grew up in?",
  "What's your pet's name?"
];

function generateId() {
  return Math.random().toString(16).slice(2);
}

function newLine(text, needsInput) {
  // 이전 입력 잠그기
  if (currentId) {
    const prevInput = document.querySelector(`#${currentId} input`);
    if (prevInput) prevInput.disabled = true;
  }

  const content = document.getElementById("Content");

  const line = document.createElement("div");
  line.textContent = text;
  content.appendChild(line);

  if (!needsInput) return;

  currentId = "consoleInput-" + generateId();

  const wrapper = document.createElement("div");
  wrapper.id = currentId;

  const prompt = document.createElement("span");
  prompt.textContent = "> ";

  const input = document.createElement("input");
  input.className = "terminal-input";
  input.size = 1;
  input.autofocus = true;

  const cursor = document.createElement("span");
  cursor.className = "console-carrot";

  wrapper.appendChild(prompt);
  wrapper.appendChild(input);
  wrapper.appendChild(cursor);
  content.appendChild(wrapper);

  input.focus();
  window.scrollTo(0, document.body.scrollHeight);
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("run-button").addEventListener("click", () => {
    isOn = true;
    answers = [];
    document.getElementById("Content").innerHTML = "";
    newLine("Welcome to the Band Name Generator.", false);
    newLine(prompts[0], true);
  });
});

document.addEventListener("keydown", (event) => {
  if (!isOn) return;
  if (event.key !== "Enter") return;
  if (!currentId) return;

  const input = document.querySelector(`#${currentId} input`);
  if (!input) return;

  const val = input.value.trim();
  answers.push(val);

  // 커서 제거
  document.querySelectorAll(".console-carrot").forEach((el) => el.remove());

  if (answers.length >= prompts.length) {
    const bandName = `${answers[0]} ${answers[1]}`.trim();
    newLine("Your band name could be " + bandName, false);
    isOn = false;
    return;
  }

  newLine(prompts[answers.length], true);
});

// 입력 길이에 따라 input size 조절(터미널 느낌)
document.addEventListener("input", () => {
  if (!currentId) return;
  const input = document.querySelector(`#${currentId} input`);
  if (!input) return;
  input.size = Math.max(1, input.value.length + 1);
});