const ensureToastContainer = () => {
  let container = document.querySelector<HTMLElement>("#copy-toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "copy-toast-container";
    container.className = "pointer-events-none fixed top-5 right-5 z-50 flex flex-col gap-2";
    document.body.appendChild(container);
  }
  return container;
};

const showToast = (message: string, variant: "success" | "error" = "success") => {
  const container = ensureToastContainer();
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.className = `pointer-events-auto rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-black/20 transition duration-200 ${variant === "error" ? "bg-red-500" : "bg-emerald-500"}`;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("opacity-100");
  });

  setTimeout(() => {
    toast.classList.add("opacity-0", "translate-y-1");
  }, 1500);

  setTimeout(() => {
    toast.remove();
  }, 2000);
};

const writeWithClipboardApi = async (text: string) => {
  if (!navigator.clipboard || !navigator.clipboard.writeText) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    return false;
  }
};

const legacyCopy = (text: string) => {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.top = "-9999px";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch (error) {
    copied = false;
  }

  document.body.removeChild(textarea);
  return copied;
};

const manualPromptFallback = (text: string) => {
  window.prompt("コピーできない場合は、以下のテキストを選択してコピーしてください", text);
};

const handleCopyClick = async (button: HTMLButtonElement) => {
  const code = button.dataset.copyCode ?? "";
  const label = button.querySelector<HTMLElement>(".copy-label");
  const originalLabel = label?.textContent ?? "コピー";

  if (label) label.textContent = "Copying...";
  let resetTimer = 0;
  const resetLabel = (duration: number) => {
    window.clearTimeout(resetTimer);
    resetTimer = window.setTimeout(() => {
      if (label) label.textContent = originalLabel;
    }, duration);
  };

  const copied = (await writeWithClipboardApi(code)) || legacyCopy(code);

  if (copied) {
    if (label) label.textContent = "Copied!";
    button.classList.add("ring", "ring-emerald-300/40");
    showToast("Copied!");
    resetLabel(2000);
    setTimeout(() => {
      button.classList.remove("ring", "ring-emerald-300/40");
    }, 2000);
    return;
  }

  showToast("コピーできませんでした。長押しで選択・コピーしてください。", "error");
  if (label) label.textContent = "コピーに失敗";
  resetLabel(2500);
  manualPromptFallback(code);
};

export const setupCopyButtons = () => {
  const copyButtons = document.querySelectorAll<HTMLButtonElement>(".copy-btn");
  copyButtons.forEach((button) => {
    if (button.dataset.copyBound === "true") return;
    button.dataset.copyBound = "true";
    button.addEventListener("click", () => handleCopyClick(button));
  });
};
