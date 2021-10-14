class Sandbox extends HTMLElement {
	static DEFUALT_BOX_COUNT = 5;
	static DEFAULTS = {
		"flex-direction": "row",
		"justify-content": "normal",
		"align-items": "normal",
		"flex-wrap": "nowrap",
		"align-content": "normal",
		"gap": "0rem"
	};
	
	constructor() {
		super();
		/** The number of boxes there were prior to the latest change in the number of boxes */
		this.prev = Sandbox.DEFUALT_BOX_COUNT;
		this.items = [];
		this.selectedItems = {};
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
			if (control.nodeName === "INPUT") {
				control.prev = control.getAttribute("initial");
			}
			control.addEventListener("change", e => {
				const val = parseInt(e.currentTarget.value);
				if (e.currentTarget.nodeName === "INPUT" && (val < e.currentTarget.min || val > e.currentTarget.max || isNaN(val))) {
					e.currentTarget.value = e.currentTarget.prev;
				} else {
					this.style[e.currentTarget.name] = e.currentTarget.value + (isNaN(e.currentTarget.value) ? "": "rem");
					e.currentTarget.prev = val;
				}
			});
		}
		for (const control of this.itemControls) {
			if (control.nodeName === "INPUT") {
				control.prev = control.getAttribute("initial");
			}
			control.addEventListener("change", e => {
				const val = parseInt(e.currentTarget.value);
				if (e.currentTarget.nodeName === "INPUT" && (val < e.currentTarget.min || val > e.currentTarget.max || isNaN(val))) {
					e.currentTarget.value = e.currentTarget.prev;
				} else {
					for (const n in this.selectedItems) {
						this.selectedItems[n].setStyle(e.currentTarget.name, e.currentTarget.value);
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
		// delete this.selectedItems[item.n];
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
		this.selectedItems[item.n] = item;

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
		delete this.selectedItems[item.n];
		if (Object.keys(this.selectedItems).length === 0) {
			this.toggleItemControls(false);
		} else if (updateControlValues !== false) {
			this.itemControlValues = {};
			for (const key in this.selectedItems) {
				this.mergeItemControlValues(this.selectedItems[key]);
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
		for (const key in this.selectedItems) {
			this.deselectItem(this.selectedItems[key], false);
		}
		this.itemControlValues = {};
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

	mergeItemControlValues(item) {
		for (const style of item.style) {
			if (Item.DEFAULTS[style] !== undefined) {
				if (this.itemControlValues[style] === undefined) {
					this.itemControlValues[style] = item.style[style];
				} else if (this.itemControlValues[style] !== item.style[style]) {
					console.log("Should be getting this message");
					this.itemControlValues[style] = null;
				}
			}
		}
	}

	setItemControls(values) {
		for (const control of this.itemControls) {
			let val = values[control.name];
			if (val === undefined) {
				control.value = Item.DEFAULTS[control.name];
			} else if (val === null) {
				control.value = "";
			} else {
				if (val.endsWith(Item.SIZE_UNITS)) {
					val = val.slice(0, Item.SIZE_UNITS.length*-1)/Item.SIZE_MULTIPLIER;
				}
				control.value = val;
			}
		}
	}
}

window.customElements.define("sand-box", Sandbox);