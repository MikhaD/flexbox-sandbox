class Sandbox extends HTMLElement {
	static DEFUALT_BOX_COUNT = 5;
	static DEFAULTS = {
		"flex-direction": "row",
		"justify-content": "normal",
		"align-items": "normal",
		"flex-wrap": "nowrap",
		"align-content": "normal",
		"gap": "0",
		"boxes": "5"
	};
	
	constructor() {
		super();
		/** The number of boxes there were prior to the latest change in the number of boxes */
		this.prev = Sandbox.DEFAULTS.boxes;
		this.items = [];
		this.selectedItems = new Map();
		this.shiftStartItem = null;
		this.controls = document.querySelectorAll(`[for='${this.id}']`);
		this.itemControlSet = document.querySelector("#item-controls");
		this.itemControls = this.itemControlSet.querySelectorAll(`[for='${this.id}-item']`);
		this.itemControlValues = {};
		this.selectHint = document.querySelector("#select-hint");

		this.addEventListener("click", e => {
			if (e.target.nodeName === "SAND-BOX") {
				this.deselectAllItems();
			}
		});
		for (const control of this.controls) {
			control.reset = function() {
				this.value = Sandbox.DEFAULTS[this.name];
			};
			if (control.nodeName === "INPUT") {
				control.prev = Sandbox.DEFAULTS[control.name];
			}
			control.addEventListener("change", e => {
				const val = parseInt(e.currentTarget.value);
				if (e.currentTarget.nodeName === "INPUT" && (isNaN(val) || val < parseInt(e.currentTarget.min) || val > parseInt(e.currentTarget.max))) {
					e.currentTarget.value = e.currentTarget.prev;
				} else {
					this.style[e.currentTarget.name] = e.currentTarget.value + (isNaN(e.currentTarget.value) ? "": "rem");
					e.currentTarget.prev = val;
				}
			});
		}
		for (const control of this.itemControls) {
			control.addEventListener("change", e => {
				const val = parseInt(e.currentTarget.value);
				if (e.currentTarget.nodeName === "INPUT" && (isNaN(val) || val < parseInt(e.currentTarget.min) || val > parseInt(e.currentTarget.max))) {
					e.currentTarget.value = e.currentTarget.prev;
				} else {
					for (const item of this.selectedItems.values()) {
						this.itemControlValues[e.currentTarget.name] = 
							item.setStyle(e.currentTarget.name, e.currentTarget.value);
					}
					e.currentTarget.prev = val;
				}
			});
		}
	}
	/**
	 * Add an item to the sandbox
	 */
	addItem() {
		const item = new Item(this);
		item.classList.add(`${this.id}-item`);
		this.items.push(item);
		this.appendChild(item);
	}
	/**
	 * Remove an item from the sandbox
	 */
	removeItem() {
		const item = this.items.pop();
		this.deselectItem(item);
		if (this.shiftStartItem === item) {
			this.shiftStartItem = null;
		}
		item.remove();
	}
	/**
	 * Remove all items from the sandbox
	 */
	clear() {
		this.deselectAllItems();
		this.itemControlValues = {};
		Item.hue = 0;
		Item.instances = 0;
		this.innerHTML = "";
		this.items = [];
	}
	/**
	 * Delete the contents of the sandbox and fill it with num colored boxes
	 * @param {Number} num - The number of boxes to fill the sandbox with
	 */
	rePopulate(num) {
		this.clear();
		for (let i = 0; i < num; ++i) {
			this.addItem();
		}
	}
	/**
	 * Select an item in the sandbox and update the selected item controls
	 * @param {Item} item - the Item object to select
	 */
	selectItem(item) {
		item.classList.add("selected");
		this.selectedItems.set(item.n, item);

		this.mergeItemControlValues(item);
		this.setItemControls(this.itemControlValues);
		this.toggleItemControls(true);
	}
	/**
	 * Deselect an item in the sandbox and optionally update the values of the item controls
	 * @param {Item} item - the Item object to deselect
	 * @param {Boolean} updateControlValues - Whether or not to update item control values (Default: true)
	 */
	deselectItem(item, updateControlValues) {
		item.classList.remove("selected");
		this.selectedItems.delete(item.n);

		if (this.selectedItems.size === 0) {
			this.toggleItemControls(false);
		} else if (updateControlValues !== false) {
			const selectedItems = this.selectedItems.values();
			//! WHAT IF THERE ARE NO SELECTED ITEMS (Don't think it is possible to call when there isn't an item selected)
			this.itemControlValues = {...Item.DEFAULTS};
			const baseItem = selectedItems.next().value;
			for (const style of baseItem.style) {
				this.itemControlValues[style] = baseItem.style[style];
			}

			for (const item of selectedItems) {
				this.mergeItemControlValues(item);
			}
			this.setItemControls(this.itemControlValues);
		}
	}
	/**
	 * Select all items in the sandbox
	 */
	selectAllItems() {
		for (const item of this.items) {
			this.selectItem(item);
		}
	}
	/**
	 * Reset all selected items in the sandbox
	 */
	deselectAllItems() {
		for (const item of this.selectedItems.values()) {
			this.deselectItem(item, false);
		}
		this.shiftStartItem = null;
	}
	/**
	 * Toggle the visibility of the item controls in the controls menu
	 * @param {Boolean} on - Whether to toggle them on or off (default: off)
	 */
	toggleItemControls(on) {
		if (on) {
			this.selectHint.classList.add("hidden");
			this.itemControlSet.classList.remove("hidden");
		} else {
			this.selectHint.classList.remove("hidden");
			this.itemControlSet.classList.add("hidden");
		}
	}

	/**
	 * Merge the styles of a given item with the existing itemControlValues, replacing conflicts with null.
	 * itemControlValues starts as the defaults, and the first item replaces the defaults with the relevant 
	 * properties it contains.
	 * @param {Item} item The item to merge the properties of
	 */
	mergeItemControlValues(item) {
		let first = false;
		if (this.selectedItems.size === 1) {
			this.itemControlValues = {...Item.DEFAULTS};
			first = true;
		}
		for (const style of item.style) {
			if (this.itemControlValues[style] !== item.style[style] && Item.DEFAULTS[style] !== undefined) {
				this.itemControlValues[style] = (first) ? item.style[style] : null;
			}
		}
	}

	/**
	 * Set the item control input values to the relevant values in the given values object.
	 * @param {Object} values An object containing key value pairs of item control names and values
	 */
	setItemControls(values) {
		for (const control of this.itemControls) {
			let val = values[control.name];
			if (val === null) {
				control.value = "";
			} else {
				if (val.endsWith(Item.SIZE_UNITS)) {
					val = val.slice(0, Item.SIZE_UNITS.length*-1)/Item.SIZE_MULTIPLIER;
				}
				control.value = val;
				control.prev = val;
			}
		}
	}
}

window.customElements.define("sand-box", Sandbox);