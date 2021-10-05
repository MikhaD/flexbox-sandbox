class Sandbox extends HTMLElement {
	static DEFUALT_BOX_COUNT = 5;
	
	constructor() {
		super();
		/** The number of boxes there were prior to the latest change in the number of boxes */
		this.prev = Sandbox.DEFUALT_BOX_COUNT;
		this.items = [];
		this.selectedItems = {};
		this.shiftStartItem = null;
		this.controls;
	}
	/**
	 * Add an item to the sandbox
	 */
	addItem() {
		let item = new Item(widthSelect.value, heightSelect.value);
		this.items.push(item);
		this.appendChild(item);
	}
	/**
	 * Remove an item from the sandbox
	 */
	removeItem() {
		let item = this.items.pop();
		delete this.selectedItems[item.n];
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
		this.items = [];
		this.selectedItems = {};
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
	 * Set the given flex property of the sandbox to value
	 */
	setFlexProperty(property, value) {
		this.style[property] = value;
	}
	/**
	 * 
	 * @param {"width" | "height"} dimension - either width or height 
	 * @param {"unset" | "random" | Number} value - unset, random or a number
	 */
	setItemsDimensions(dimension, value) {
		for (const item of this.items) {
			item.setDimension(dimension, value);
		}
	}
	/**
	 * Select an item in the sandbox
	 * @param {Item} item - the Item object to select
	 */
	selectItem(item) {
		item.classList.add("selected");
		sandbox.selectedItems[item.n] = item;
	}
	/**
	 * Deselect an item in the sandbox
	 * @param {Item} item - the Item object to deselect
	 */
	deselectItem(item) {
		item.classList.remove("selected");
		delete this.selectedItems[item.n];
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
}

window.customElements.define("sand-box", Sandbox);