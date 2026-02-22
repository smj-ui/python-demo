let currentId = null;
let isOn = false;
let answers = [];

const prompts = [
  "너의 이름은 뭐야?",
  "너의 반려동물명 or 반려물건명 or 반려취미가 뭐야? (택1)"
];

function generateId() {
  return Math.random().toString(16).slice(2);
}

function newLine(text, needsInput) {
  // 이전 입력 잠그기
  if (currentId) {
    const prevHidden = document.querySelector(`#${currentId} input`);
    if (prevHidden) prevHidden.disabled = true;
  }

  const content = document.getElementById("Content");

  const line = document.createElement("div");
  line.textContent = text;
  content.appendChild(line);

  if (!needsInput) return;

  currentId = "consoleInput-" + generateId();

  // 입력줄(보이는 텍스트 span + 커서 + 숨겨진 input)
  const wrapper = document.createElement("div");
  wrapper.id = currentId;
  wrapper.className = "input-line";

  const prompt = document.createElement("span");
  prompt.textContent = "> ";

  const typed = document.createElement("span");
  typed.className = "console-typed";
  typed.textContent = ""; // 화면에 보이는 입력 내용

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

  // IME 포함 모든 입력을 span에 미러링
  hiddenInput.addEventListener("input", () => {
    typed.textContent = hiddenInput.value;
    window.scrollTo(0, document.body.scrollHeight);
  });

  // 한글 조합 입력 안정화
  hiddenInput.addEventListener("compositionend", () => {
    typed.textContent = hiddenInput.value;
  });

  hiddenInput.focus();
  window.scrollTo(0, document.body.scrollHeight);
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("run-button").addEventListener("click", () => {
    isOn = true;
    answers = [];
    document.getElementById("Content").innerHTML = "";
    newLine("이제부터 내가 너에게 딱 맞는 추천 아이디를 만들어줄게", false);
    newLine(prompts[0], true);
  });
});

document.addEventListener("keydown", (event) => {
  if (!isOn) return;
  if (event.key !== "Enter") return;
  if (!currentId) return;

  const hiddenInput = document.querySelector(`#${currentId} input`);
  if (!hiddenInput) return;

  const val = hiddenInput.value.trim();
  answers.push(val);

  // 이전 줄 커서 제거
  document.querySelectorAll(".console-carrot").forEach((el) => el.remove());

  if (answers.length >= prompts.length) {
    const bandName = `${answers[0]} ${answers[1]}`.trim();
    newLine("내가 추천하는 너의 아이디는 이거야 ><", false);
    newLine("> " + bandName, false);
    isOn = false;
    return;
  }

  newLine(prompts[answers.length], true);
});
