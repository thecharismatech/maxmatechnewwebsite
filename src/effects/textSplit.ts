const SPACE = /(\s+)/;

function textNodesIn(el: HTMLElement): Text[] {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const out: Text[] = [];
  let node = walker.nextNode();
  while (node) {
    out.push(node as Text);
    node = walker.nextNode();
  }
  return out;
}

function fragmentFor(text: string, cls: string, mode: "word" | "char"): DocumentFragment {
  const frag = document.createDocumentFragment();
  for (const chunk of text.split(SPACE)) {
    if (chunk === "") continue;
    if (!chunk.trim()) {
      frag.appendChild(document.createTextNode(chunk));
      continue;
    }
    const pieces = mode === "char" ? Array.from(chunk) : [chunk];
    for (const piece of pieces) {
      const span = document.createElement("span");
      span.className = cls;
      span.textContent = piece;
      frag.appendChild(span);
    }
  }
  return frag;
}

function alreadySplit(el: HTMLElement, marker: string): boolean {
  return el.dataset[marker] === "1";
}

function mark(el: HTMLElement, marker: string): void {
  el.dataset[marker] = "1";
}

export function splitWords(el: HTMLElement, cls = "split-word"): HTMLElement[] {
  if (alreadySplit(el, "splitWords")) return Array.from(el.querySelectorAll<HTMLElement>(`.${cls}`));
  const made: HTMLElement[] = [];
  for (const node of textNodesIn(el)) {
    const frag = fragmentFor(node.textContent ?? "", cls, "word");
    made.push(...Array.from(frag.querySelectorAll<HTMLElement>(`.${cls}`)));
    node.parentNode?.replaceChild(frag, node);
  }
  mark(el, "splitWords");
  return made;
}

export function splitChars(el: HTMLElement, cls = "split-char"): HTMLElement[] {
  if (alreadySplit(el, "splitChars")) return Array.from(el.querySelectorAll<HTMLElement>(`.${cls}`));
  const made: HTMLElement[] = [];
  for (const node of textNodesIn(el)) {
    const frag = fragmentFor(node.textContent ?? "", cls, "char");
    made.push(...Array.from(frag.querySelectorAll<HTMLElement>(`.${cls}`)));
    node.parentNode?.replaceChild(frag, node);
  }
  mark(el, "splitChars");
  return made;
}

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
