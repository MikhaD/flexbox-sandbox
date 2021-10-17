class Item extends HTMLElement {
	static DEFAULT_SIZE = 1;
	static SIZE_MULTIPLIER = 10;
	static SIZE_UNITS = "%";
	static DEFAULTS = {
		"width": `${Item.DEFAULT_SIZE * Item.SIZE_MULTIPLIER}${Item.SIZE_UNITS}`,
		"height": `${Item.DEFAULT_SIZE * Item.SIZE_MULTIPLIER}${Item.SIZE_UNITS}`,
		"order": "0",
		"flex-grow": "0",
		"flex-shrink": "1",
		"flex-basis": "auto",
		"align-self": "auto"
	};
	static MAX_SIZE = 5;
	static HUE_INC = 30;
	static hue = 0;
	static instances = 0;

	/**
	 * Create a new Item in a given sandbox
	 * @param {Sandbox} sandbox - The items parent Sandbox
	 */
	constructor(sandbox) {
		super();
		this.sandbox = sandbox;
		this.style["background-color"] = `hsl(${Item.hue}, 100%, 50%)`;
		Item.hue += Item.HUE_INC;
		this.addEventListener("click", itemClick);
		this.addEventListener("contextmenu", itemRightClick);
		this.setDimension("width", Item.DEFAULT_SIZE);
		this.setDimension("height", Item.DEFAULT_SIZE);
		this.n = ++Item.instances;
	}

	/**
	 * Set the given style to the given value, with units if necessary, and return the value.
	 * @param {string} style - The style to set
	 * @param {string} value - The value to set the style to
	 * @returns the final value the style was set to.
	 */
	setStyle(style, value) {
		if (style === "width" || style === "height") {
			return this.setDimension(style, value);
		}
		this.style[style] = value;
		return value;
	}

	/**
	 * Set the items width or height to the given value * the size multiplier in the relevant units, or to random or unset
	 * @param {"width" | "height"} dimension - width or height
	 * @param {string} value - The size value
	 * @returns the final dimension value
	 */
	setDimension(dimension, value) {
		switch (value) {
			case "unset":
				this.style[dimension] = value;
				break;
			case "random":
				this.style[dimension] = Math.ceil(Math.random()*Item.MAX_SIZE) * Item.SIZE_MULTIPLIER + Item.SIZE_UNITS;
				break
			default:
				this.style[dimension] = value * Item.SIZE_MULTIPLIER + Item.SIZE_UNITS;
		}
		return this.style[dimension];
	}

	/** Remove item */
	remove() {
		--Item.instances;
		Item.hue -= Item.HUE_INC;
		super.remove();
	}
}

/**
 * The function that runs when a flex-item is clicked
 * @param {Event} e 
 */
 function itemClick(e) {
	 const sandbox = e.currentTarget.sandbox;
	if (e.shiftKey) {
		const temp = sandbox.shiftStartItem;
		sandbox.deselectAllItems();
		sandbox.shiftStartItem = temp;
		if (sandbox.shiftStartItem === null) {
			sandbox.shiftStartItem = sandbox.items[0];
		}
		const inc = (sandbox.shiftStartItem.n < e.currentTarget.n) ? 1 : -1;

		for (let i = sandbox.shiftStartItem.n; i - e.currentTarget.n !== 0; i += inc) {
			sandbox.selectItem(sandbox.items[i-1]);
		}
	} else if (e.ctrlKey) {
		if (e.currentTarget.classList.contains("selected")) {
			sandbox.deselectItem(e.currentTarget);
			return;
		} else {
			sandbox.shiftStartItem = e.currentTarget;
		}
	} else {
		sandbox.deselectAllItems();
		sandbox.shiftStartItem = e.currentTarget;
	}
	sandbox.selectItem(e.currentTarget);
}

/**
 * The function that runs when a flex-item is right clicked
 * @param {Event} e 
 */
function itemRightClick(e) {
	e.preventDefault();
	context.innerHTML = "";
	for (const style of this.style) {
		if (Item.DEFAULTS[style]) {
			// console.log(style, this.style[style]);
			const el = new CheckBox(this, style, this.style[style]);
			el.setAttribute("checked", true);
			context.appendChild(el);
		}
	}
	let left = e.clientX;
	let top = e.clientY;
	context.style = "";
	context.classList.remove("invisible");
	if (left > (window.innerWidth / 2)) {
		left -= context.getBoundingClientRect().width;
	}
	if (top > (window.innerHeight / 2)) {
		top -= context.getBoundingClientRect().height;
	}
	context.style["left"] = `${left}px`;
	context.style["top"] = `${top}px`;
}

window.customElements.define("flex-item", Item);