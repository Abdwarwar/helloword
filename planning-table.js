(function () {
  const template = document.createElement("template");
  template.innerHTML = `
    <style>
      :host {
        display: block;
        width: 100%;
        height: 100%;
        min-height: 180px;
        box-sizing: border-box;
        font-family: "72", "SAP Fiori 3", Arial, sans-serif;
        color: #1d2d3e;
        background: #fff;
      }

      * { box-sizing: border-box; }

      .shell {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        border: 1px solid #d9dfe6;
        background: #fff;
      }

      .toolbar {
        min-height: 42px;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 8px;
        border-bottom: 1px solid #d9dfe6;
        background: #f7f8fa;
      }

      button {
        height: 28px;
        border: 1px solid #0a6ed1;
        border-radius: 4px;
        background: #0a6ed1;
        color: #fff;
        font: inherit;
        font-size: 12px;
        line-height: 1;
        padding: 0 10px;
        cursor: pointer;
      }

      button.secondary {
        border-color: #bcc7d2;
        background: #fff;
        color: #0a6ed1;
      }

      button:disabled {
        cursor: not-allowed;
        opacity: 0.55;
      }

      .status {
        margin-left: auto;
        color: #556b82;
        font-size: 12px;
        white-space: nowrap;
      }

      .status.error { color: #bb0000; }
      .status.success { color: #107e3e; }

      .table-wrap {
        flex: 1;
        min-height: 0;
        overflow: auto;
      }

      table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        table-layout: fixed;
        font-size: 13px;
      }

      th, td {
        min-width: 120px;
        height: 34px;
        border-right: 1px solid #e5eaf0;
        border-bottom: 1px solid #e5eaf0;
        padding: 0 8px;
        text-align: left;
        vertical-align: middle;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      th {
        position: sticky;
        top: 0;
        z-index: 2;
        height: 36px;
        color: #354a5f;
        background: #f2f4f7;
        font-weight: 600;
      }

      th.measure,
      td.measure { text-align: right; }

      tr:hover td { background: #f5faff; }
      tr.selected td { background: #eaf4ff; }

      td.measure {
        padding: 0;
        background: #fffef5;
      }

      .cell-input,
      select {
        width: 100%;
        height: 100%;
        min-height: 32px;
        border: 0;
        outline: 0;
        background: transparent;
        color: inherit;
        font: inherit;
      }

      .cell-input {
        padding: 0 8px;
        text-align: right;
      }

      .cell-input:focus,
      select:focus {
        box-shadow: inset 0 0 0 2px #0a6ed1;
        background: #fff;
      }

      .cell-input.pending { background: #fff7d6; }
      .cell-input.error { background: #ffebeb; }
      .cell-input.success { background: #edf8f0; }

      td.dimension-select { padding: 0; }
      select { padding: 0 26px 0 8px; cursor: pointer; }

      .empty {
        padding: 18px;
        color: #556b82;
        font-size: 13px;
      }
    </style>
    <div class="shell">
      <div class="toolbar">
        <button id="addRowButton" type="button">Add New Row</button>
        <button id="submitButton" type="button" class="secondary">Submit</button>
        <span id="status" class="status"></span>
      </div>
      <div id="root" class="table-wrap"></div>
    </div>
  `;

  class PlanningTableWidget extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));

      this._root = this._shadowRoot.getElementById("root");
      this._status = this._shadowRoot.getElementById("status");
      this._dataBinding = null;
      this._newRows = [];
      this._selectedRows = new Set();
      this._pendingValues = new Map();

      this.planningEnabled = true;
      this.autoSubmit = true;
      this.autoPublish = false;

      this._shadowRoot.getElementById("addRowButton").addEventListener("click", () => this.addEmptyRow());
      this._shadowRoot.getElementById("submitButton").addEventListener("click", () => this.submitPlanningData());
    }

    connectedCallback() {
      this.render();
    }

    onCustomWidgetBeforeUpdate() {}

    onCustomWidgetAfterUpdate(changedProps) {
      Object.entries(changedProps || {}).forEach(([key, value]) => {
        this[key] = value;
      });
      this.render();
    }

    onCustomWidgetResize() {}
    onCustomWidgetDestroy() {}

    set myDataSource(value) {
      this._dataBinding = value;
      this.render();
    }

    get myDataSource() {
      return this._dataBinding;
    }

    render() {
      const dataSource = this._getDataSource();
      if (!dataSource || (dataSource.state && dataSource.state !== "success")) {
        this._root.innerHTML = `<div class="empty">Waiting for SAC data binding…</div>`;
        return;
      }

      const dimensions = this.getDimensions();
      const measures = this.getMeasures();
      const rows = this._getRows();

      if (dimensions.length === 0 || measures.length === 0) {
        this._root.innerHTML = `<div class="empty">Add dimensions and measures to the custom widget data binding.</div>`;
        return;
      }

      const table = document.createElement("table");
      const thead = document.createElement("thead");
      const headerRow = document.createElement("tr");

      dimensions.forEach((dimension) => {
        const th = document.createElement("th");
        th.textContent = dimension.description || dimension.id;
        headerRow.appendChild(th);
      });

      measures.forEach((measure) => {
        const th = document.createElement("th");
        th.className = "measure";
        th.textContent = measure.description || measure.id;
        headerRow.appendChild(th);
      });

      thead.appendChild(headerRow);
      table.appendChild(thead);

      const tbody = document.createElement("tbody");
      rows.forEach((row, rowIndex) => tbody.appendChild(this._createTableRow(row, rowIndex, false, dimensions, measures)));
      this._newRows.forEach((row, index) => tbody.appendChild(this._createTableRow(row, rows.length + index, true, dimensions, measures)));
      table.appendChild(tbody);

      this._root.replaceChildren(table);
      this._updateButtons();
    }

    _createTableRow(row, rowIndex, isNew, dimensions, measures) {
      const tr = document.createElement("tr");
      tr.dataset.rowIndex = String(rowIndex);
      tr.dataset.newRow = String(isNew);
      tr.addEventListener("click", () => this._selectRow(tr));

      dimensions.forEach((dimension) => {
        const cell = document.createElement("td");
        cell.dataset.dimensionId = dimension.id;
        cell.dataset.dimensionKey = dimension.key;

        if (isNew) {
          cell.className = "dimension-select";
          const select = document.createElement("select");
          const members = this._getDimensionMembers(dimension);
          members.forEach((member) => {
            const option = document.createElement("option");
            option.value = member.id;
            option.textContent = member.label || member.id;
            select.appendChild(option);
          });
          const current = row.dimensions[dimension.key] || row.dimensions[dimension.id] || members[0]?.id || "";
          select.value = current;
          row.dimensions[dimension.key] = current;
          cell.dataset.dimensionValue = current;
          select.addEventListener("change", () => {
            row.dimensions[dimension.key] = select.value;
            cell.dataset.dimensionValue = select.value;
            this.fireOnResultChange({ rowIndex, dimensionId: dimension.id, memberId: select.value });
          });
          cell.appendChild(select);
        } else {
          const member = this._readCell(row, dimension);
          const value = this._memberId(member);
          cell.dataset.dimensionValue = value;
          cell.title = value;
          cell.textContent = this._memberText(member);
        }

        tr.appendChild(cell);
      });

      measures.forEach((measure) => {
        const cell = document.createElement("td");
        cell.className = "measure";
        cell.dataset.measureId = measure.id;
        cell.dataset.measureKey = measure.key;

        const input = document.createElement("input");
        input.className = "cell-input";
        input.type = "text";
        input.inputMode = "decimal";
        input.disabled = this.planningEnabled === false;
        input.value = this._measureText(isNew ? row.measures[measure.key] : this._readCell(row, measure));
        input.dataset.originalValue = input.value;

        input.addEventListener("focus", () => {
          input.value = this._plainNumber(input.value);
          input.select();
        });
        input.addEventListener("keydown", (event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            input.blur();
          }
          if (event.key === "Escape") {
            input.value = input.dataset.originalValue || "";
            input.blur();
          }
        });
        input.addEventListener("change", () => this._stageCellValue(tr, cell, input));
        input.addEventListener("blur", () => this._stageCellValue(tr, cell, input));

        cell.appendChild(input);
        tr.appendChild(cell);
      });

      return tr;
    }

    async addEmptyRow() {
      const dimensions = this.getDimensions();
      const row = { dimensions: {}, measures: {} };
      dimensions.forEach((dimension) => {
        row.dimensions[dimension.key] = this._getDimensionMembers(dimension)[0]?.id || "";
      });
      this._newRows.push(row);
      this.render();
      this._setStatus("New row added. Select members and enter plan values.", "");
    }

    async submitPlanningData() {
      if (this._pendingValues.size === 0) {
        this._setStatus("No changed cells to submit.", "");
        return false;
      }

      let submitted = 0;
      const entries = Array.from(this._pendingValues.values());
      for (const entry of entries) {
        const ok = await this._writeBackValue(entry);
        if (ok) submitted += 1;
      }

      if (submitted > 0) {
        this._setStatus(`${submitted} cell${submitted === 1 ? "" : "s"} submitted`, "success");
      }
      this._updateButtons();
      return submitted > 0;
    }

    getSelections() {
      return Array.from(this._selectedRows).map((rowIndex) => JSON.stringify(this._rowSnapshot(Number(rowIndex))));
    }

    getSelectedRow() {
      return this.getSelections();
    }

    getDimensionSelected(dimensionId) {
      const dimensions = this.getDimensions();
      const dimension = dimensions.find((item) => item.id === dimensionId || item.key === dimensionId);
      if (!dimension) return [];
      return Array.from(this._selectedRows)
        .map((rowIndex) => this._dimensionValueForRow(Number(rowIndex), dimension))
        .filter(Boolean);
    }

    getMeasureValues(measureId) {
      const measures = this.getMeasures();
      const measure = measures.find((item) => item.id === measureId || item.key === measureId);
      if (!measure) return [];
      return Array.from(this._selectedRows)
        .map((rowIndex) => this._measureValueForRow(Number(rowIndex), measure))
        .filter((value) => value !== null && value !== undefined);
    }

    getDimensions() {
      const metadata = this._getMetadata();
      const feedKeys = this._readFeedValues(metadata?.feeds?.dimensions || metadata?.feeds?.dimension);
      const allDimensions = metadata?.dimensions || {};
      const keys = feedKeys.length ? feedKeys : Object.keys(allDimensions);
      return keys.map((key) => {
        const meta = allDimensions[key] || {};
        return {
          key,
          id: meta.id || key,
          description: meta.description || meta.label || meta.id || key,
        };
      });
    }

    getMeasures() {
      const metadata = this._getMetadata();
      const members = metadata?.mainStructureMembers || metadata?.measures || {};
      const feedKeys = this._readFeedValues(
        metadata?.feeds?.measures || metadata?.feeds?.measure || metadata?.feeds?.mainStructureMembers,
      );
      const keys = feedKeys.length ? feedKeys : Object.keys(members);
      return keys.map((key) => {
        const meta = members[key] || {};
        return {
          key,
          id: meta.id || key,
          description: meta.description || meta.label || meta.id || key,
        };
      });
    }

    addDimension() {}
    addMeasure() {}
    removeDimension() {}
    removeMeasure() {}

    getDimensionsOnFeed() {
      return this.getDimensions().map((dimension) => dimension.id);
    }

    getMeasuresOnFeed() {
      return this.getMeasures().map((measure) => measure.id);
    }

    getDataSource() {
      return this._getDataSource();
    }

    _stageCellValue(tr, cell, input) {
      if (this.planningEnabled === false) return;
      const raw = this._plainNumber(input.value);
      if (raw === "") return;

      const value = Number(raw);
      if (!Number.isFinite(value)) {
        input.classList.add("error");
        this._setStatus("Enter a valid number.", "error");
        return;
      }

      input.value = this._formatNumber(value);
      const rowIndex = Number(tr.dataset.rowIndex);
      const measureId = cell.dataset.measureId;
      const measureKey = cell.dataset.measureKey || measureId;
      const selection = this._buildPlanningSelection(rowIndex, measureKey);
      const key = `${rowIndex}:${measureKey}`;

      const entry = { key, rowIndex, measureId, measureKey, value, selection, input };
      this._pendingValues.set(key, entry);
      input.classList.remove("error", "success");
      input.classList.add("pending");

      this._updateLocalRow(rowIndex, measureKey, value);
      this.fireOnResultChange({ rowIndex, measureId, newValue: value, selection });
      this._updateButtons();

      if (this.autoSubmit !== false) {
        this._writeBackValue(entry);
      } else {
        this._setStatus("Cell changed. Press Submit to write back.", "");
      }
    }

    async _writeBackValue(entry) {
      const planning = this._getPlanning();
      if (!planning || typeof planning.setUserInput !== "function") {
        this._markEntryError(entry, "Planning is not available on this model/data source.");
        return false;
      }

      const missing = this.getDimensions().filter((dimension) => !entry.selection[dimension.key] && !entry.selection[dimension.id]);
      if (missing.length > 0) {
        this._markEntryError(entry, "Select all dimension members before writeback.");
        return false;
      }

      try {
        this._setStatus("Submitting planning value…", "");
        const inputResult = await Promise.resolve(planning.setUserInput(entry.selection, String(entry.value)));
        if (inputResult === false) throw new Error("SAC rejected the planning value.");

        if (typeof planning.submitData === "function") {
          const submitResult = await Promise.resolve(planning.submitData());
          if (submitResult === false) throw new Error("SAC rejected submitData().");
        }

        const publish = await this._publishVersions(planning);
        entry.input.classList.remove("pending", "error");
        entry.input.classList.add("success");
        entry.input.dataset.originalValue = entry.input.value;
        this._pendingValues.delete(entry.key);
        this.dispatchEvent(
          new CustomEvent("onDataSubmitted", {
            detail: {
              rowIndex: entry.rowIndex,
              measureId: entry.measureId,
              value: entry.value,
              selection: entry.selection,
              publish,
            },
          }),
        );
        this._setStatus("Planning value submitted", "success");
        this._updateButtons();
        return true;
      } catch (error) {
        this._markEntryError(entry, String(error?.message || error));
        return false;
      }
    }

    _buildPlanningSelection(rowIndex, measureKey) {
      const selection = { "@MeasureDimension": measureKey };
      this.getDimensions().forEach((dimension) => {
        const value = this._dimensionValueForRow(rowIndex, dimension);
        if (value) selection[dimension.key] = value;
      });
      return selection;
    }

    _dimensionValueForRow(rowIndex, dimension) {
      const existingRows = this._getRows();
      if (rowIndex < existingRows.length) {
        const member = this._readCell(existingRows[rowIndex], dimension);
        return this._memberId(member);
      }
      const newRow = this._newRows[rowIndex - existingRows.length];
      return newRow?.dimensions?.[dimension.key] || newRow?.dimensions?.[dimension.id] || "";
    }

    _measureValueForRow(rowIndex, measure) {
      const existingRows = this._getRows();
      if (rowIndex < existingRows.length) {
        return this._numericValue(this._readCell(existingRows[rowIndex], measure));
      }
      const newRow = this._newRows[rowIndex - existingRows.length];
      return newRow?.measures?.[measure.key] ?? null;
    }

    _rowSnapshot(rowIndex) {
      const snapshot = {};
      this.getDimensions().forEach((dimension) => {
        snapshot[dimension.id] = this._dimensionValueForRow(rowIndex, dimension);
      });
      this.getMeasures().forEach((measure) => {
        snapshot[measure.id] = this._measureValueForRow(rowIndex, measure);
      });
      return snapshot;
    }

    _updateLocalRow(rowIndex, measureKey, value) {
      const existingRows = this._getRows();
      if (rowIndex < existingRows.length) {
        const row = existingRows[rowIndex];
        if (row) row[measureKey] = { raw: value, formatted: this._formatNumber(value) };
        return;
      }
      const newRow = this._newRows[rowIndex - existingRows.length];
      if (newRow) newRow.measures[measureKey] = value;
    }

    _getDataBinding() {
      try {
        return this.dataBindings?.getDataBinding?.("myDataSource") || this._dataBinding || null;
      } catch (error) {
        return this._dataBinding || null;
      }
    }

    _getDataSource() {
      const binding = this._getDataBinding();
      try {
        const source = binding?.getDataSource?.();
        if (source) return source;
      } catch (error) {}
      return binding;
    }

    _getPlanning() {
      const binding = this._getDataBinding();
      const source = this._getDataSource();
      try {
        if (typeof binding?.getPlanning === "function") return binding.getPlanning();
      } catch (error) {}
      try {
        if (typeof source?.getPlanning === "function") return source.getPlanning();
      } catch (error) {}
      try {
        const nested = binding?.getDataSource?.();
        if (typeof nested?.getPlanning === "function") return nested.getPlanning();
      } catch (error) {}
      return null;
    }

    _getMetadata() {
      const dataSource = this._getDataSource();
      return dataSource?.metadata || dataSource?.getMetadata?.() || {};
    }

    _getRows() {
      const dataSource = this._getDataSource();
      if (Array.isArray(dataSource?.data)) return dataSource.data;
      try {
        const resultSet = dataSource?.getResultSet?.();
        if (Array.isArray(resultSet)) return resultSet;
      } catch (error) {}
      return [];
    }

    _getDimensionMembers(dimension) {
      const members = new Map();
      const metadataMembers = this._getMetadata()?.dimensions?.[dimension.key]?.members;
      if (Array.isArray(metadataMembers)) {
        metadataMembers.forEach((member) => members.set(this._memberId(member), this._memberText(member)));
      }
      this._getRows().forEach((row) => {
        const member = this._readCell(row, dimension);
        const id = this._memberId(member);
        if (id) members.set(id, this._memberText(member));
      });
      return Array.from(members.entries()).map(([id, label]) => ({ id, label }));
    }

    _readCell(row, item) {
      return row?.[item.key] ?? row?.[item.id] ?? row?.[item.description];
    }

    _readFeedValues(feed) {
      if (Array.isArray(feed)) return feed.map((item) => (typeof item === "string" ? item : item.id || item.key)).filter(Boolean);
      if (Array.isArray(feed?.values)) return this._readFeedValues(feed.values);
      return [];
    }

    _memberId(cell) {
      if (cell == null) return "";
      if (typeof cell === "string" || typeof cell === "number") return String(cell);
      return String(cell.id ?? cell.memberId ?? cell.key ?? cell.raw ?? cell.formatted ?? cell.label ?? cell.description ?? "");
    }

    _memberText(cell) {
      if (cell == null) return "";
      if (typeof cell === "string" || typeof cell === "number") return String(cell);
      return String(cell.description ?? cell.label ?? cell.formatted ?? cell.id ?? cell.memberId ?? cell.key ?? cell.raw ?? "");
    }

    _numericValue(cell) {
      if (cell == null) return null;
      const raw = typeof cell === "object" ? cell.raw ?? cell.value ?? cell.formatted : cell;
      const number = Number(this._plainNumber(String(raw ?? "")));
      return Number.isFinite(number) ? number : null;
    }

    _measureText(cell) {
      const value = this._numericValue(cell);
      return value == null ? "" : this._formatNumber(value);
    }

    _plainNumber(value) {
      return String(value ?? "").replace(/,/g, "").trim();
    }

    _formatNumber(value) {
      return Number(value).toLocaleString(undefined, { maximumFractionDigits: 8 });
    }

    async _publishVersions(planning) {
      if (this.autoPublish !== true) return { attempted: false, published: 0 };

      const versions = [];
      const collect = (items) => {
        if (Array.isArray(items)) items.forEach((item) => item && versions.push(item));
      };
      try { collect(planning.getPublicVersions?.()); } catch (error) {}
      try { collect(planning.getPrivateVersions?.()); } catch (error) {}

      let published = 0;
      for (const version of versions) {
        try {
          const dirty = typeof version.isDirty === "function" ? await Promise.resolve(version.isDirty()) : true;
          if (dirty && typeof version.publish === "function") {
            await Promise.resolve(version.publish());
            published += 1;
          }
        } catch (error) {}
      }
      return { attempted: versions.length > 0, published };
    }

    _selectRow(row) {
      const index = row.dataset.rowIndex;
      if (!index) return;
      if (this._selectedRows.has(index)) {
        this._selectedRows.delete(index);
        row.classList.remove("selected");
      } else {
        this._selectedRows.add(index);
        row.classList.add("selected");
      }
      this.dispatchEvent(new CustomEvent("onSelect", { detail: { selectedRows: Array.from(this._selectedRows) } }));
    }

    _markEntryError(entry, message) {
      entry.input.classList.remove("pending", "success");
      entry.input.classList.add("error");
      this._setStatus(message, "error");
      this.dispatchEvent(
        new CustomEvent("onSubmitError", {
          detail: {
            message,
            rowIndex: entry.rowIndex,
            measureId: entry.measureId,
            value: entry.value,
            selection: entry.selection,
          },
        }),
      );
    }

    _setStatus(message, type) {
      this._status.textContent = message || "";
      this._status.className = `status ${type || ""}`;
    }

    _updateButtons() {
      const submit = this._shadowRoot.getElementById("submitButton");
      submit.disabled = this.planningEnabled === false || this._pendingValues.size === 0;
    }

    fireOnResultChange(detail) {
      this.dispatchEvent(new CustomEvent("onResultChange", { detail }));
      this.dispatchEvent(new CustomEvent("onResultChanged", { detail }));
    }
  }

  if (!customElements.get("com-sap-custom-tablewidget")) {
    customElements.define("com-sap-custom-tablewidget", PlanningTableWidget);
  }
})();
