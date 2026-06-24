export default class TableV2 {
  static get toolbox() {
    return {
      title: "Table V2",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 8H21M9 8V20M3 7.2V16.8C3 17.92 3 18.48 3.218 18.908C3.41 19.284 3.716 19.59 4.092 19.782C4.52 20 5.08 20 6.2 20H17.8C18.92 20 19.48 20 19.908 19.782C20.284 19.59 20.59 19.284 20.782 18.908C21 18.48 21 17.92 21 16.8V7.2C21 6.08 21 5.52 20.782 5.092C20.59 4.716 20.284 4.41 19.908 4.218C19.48 4 18.92 4 17.8 4H6.2C5.08 4 4.52 4 4.092 4.218C3.716 4.41 3.41 4.716 3.218 5.092C3 5.52 3 6.08 3 7.2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get enableLineBreaks() {
    return true;
  }

  static get pasteConfig() {
    return {
      tags: [],
      patterns: {},
      files: {},
    };
  }

  constructor({ data, readOnly }) {
    this.readOnly = readOnly || false;
    this.data = {
      withHeadings: data?.withHeadings ?? false,
      content: this._normalize(data?.content),
    };
    this.wrapper = null;
  }

  _normalize(content) {
    if (!Array.isArray(content) || content.length === 0) {
      return [
        [{ text: "" }, { text: "" }],
        [{ text: "" }, { text: "" }],
      ];
    }
    return content.map((row) =>
      row.map((cell) =>
        typeof cell === "object" && cell !== null
          ? { text: cell.text ?? "" }
          : { text: String(cell ?? "") }
      )
    );
  }

  render() {
    this.wrapper = document.createElement("div");
    this.wrapper.className = "tablev2-wrapper";
    this._renderTable();
    return this.wrapper;
  }

  _renderTable() {
    this.wrapper.innerHTML = "";

    const scroll = document.createElement("div");
    scroll.className = "tablev2-scroll";

    const table = document.createElement("table");
    table.className = "tablev2";
    if (this.data.withHeadings) table.classList.add("with-headings");

    this.data.content.forEach((row, r) => {
      const tr = document.createElement("tr");
      row.forEach((cell, c) => {
        const isHead = this.data.withHeadings && r === 0;
        const td = document.createElement(isHead ? "th" : "td");
        td.dataset.r = r;
        td.dataset.c = c;

        if (this.readOnly) {
          td.textContent = cell.text;
          td.classList.add("readonly");
        } else {
          const ta = document.createElement("textarea");
          ta.className = "tablev2-cell";
          ta.placeholder = isHead ? "Heading…" : "Text…";
          ta.value = cell.text;
          ta.rows = 1;

          const resize = () => {
            ta.style.height = "auto";
            ta.style.height = `${ta.scrollHeight}px`;
          };

          ta.addEventListener("input", () => {
            this.data.content[r][c].text = ta.value;
            resize();
          });

          ta.addEventListener("paste", (e) => {
            e.stopPropagation();
            this._onPaste(e, r, c);
          });
          ta.addEventListener("copy", (e) => e.stopPropagation());
          ta.addEventListener("cut", (e) => e.stopPropagation());
          ta.addEventListener("keydown", (e) => this._onKeydown(e, r, c, ta));

          requestAnimationFrame(resize);
          td.appendChild(ta);
        }
        tr.appendChild(td);
      });
      table.appendChild(tr);
    });

    scroll.appendChild(table);
    this.wrapper.appendChild(scroll);

    if (!this.readOnly) this._renderControls();
  }

  _renderControls() {
    const bar = document.createElement("div");
    bar.className = "tablev2-controls";

    const mk = (label, title, fn) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = label;
      b.title = title;
      b.onmousedown = (e) => e.preventDefault();
      b.onclick = fn;
      return b;
    };

    bar.appendChild(mk("+ Row", "Add row at bottom", () => this._addRow()));
    bar.appendChild(mk("+ Col", "Add column at right", () => this._addCol()));
    bar.appendChild(mk("− Row", "Remove last row", () => this._delRow()));
    bar.appendChild(mk("− Col", "Remove last column", () => this._delCol()));

    const toggle = document.createElement("label");
    toggle.className = "tablev2-toggle";
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = this.data.withHeadings;
    cb.onchange = () => {
      this.data.withHeadings = cb.checked;
      this._renderTable();
    };
    toggle.append(cb, document.createTextNode("Header row"));
    bar.appendChild(toggle);

    this.wrapper.appendChild(bar);
  }

  _cols() {
    return this.data.content[0]?.length || 0;
  }

  _addRow() {
    this.data.content.push(
      Array.from({ length: this._cols() }, () => ({ text: "" }))
    );
    this._renderTable();
  }

  _addCol() {
    this.data.content.forEach((row) => row.push({ text: "" }));
    this._renderTable();
  }

  _delRow() {
    if (this.data.content.length > 1) {
      this.data.content.pop();
      this._renderTable();
    }
  }

  _delCol() {
    if (this._cols() > 1) {
      this.data.content.forEach((row) => row.pop());
      this._renderTable();
    }
  }

  _ensureSize(rows, cols) {
    while (this.data.content.length < rows) {
      this.data.content.push(
        Array.from({ length: this._cols() }, () => ({ text: "" }))
      );
    }
    if (cols > this._cols()) {
      this.data.content.forEach((row) => {
        while (row.length < cols) row.push({ text: "" });
      });
    }
  }

  _onPaste(e, startR, startC) {
    e.preventDefault();
    e.stopPropagation();

    const clip = e.clipboardData || window.clipboardData;
    if (!clip) return;

    let text = "";
    try {
      text = clip.getData("text/plain") || clip.getData("Text") || "";
    } catch (err) {
      text = "";
    }

    if (typeof text !== "string" || text.length === 0) return;

    const hasTable = text.indexOf("\t") !== -1 || text.indexOf("\n") !== -1;

    if (!hasTable) {
      const ta = e.target;
      const s = ta.selectionStart;
      const en = ta.selectionEnd;
      const next = ta.value.slice(0, s) + text + ta.value.slice(en);
      ta.value = next;
      this.data.content[startR][startC].text = next;
      const pos = s + text.length;
      ta.setSelectionRange(pos, pos);
      ta.style.height = "auto";
      ta.style.height = `${ta.scrollHeight}px`;
      return;
    }

    const lines = text.replace(/\r/g, "").replace(/\n$/, "").split("\n");
    const rows = lines.map((line) => line.split("\t"));

    let maxCols = 0;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].length > maxCols) maxCols = rows[i].length;
    }

    const needRows = startR + rows.length;
    const needCols = startC + maxCols;
    const grew =
      needRows > this.data.content.length || needCols > this._cols();

    this._ensureSize(needRows, needCols);

    for (let ri = 0; ri < rows.length; ri++) {
      for (let ci = 0; ci < rows[ri].length; ci++) {
        const r = startR + ri;
        const c = startC + ci;
        if (this.data.content[r] && this.data.content[r][c]) {
          this.data.content[r][c].text = rows[ri][ci];
        }
      }
    }

    if (grew) {
      requestAnimationFrame(() => {
        this._renderTable();
        this._focusCell(startR, startC);
      });
    } else {
      this._syncCells();
      this._focusCell(startR, startC);
    }
  }

  _syncCells() {
    const cells = this.wrapper.querySelectorAll(".tablev2-cell");
    cells.forEach((ta) => {
      const td = ta.closest("[data-r]");
      if (!td) return;
      const r = Number(td.dataset.r);
      const c = Number(td.dataset.c);
      const val = this.data.content[r]?.[c]?.text ?? "";
      if (ta.value !== val) {
        ta.value = val;
        ta.style.height = "auto";
        ta.style.height = `${ta.scrollHeight}px`;
      }
    });
  }

  _onKeydown(e, r, c, ta) {
    if (e.ctrlKey || e.metaKey) return;

    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      if (r === this.data.content.length - 1) this._addRow();
      this._focusCell(r + 1, c);
      return;
    }

    if (e.key === "Enter") {
      e.stopPropagation();
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();
      let nr = r;
      let nc = c + (e.shiftKey ? -1 : 1);
      if (nc >= this._cols()) { nc = 0; nr++; }
      if (nc < 0) { nc = this._cols() - 1; nr--; }
      if (nr >= this.data.content.length && !e.shiftKey) this._addRow();
      if (nr < 0) return;
      this._focusCell(nr, nc);
      return;
    }

    const atStart = ta.selectionStart === 0 && ta.selectionEnd === 0;
    const atEnd =
      ta.selectionStart === ta.value.length &&
      ta.selectionEnd === ta.value.length;

    if (e.key === "ArrowUp" && atStart) {
      e.preventDefault();
      e.stopPropagation();
      this._focusCell(r - 1, c);
    } else if (e.key === "ArrowDown" && atEnd) {
      e.preventDefault();
      e.stopPropagation();
      this._focusCell(r + 1, c);
    }
  }

  _focusCell(r, c) {
    requestAnimationFrame(() => {
      const td = this.wrapper.querySelector(`[data-r="${r}"][data-c="${c}"]`);
      const ta = td?.querySelector("textarea");
      if (ta) {
        ta.focus();
        ta.setSelectionRange(ta.value.length, ta.value.length);
      }
    });
  }

  save() {
    const content = this.data.content.filter(
      (row, i) => i < 1 || row.some((cell) => cell.text.trim() !== "")
    );
    return { withHeadings: this.data.withHeadings, content };
  }

  validate(data) {
    return Array.isArray(data?.content) && data.content.length > 0;
  }
}