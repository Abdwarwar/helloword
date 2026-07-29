(function () {
  const prepared = document.createElement("template");
  prepared.innerHTML = `
    <style>
      table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      th { background-color: #f4f4f4; }
      tr:nth-child(even) { background-color: #f9f9f9; }
      tr.selected { background-color: #ffeb3b; }
      td.editable { background-color: #fff3e0; }
      td.writeback-error { background-color: #ffcdd2; }
      button { margin-bottom: 10px; padding: 5px 10px; cursor: pointer; }
    </style>
    <div id="controls">
      <button id="addRowButton">Add New Row</button>
    </div>
    <div id="root" style="width: 100%; height: 100%; overflow: auto;"></div>
  `;

  class CustomTableWidget extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(prepared.content.cloneNode(true));
      this._root = this._shadowRoot.getElementById("root");
      this._selectedRows = new Set();
      this._myDataSource = null;
      this._newRowsData = [];

      this.planningEnabled = true;
      this.autoSubmit = true;

      const addRowButton = this._shadowRoot.getElementById("addRowButton");
      addRowButton.addEventListener("click", () => this.addEmptyRow());
    }

    connectedCallback() {
      this.render();
    }

    onCustomWidgetBeforeUpdate(changedProps) {
      this._pendingProps = changedProps;
    }

    onCustomWidgetAfterUpdate(changedProps) {
      Object.keys(changedProps || {}).forEach((key) => {
        this[key] = changedProps[key];
      });
      this.render();
    }

    onCustomWidgetResize() {}

    onCustomWidgetDestroy() {}

    set myDataSource(dataBinding) {
      this._myDataSource = dataBinding;
      this.render();
    }

    get myDataSource() {
      return this._myDataSource;
    }

    render() {
      const dataSource = this._getDataSource();
      if (!dataSource || dataSource.state !== "success") {
        this._root.innerHTML = `<p>Loading data...</p>`;
        return;
      }

      const dimensions = this.getDimensions();
      const measures = this.getMeasures();

      if (dimensions.length === 0 || measures.length === 0) {
        this._root.innerHTML = `<p>Please add Dimensions and Measures in the Builder Panel.</p>`;
        return;
      }

      console.log("Resolved Dimensions:", dimensions);
      console.log("Resolved Measures:", measures);

      const tableData = dataSource.data.map((row, index) => ({
        index,
        ...dimensions.reduce((acc, dim) => {
          acc[dim.id] = row[dim.key]?.label || row[dim.key]?.description || row[dim.key]?.id || "N/A";
          return acc;
        }, {}),
        ...measures.reduce((acc, measure) => {
          acc[measure.id] = row[measure.key]?.raw ?? row[measure.key]?.formatted ?? "N/A";
          return acc;
        }, {}),
      }));

      const container = document.createElement("div");
      container.style.display = "flex";
      container.style.flexDirection = "column";

      const table = document.createElement("table");
      table.innerHTML = `
        <thead>
          <tr>
            ${dimensions.map((dim) => `<th>${this._escapeHtml(dim.description || dim.id)}</th>`).join("")}
            ${measures.map((measure) => `<th>${this._escapeHtml(measure.description || measure.id)}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${tableData
            .map(
              (row) =>
                `<tr data-row-index="${row.index}">
                  ${dimensions.map((dim) => `<td>${this._escapeHtml(row[dim.id])}</td>`).join("")}
                  ${measures
                    .map(
                      (measure) =>
                        `<td class="editable" data-measure-id="${this._escapeHtml(measure.id)}" data-measure-key="${this._escapeHtml(measure.key)}">${this._escapeHtml(row[measure.id])}</td>`,
                    )
                    .join("")}
                </tr>`,
            )
            .join("")}
        </tbody>
      `;
      container.appendChild(table);

      this._root.innerHTML = "";
      this._root.appendChild(container);

      this.attachRowSelectionListeners();
      this.makeMeasureCellsEditable();
    }

    attachRowSelectionListeners() {
      const rows = this._root.querySelectorAll("tbody tr");
      rows.forEach((row) => {
        row.addEventListener("click", (event) => {
          const rowIndex = event.currentTarget.getAttribute("data-row-index");
          if (this._selectedRows.has(rowIndex)) {
            this._selectedRows.delete(rowIndex);
            event.currentTarget.classList.remove("selected");
          } else {
            this._selectedRows.add(rowIndex);
            event.currentTarget.classList.add("selected");
          }
          console.log(`Selected rows:`, Array.from(this._selectedRows));

          this.fireOnSelectEvent();
        });
      });
    }

    fireOnSelectEvent() {
      const event = new CustomEvent("onSelect", {
        detail: {
          selectedRows: Array.from(this._selectedRows),
        },
      });
      this.dispatchEvent(event);
    }

    fireOnResultChange(detail) {
      const event = new CustomEvent("onResultChange", {
        detail,
      });
      this.dispatchEvent(event);
      this.dispatchEvent(new CustomEvent("onResultChanged", { detail }));
      console.log("onResultChange triggered:", detail);
    }

    makeMeasureCellsEditable() {
      const rows = this._root.querySelectorAll("tbody tr");
      rows.forEach((row) => {
        const rowIndex = row.getAttribute("data-row-index");
        const cells = row.querySelectorAll("td.editable");

        cells.forEach((cell) => {
          const measureId = cell.getAttribute("data-measure-id");
          const measureKey = cell.getAttribute("data-measure-key") || measureId;
          cell.contentEditable = "false";

          cell.addEventListener("dblclick", () => {
            if (!this.planningEnabled) return;
            cell.contentEditable = "true";
            cell.focus();
          });

          cell.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              cell.blur();
            }
            if (event.key === "Escape") {
              cell.contentEditable = "false";
              this.render();
            }
          });

          cell.addEventListener("blur", async () => {
            const newValue = parseFloat((cell.textContent || "").trim().replace(/,/g, ""));
            cell.contentEditable = "false";

            if (!isNaN(newValue)) {
              console.log(`Row ${rowIndex}, Measure ${measureId} updated to: ${newValue}`);
              cell.setAttribute("data-measure-value", String(newValue));

              const dataSource = this._getDataSource();
              if (dataSource?.data?.[rowIndex] && measureKey) {
                dataSource.data[rowIndex][measureKey] = { raw: newValue, formatted: String(newValue) };
              }

              const writeback = await this._writeBackValue(rowIndex, measureId, newValue, cell);

              this.fireOnResultChange({
                rowIndex,
                measureId,
                newValue,
                writeback,
              });
            } else {
              console.error("Invalid input, resetting value.");
              const measureKey = this.getMeasures().find((measure) => measure.id === measureId)?.key;
              const dataSource = this._getDataSource();
              cell.textContent = dataSource?.data?.[rowIndex]?.[measureKey]?.raw ?? "N/A";
            }
          });
        });
      });
    }

    async fetchDimensionMembers(dimensionId, returnType = "id") {
      const dataSource = this._getDataSource();
      if (!dataSource || !dataSource.data) {
        console.error("Data source not available or data is missing.");
        return [];
      }

      try {
        const membersSet = new Set();
        dataSource.data.forEach((row) => {
          const value = row[dimensionId]?.[returnType] || null;
          if (value) {
            membersSet.add(value);
          }
        });

        const members = Array.from(membersSet).map((member) => ({
          id: member,
          label: member,
        }));

        console.log(`Fetched members for dimension '${dimensionId}' (${returnType}):`, members);
        return members;
      } catch (error) {
        console.error("Error fetching dimension members:", error);
        return [];
      }
    }

    async addEmptyRow() {
      const table = this._root.querySelector("table tbody");
      if (!table) {
        console.error("Table body not found.");
        return;
      }

      const dimensions = this.getDimensions();
      const measures = this.getMeasures();
      const newRowIndex = table.rows.length;

      const newRow = document.createElement("tr");
      newRow.setAttribute("data-row-index", newRowIndex);
      newRow.classList.add("selected");

      for (const dim of dimensions) {
        const cell = document.createElement("td");
        cell.setAttribute("data-dimension-id", dim.id);
        cell.setAttribute("data-dimension-key", dim.key);

        const dropdown = document.createElement("select");

        const members = await this.fetchDimensionMembers(dim.key, "id");
        members.forEach((member) => {
          const option = document.createElement("option");
          option.value = member.id;
          option.textContent = member.label;
          dropdown.appendChild(option);
        });

        cell.setAttribute("data-dimension-value", dropdown.value || "");

        dropdown.addEventListener("change", (event) => {
          console.log(`Dimension '${dim.id}' selected as ID: ${event.target.value}`);
          cell.setAttribute("data-dimension-value", event.target.value);
        });

        cell.appendChild(dropdown);
        newRow.appendChild(cell);
      }

      measures.forEach((measure) => {
        const cell = document.createElement("td");
        cell.classList.add("editable");
        cell.setAttribute("data-measure-id", measure.id);
        cell.setAttribute("data-measure-key", measure.key);

        cell.contentEditable = this.planningEnabled ? "true" : "false";
        cell.addEventListener("keydown", (event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            cell.blur();
          }
        });
        cell.addEventListener("blur", async (event) => {
          const value = parseFloat((event.target.textContent || "").trim().replace(/,/g, ""));
          console.log(`Measure '${measure.id}' for new row updated to: ${value}`);
          cell.setAttribute("data-measure-value", isNaN(value) ? "" : String(value));

          if (!isNaN(value)) {
            const writeback = await this._writeBackValue(newRowIndex, measure.id, value, cell);
            this.fireOnResultChange({
              rowIndex: String(newRowIndex),
              measureId: measure.id,
              newValue: value,
              writeback,
            });
          }
        });

        newRow.appendChild(cell);
      });

      newRow.addEventListener("click", () => {
        table.querySelectorAll("tr").forEach((row) => row.classList.remove("selected"));
        newRow.classList.add("selected");
        this._selectedRows.add(String(newRowIndex));
        console.log(`New row selected: ${newRowIndex}`);
      });

      table.appendChild(newRow);
      this._selectedRows.add(String(newRowIndex));
      console.log(`New row added: ${newRowIndex}`);
    }

    updateMeasureValue(rowIndex, measureId, newValue) {
      const dataSource = this._getDataSource();
      if (!dataSource || !dataSource.data[rowIndex]) {
        console.error("Row data is not available for updating.");
        return;
      }

      dataSource.data[rowIndex][measureId] = { raw: newValue };
    }

    getSelections() {
      try {
        const dataSource = this._getDataSource();
        if (!dataSource || !dataSource.data) {
          console.error("Data source is not bound or data is unavailable.");
          return [];
        }

        const dimensions = this.getDimensions();
        const measures = this.getMeasures();

        const selectedData = Array.from(this._selectedRows).map((rowIndex) => {
          const row = dataSource.data[rowIndex];
          if (!row) return null;

          const rowData = {};

          dimensions.forEach((dim) => {
            rowData[dim.id] = {
              id: row[dim.key]?.id || null,
              label: row[dim.key]?.label || "N/A",
            };
          });

          measures.forEach((measure) => {
            rowData[measure.id] = row[measure.key]?.raw || row[measure.key]?.value || null;
          });

          return rowData;
        });

        console.log("Selected data:", selectedData);
        return selectedData;
      } catch (error) {
        console.error("Error in getSelections:", error);
        return [];
      }
    }

    getDimensions() {
      try {
        const dataSource = this._getDataSource();
        if (!dataSource || !dataSource.metadata) {
          console.error("Data source or metadata is unavailable.");
          return [];
        }

        const feeds = dataSource.metadata.feeds || {};
        const dimensionKeys = this._readFeedValues(feeds.dimensions || feeds.dimension);

        const dimensions = dimensionKeys.map((key) => {
          const dimension = dataSource.metadata.dimensions[key];
          if (!dimension) {
            console.warn(`Dimension key '${key}' not found in metadata.`);
            return { id: key, description: "Undefined Dimension", key };
          }

          return {
            id: dimension.id || key,
            description: dimension.description || dimension.id || key,
            key,
          };
        });

        console.log("Resolved Dimensions:", dimensions);
        return dimensions;
      } catch (error) {
        console.error("Error in getDimensions:", error);
        return [];
      }
    }

    getMeasures() {
      const dataSource = this._getDataSource();
      if (!dataSource || !dataSource.metadata) {
        console.error("Data source metadata is unavailable.");
        return [];
      }

      const feeds = dataSource.metadata.feeds || {};
      const measuresKeys = this._readFeedValues(feeds.measures || feeds.measure || feeds.mainStructureMembers);

      const measures = measuresKeys.map((key) => {
        const measure = dataSource.metadata.mainStructureMembers[key];
        if (!measure) {
          console.warn(`Measure with key '${key}' not found in metadata.`);
          return { id: key, key, description: key };
        }

        return {
          id: measure.id || key,
          key,
          description: measure.description || measure.label || measure.id || key,
        };
      });

      console.log("Resolved Measures:", measures);
      return measures;
    }

    getSelectedRow() {
      try {
        const selectedRowIndices = Array.from(this._selectedRows);
        console.log("Selected rows:", selectedRowIndices);
        return selectedRowIndices;
      } catch (error) {
        console.error("Error in getSelectedRow:", error);
        return [];
      }
    }

    getDimensionSelected(dimensionId) {
      try {
        const table = this._root.querySelector("table tbody");
        if (!table) {
          console.error("Table body not found.");
          return [];
        }

        const dimensions = this.getDimensions();
        const dataSource = this._getDataSource();
        console.log("Selected Rows:", Array.from(this._selectedRows));
        console.log("Data Source Structure:", dataSource?.data);

        const dimensionKey = dimensions.find((dim) => dim.id === dimensionId)?.key;
        if (!dimensionKey) {
          console.warn(`Dimension ID '${dimensionId}' not found in resolved dimensions.`);
          return [];
        }

        const dimensionValues = Array.from(this._selectedRows).map((rowIndex) => {
          const row = table.querySelector(`tr[data-row-index="${rowIndex}"]`);
          if (!row) {
            console.warn(`Row at index '${rowIndex}' not found in DOM.`);
            return null;
          }

          const dynamicCell = row.querySelector(`td[data-dimension-id="${dimensionId}"]`);
          if (dynamicCell) {
            const value = dynamicCell.getAttribute("data-dimension-value") || null;
            console.log(`Dimension '${dimensionId}' for new row '${rowIndex}' has value: ${value}`);
            return value;
          }

          if (dataSource?.data?.[rowIndex]) {
            const dataRow = dataSource.data[rowIndex];
            console.log(`Data Row for '${rowIndex}':`, dataRow);

            const value = dataRow[dimensionKey]?.id || dataRow[dimensionKey]?.label || null;
            console.log(`Dimension '${dimensionId}' for data source row '${rowIndex}' has value: ${value}`);
            return value;
          }

          console.warn(`Dimension '${dimensionId}' not found for row '${rowIndex}'.`);
          return null;
        });

        const filteredValues = dimensionValues.filter((value) => value !== null);
        console.log(`Filtered dimension values for '${dimensionId}':`, filteredValues);
        return filteredValues;
      } catch (error) {
        console.error("Error in getDimensionSelected:", error);
        return [];
      }
    }

    getMeasureValues(measureId) {
      try {
        const table = this._root.querySelector("table tbody");
        if (!table) {
          console.error("Table body not found.");
          return [];
        }

        const measures = this.getMeasures();
        const selectedRows = Array.from(this._selectedRows);
        const dataSource = this._getDataSource();
        console.log("Selected Rows:", selectedRows);
        console.log("Data Source Structure:", dataSource?.data);

        const measureKey = measures.find((measure) => measure.id === measureId)?.key;
        if (!measureKey) {
          console.warn(`Measure ID '${measureId}' not found in resolved measures.`);
          return [];
        }

        const measureValues = selectedRows.map((rowIndex) => {
          const row = table.querySelector(`tr[data-row-index="${rowIndex}"]`);
          if (!row) {
            console.warn(`Row at index '${rowIndex}' not found in DOM.`);
            return null;
          }

          const cell = row.querySelector(`td[data-measure-id="${measureId}"]`);
          if (cell) {
            const domValue = parseFloat((cell.textContent || "").trim()) || null;
            if (!isNaN(domValue)) {
              console.log(`Measure '${measureId}' for row '${rowIndex}' (DOM) has value: ${domValue}`);
              return domValue;
            }
          }

          if (dataSource?.data?.[rowIndex]) {
            const dataRow = dataSource.data[rowIndex];
            console.log(`Data Row for '${rowIndex}':`, dataRow);

            const value = dataRow[measureKey]?.raw ?? dataRow[measureKey]?.formatted ?? null;
            if (value !== null) {
              const parsedValue = parseFloat(value) || value;
              console.log(`Measure '${measureId}' for data source row '${rowIndex}' has value: ${parsedValue}`);
              return parsedValue;
            }
          }

          console.warn(`Measure '${measureId}' not found for row '${rowIndex}'.`);
          return null;
        });

        const filteredValues = measureValues.filter((value) => value !== null);
        console.log(`Filtered measure values for '${measureId}':`, filteredValues);
        return filteredValues;
      } catch (error) {
        console.error("Error in getMeasureValues:", error);
        return [];
      }
    }

    async submitPlanningData() {
      const cells = Array.from(this._root.querySelectorAll("td.editable[data-measure-value]"));
      let submitted = 0;
      for (const cell of cells) {
        const row = cell.closest("tr");
        const rowIndex = row?.getAttribute("data-row-index");
        const measureId = cell.getAttribute("data-measure-id");
        const value = parseFloat(cell.getAttribute("data-measure-value"));
        if (rowIndex != null && measureId && !isNaN(value)) {
          const ok = await this._writeBackValue(rowIndex, measureId, value, cell);
          if (ok) submitted += 1;
        }
      }
      return submitted > 0;
    }

    _getDataSource() {
      if (this._myDataSource?.getDataSource) {
        try {
          return this._myDataSource.getDataSource();
        } catch (error) {
          console.warn("Unable to read data source from binding:", error);
        }
      }

      try {
        const binding = this._getDataBinding();
        const dataSource = binding?.getDataSource?.();
        if (dataSource) return dataSource;
      } catch (error) {
        console.warn("Unable to read widget data binding:", error);
      }

      return this._myDataSource;
    }

    _getDataBinding() {
      try {
        return this.dataBindings?.getDataBinding?.("myDataSource") || null;
      } catch (error) {
        console.warn("Unable to read data binding:", error);
        return null;
      }
    }

    _getPlanning() {
      if (this._myDataSource?.getPlanning) return this._myDataSource.getPlanning();

      const binding = this._getDataBinding();
      if (binding?.getPlanning) return binding.getPlanning();

      try {
        const bindingDataSource = binding?.getDataSource?.();
        if (bindingDataSource?.getPlanning) return bindingDataSource.getPlanning();
      } catch (error) {
        console.warn("Unable to read planning API from binding data source:", error);
      }

      const dataSource = this._getDataSource();
      if (dataSource?.getPlanning) return dataSource.getPlanning();

      return null;
    }

    _buildPlanningSelection(rowIndex, measureId) {
      const dimensions = this.getDimensions();
      const measures = this.getMeasures();
      const measure = measures.find((item) => item.id === measureId || item.key === measureId);
      const selection = {
        "@MeasureDimension": measure?.key || measure?.id || measureId,
      };

      const tableRow = this._root.querySelector(`tr[data-row-index="${rowIndex}"]`);
      const dataSource = this._getDataSource();
      dimensions.forEach((dim) => {
        const dynamicCell = this._findDimensionCell(tableRow, dim);
        const dynamicValue = dynamicCell?.getAttribute("data-dimension-value");
        const sourceCell = dataSource?.data?.[rowIndex]?.[dim.key] || dataSource?.data?.[rowIndex]?.[dim.id];
        const sourceValue =
          sourceCell?.id ||
          sourceCell?.memberId ||
          sourceCell?.key ||
          (typeof sourceCell === "string" ? sourceCell : sourceCell?.label || sourceCell?.description);
        const value = dynamicValue || sourceValue;
        if (value) selection[dim.key || dim.id] = String(value);
      });

      return selection;
    }

    _findDimensionCell(row, dim) {
      if (!row) return null;
      return Array.from(row.querySelectorAll("td[data-dimension-id], td[data-dimension-key]")).find(
        (cell) => cell.getAttribute("data-dimension-key") === dim.key || cell.getAttribute("data-dimension-id") === dim.id,
      );
    }

    _readFeedValues(feed) {
      if (Array.isArray(feed)) return feed;
      if (Array.isArray(feed?.values)) return feed.values;
      return [];
    }

    async _writeBackValue(rowIndex, measureId, value, cell) {
      if (!this.planningEnabled) return false;

      const planning = this._getPlanning();
      if (!planning || !planning.setUserInput || !planning.submitData) {
        const message = "Planning API is not available. Check that the bound model is planning-enabled.";
        console.error(message);
        this.dispatchEvent(new CustomEvent("onSubmitError", { detail: { message, rowIndex, measureId, value } }));
        return false;
      }

      const selection = this._buildPlanningSelection(rowIndex, measureId);
      const dimensionCount = this.getDimensions().length;
      const selectedDimensions = Object.keys(selection).filter((key) => key !== "@MeasureDimension").length;
      if (selectedDimensions < dimensionCount) {
        const message = "Please select all dimension members before writing back.";
        console.error(message, selection);
        if (cell) cell.classList.add("writeback-error");
        this.dispatchEvent(new CustomEvent("onSubmitError", { detail: { message, rowIndex, measureId, value, selection } }));
        return false;
      }

      try {
        if (cell) cell.classList.remove("writeback-error");
        const inputResult = await Promise.resolve(planning.setUserInput(selection, String(value)));
        if (inputResult === false) {
          throw new Error("SAC rejected setUserInput for this cell selection.");
        }
        if (this.autoSubmit !== false) {
          const submitResult = await Promise.resolve(planning.submitData());
          if (submitResult === false) {
            throw new Error("SAC rejected submitData for this planning change.");
          }
        }
        this.dispatchEvent(new CustomEvent("onDataSubmitted", { detail: { rowIndex, measureId, value, selection } }));
        console.log("Planning writeback submitted:", { rowIndex, measureId, value, selection });
        return true;
      } catch (error) {
        const message = String((error && error.message) || error);
        console.error("Planning writeback failed:", error);
        if (cell) cell.classList.add("writeback-error");
        this.dispatchEvent(new CustomEvent("onSubmitError", { detail: { message, rowIndex, measureId, value, selection } }));
        return false;
      }
    }

    _escapeHtml(value) {
      return String(value == null ? "" : value).replace(/[&<>"]/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
      })[char]);
    }
  }

  if (!customElements.get("com-sap-custom-tablewidget")) {
    customElements.define("com-sap-custom-tablewidget", CustomTableWidget);
  }
})();
