class Item extends HTMLElement {
	static MAX_SIZE = 5;
	static HUE_INC = 30;
	static hue = 0;
	static instances = 0;

	constructor(width, height) {
		super();
		this.style["background-color"] = `hsl(${Item.hue}, 100%, 50%)`;
		Item.hue += Item.HUE_INC;
		this.addEventListener("click", itemClick);
		this.setDimension("width", width);
		this.setDimension("height", height);
		this.n = ++Item.instances;
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

window.customElements.define("flex-item", Item);