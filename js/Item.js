class Item extends HTMLElement {
	static MAX_SIZE = 5;
	static HUE_INC = 30;
	static hue = 0;
	static instances = 0;

	constructor(sandbox) {
		super();
		this.sandbox = sandbox;
		this.style["background-color"] = `hsl(${Item.hue}, 100%, 50%)`;
		Item.hue += Item.HUE_INC;
		this.addEventListener("click", itemClick);
		this.addEventListener("contextmenu", itemRightClick);
		this.setDimension("width", 1);
		this.setDimension("height", 1);
		this.n = ++Item.instances;
	}

	setStyle(style, value) {
		if (style === "width" || style === "height") {
			this.setDimension(style, value);
		} else {
			this.style[style] = value;
		}
	}

	setDimension(dimension, value) {
		switch (value) {
			case "unset":
				this.style[dimension] = value;
				break;
			case "random":
				this.style[dimension] = Math.ceil(Math.random()*Item.MAX_SIZE) * 5 + "vmax";
				break
			default:
				this.style[dimension] = value * 5 + "vmax";
		}
	}

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
		console.log(style, this.style[style]);
		const el = document.createElement("check-box");
		el.textContent = `${style}:`;
		el.setAttribute("checked", true);
		context.appendChild(el);
	}
	let left = e.clientX;
	let top = e.clientY;
	context.style = "";
	context.classList.add("invisible");
	context.classList.remove("hidden");
	if (left > (window.innerWidth / 2)) {
		left -= context.getBoundingClientRect().width;
	}
	if (top > (window.innerHeight / 2)) {
		top -= context.getBoundingClientRect().height;
	}
	context.style["left"] = `${left}px`;
	context.style["top"] = `${top}px`;
	context.classList.remove("invisible");
}

window.customElements.define("flex-item", Item);