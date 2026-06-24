export default class TableV2 {
  static get toolbox() {
    return {
      title: "Table V2",
      icon: `
        <svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none">
          <path d="M10 17H9.2C8.07989 17 7.51984 17 7.09202 16.782C6.71569 16.5903 6.40973 16.2843 6.21799 15.908C6 15.4802 6 14.9201 6 13.8V11C6 11.9319 6 12.3978 6.15224 12.7654C6.35523 13.2554 6.74458 13.6448 7.23463 13.8478C7.60218 14 8.06812 14 9 14M3 8H21M12 11H18M13 14H18M6.2 20H17.8C18.9201 20 19.4802 20 19.908 19.782C20.2843 19.5903 20.5903 19.2843 20.782 18.908C21 18.4802 21 17.9201 21 16.8V7.2C21 6.0799 21 5.51984 20.782 5.09202C20.5903 4.71569 20.2843 4.40973 19.908 4.21799C19.4802 4 18.9201 4 17.8 4H6.2C5.0799 4 4.51984 4 4.09202 4.21799C3.71569 4.40973 3.40973 4.71569 3.21799 5.09202C3 5.51984 3 6.07989 3 7.2V16.8C3 17.9201 3 18.4802 3.21799 18.908C3.40973 19.2843 3.71569 19.5903 4.09202 19.782C4.51984 20 5.07989 20 6.2 20Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `,
    };
  }

  constructor({ data }) {
    this.data = data || {};

    if (!Array.isArray(this.data.content) || this.data.content.length === 0) {
      this.data.content = [
        [{ text: "" }, { text: "" }],
        [{ text: "" }, { text: "" }],
      ];
    }

    this.wrapper = null;
  }

  render() {
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("tablev2-wrapper");

    this.renderTable();

    return this.wrapper;
  }

  renderTable() {
    this.wrapper.innerHTML = "";

    const table = document.createElement("table");
    table.className = "tablev2";

    this.data.content.forEach((row, rowIndex) => {
      const tr = document.createElement("tr");

      row.forEach((cell, colIndex) => {
        const td = document.createElement("td");

        const textarea = document.createElement("textarea");

        textarea.className = "tablev2-cell";
        textarea.placeholder = "Enter text...";
        textarea.value = cell?.text || "";

        const resize = () => {
          textarea.style.height = "0px";
          textarea.style.height = `${textarea.scrollHeight}px`;
        };

        requestAnimationFrame(resize);

        textarea.addEventListener("input", (e) => {
          this.data.content[rowIndex][colIndex].text = e.target.value;
          resize();
        });

        resize();

        textarea.addEventListener("input", (e) => {
          this.data.content[rowIndex][colIndex].text = e.target.value;
          resize();
        });

        td.appendChild(textarea);
        tr.appendChild(td);
      });

      table.appendChild(tr);
    });

    const controls = document.createElement("div");
    controls.className = "tablev2-controls";

    const addRowBtn = document.createElement("button");
    addRowBtn.type = "button";
    addRowBtn.textContent = "+ Row";

    addRowBtn.onclick = () => {
      const cols = this.data.content[0].length;

      this.data.content.push(
        Array.from({ length: cols }, () => ({
          text: "",
        }))
      );

      this.renderTable();
    };

    const addColBtn = document.createElement("button");
    addColBtn.type = "button";
    addColBtn.textContent = "+ Column";

    addColBtn.onclick = () => {
      this.data.content.forEach((row) => {
        row.push({
          text: "",
        });
      });

      this.renderTable();
    };

    controls.appendChild(addRowBtn);
    controls.appendChild(addColBtn);

    this.wrapper.appendChild(table);
    this.wrapper.appendChild(controls);
  }

  save() {
    return this.data;
  }
}
