let currentId = null;
let isOn = false;
let answers = [];

const prompts = [
  "너의 이름은 뭐야?",
  "너의 반려동물명 / 반려물건명 / 반려취미가 뭐야? (택1)"
];

function generateId() {
  return Math.random().toString(16).slice(2);
}

function clearCursors() {
  document.querySelectorAll(".console-carrot").forEach((el) => el.remove());
}

function lockPreviousInput() {
  if (!currentId) return;
  const prevHidden = document.querySelector(`#${currentId} input.hidden-input`);
  if (prevHidden) prevHidden.disabled = true;
}

function getCurrentHiddenInput() {
  if (!currentId) return null;
  return document.querySelector(`#${currentId} input.hidden-input`);
}

function newLine(text, needsInput) {
  // 이전 입력 잠그기
  lockPreviousInput();

  const content = document.getElementById("Content");

  const line = document.createElement("div");
  line.textContent = text;
  content.appendChild(line);

  if (!needsInput) {
    window.scrollTo(0, document.body.scrollHeight);
    return;
  }

  currentId = "consoleInput-" + generateId();

  // 입력줄(보이는 span + 커서 + 숨겨진 input)
  const wrapper = document.createElement("div");
  wrapper.id = currentId;
  wrapper.className = "input-line";

  const prompt = document.createElement("span");
  prompt.textContent = "> ";

  const typed = document.createElement("span");
  typed.className = "console-typed";
  typed.textContent = "";

  const cursor = document.createElement("span");
  cursor.className = "console-carrot";

  const hiddenInput = document.createElement("input");
  hiddenInput.className = "hidden-input";
  hiddenInput.autofocus = true;

  wrapper.appendChild(prompt);
  wrapper.appendChild(typed);
  wrapper.appendChild(cursor);
  wrapper.appendChild(hiddenInput);
  content.appendChild(wrapper);

  // 클릭하면 포커스
  wrapper.addEventListener("click", () => hiddenInput.focus());

  // 입력값을 화면(span)에 미러링 (IME 안정)
  const sync = () => {
    typed.textContent = hiddenInput.value;
    window.scrollTo(0, document.body.scrollHeight);
  };

  hiddenInput.addEventListener("input", sync);
  hiddenInput.addEventListener("compositionend", sync);

  hiddenInput.focus();
  window.scrollTo(0, document.body.scrollHeight);
}

function start() {
  isOn = true;
  answers = [];
  currentId = null;
  document.getElementById("Content").innerHTML = "";
  document.getElementById("restart-button").style.display = "inline-block";

  newLine("이제부터 내가 너에게 딱 맞는 추천 아이디를 만들어줄게!", false);
  newLine(prompts[0], true);
}

function finish() {
  const idName = `${answers[0]} ${answers[1]}`.trim();
  newLine("내가 추천하는 너의 아이디는 이거야 ><", false);
  newLine("> " + idName, false);
  isOn = false;
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("run-button").addEventListener("click", start);
  document.getElementById("restart-button").addEventListener("click", start);
});

// Enter 처리
document.addEventListener("keydown", (event) => {
  if (!isOn) return;
  if (event.key !== "Enter") return;

  const hiddenInput = getCurrentHiddenInput();
  if (!hiddenInput || hiddenInput.disabled) return;

  const val = hiddenInput.value.trim();
  answers.push(val);

  // 이전 줄 커서 제거
  clearCursors();

  if (answers.length >= prompts.length) {
    lockPreviousInput();
    finish();
    return;
  }

  newLine(prompts[answers.length], true);
});
