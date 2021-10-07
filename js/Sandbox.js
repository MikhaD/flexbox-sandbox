class Sandbox extends HTMLElement {
	static DEFUALT_BOX_COUNT = 5;
	
	constructor() {
		super();
		/** The number of boxes there were prior to the latest change in the number of boxes */
		this.prev = Sandbox.DEFUALT_BOX_COUNT;
		this.items = [];
		this.selectedItems = {};
		this.shiftStartItem = null;
		this.controls = document.querySelectorAll(`select[for='${this.id}']`);
		this.itemControlSet = document.querySelector("#item-controls");
		this.itemControls = this.itemControlSet.querySelectorAll(`[for='${this.id}-item']`);
		this.selectHint = document.querySelector("#select-hint");

		this.addEventListener("click", e => {
			if (e.target.nodeName === "SAND-BOX") {
				this.deselectAllItems();
			}
		});
		for (const select of this.controls) {
			select.addEventListener("change", e => {
				this.style[e.currentTarget.name] = e.currentTarget.value;
			});
		}
		for (const control of this.itemControls) {
			control.addEventListener("change", e => {
				for (const n in this.selectedItems) {
					this.selectedItems[n].setStyle(e.currentTarget.name, e.currentTarget.value);
				}
			});
		}
	}
	/**
	 * Add an item to the sandbox
	 */
	addItem() {
		const item = new Item(1, 1);
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
		Item.hue = 0;
		Item.instances = 0;
		this.innerHTML = "";
		this.deselectAllItems();
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
	 * Select an item in the sandbox
	 * @param {Item} item - the Item object to select
	 */
	selectItem(item) {
		item.classList.add("selected");
		sandbox.selectedItems[item.n] = item;
		this.toggleItemControls(true);
	}
	/**
	 * Deselect an item in the sandbox
	 * @param {Item} item - the Item object to deselect
	 */
	deselectItem(item) {
		item.classList.remove("selected");
		delete this.selectedItems[item.n];
		if (Object.keys(this.selectedItems).length === 0) {
			this.toggleItemControls(false);
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
			this.deselectItem(this.selectedItems[key]);
		}
		this.shiftStartItem = null;
	}
	/**
	 * Toggle the visibility of the item controls in the controls menu
	 * @param {Boolean} on - Whether to toggle them on or off (default: off)
	 */
	toggleItemControls(on) {
		if (on) {
			//todo Put the item values for the selected item in the item controls when that item is selected, or blank if multiple items are selected that have different properties for that value
			this.selectHint.classList.add("hidden");
			this.itemControlSet.classList.remove("hidden");
		} else {
			this.selectHint.classList.remove("hidden");
			this.itemControlSet.classList.add("hidden");
		}
	}
}

window.customElements.define("sand-box", Sandbox);