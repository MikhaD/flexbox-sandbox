//info ############################################### Classes ###############################################

class Sandbox {
	static DEFUALT_BOX_COUNT = 5;
	/** The number of boxes there were prior to the latest change in the number of boxes */
	prev = Sandbox.DEFUALT_BOX_COUNT;
	items = [];
	selectedItems = {};
	controls;

	constructor(sandbox) {
		this.sandbox = sandbox;
	}

	addItem() {
		let item = new Item(widthSelect.value, heightSelect.value);
		this.items.push(item);
		this.sandbox.appendChild(item);
	}

	removeItem() {
		let item = this.items.pop();
		delete this.selectedItems[item.n];
		item.remove();
	}

	clear() {
		Item.hue = 0;
		Item.instances = 0;
		this.sandbox.innerHTML = "";
		this.items = [];
		this.selectedItems = {};
	}
	/**
	 * Fill the sandbox with num different colored boxes
	 * @param {Number} num - The number of boxes to fill the sandbox with
	 */
	rePopulate(num) {
		this.clear();
		for (let i = 0; i < num; ++i) {
			this.addItem();
		}
	}
	/**
	 * Set the sandbox's given flex property to the value of the triggered input
	 */
	setFlexProperty(property, value) {
		this.sandbox.style[property] = value;
	}

	setItemsDimensions(dimension, value) {
		for (const item of this.items) {
			item.setDimension(dimension, value);
		}
	}

	addEventListener(event, callback) {
		this.sandbox.addEventListener(event, callback);
	}

	clearSelectedItems() {
		console.log("Selected items before:", this.selectedItems);
		for (const key in this.selectedItems) {
			this.selectedItems[key].remove("selected");
			this.selectedItems[key] = null;
		}
		console.log("Selected items after:", this.selectedItems);
	}
}

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

//info ############################################## Constants ##############################################

const sandbox = new Sandbox(document.querySelector("#sandbox"));
sandbox.controls = document.querySelectorAll("select[for='sandbox']");
const widthSelect = document.querySelector("select[name='width']");
const heightSelect = document.querySelector("select[name='height']");
const boxes = document.querySelector("input[name='boxes']");

//info ############################################## Functions ##############################################

/**
 * Reset all the inputs and the sandbox
 */
function reset() {
	widthSelect.value = widthSelect.children[0].value;
	heightSelect.value = heightSelect.children[0].value;
	sandbox.prev = Sandbox.DEFUALT_BOX_COUNT;
	boxes.value = Sandbox.DEFUALT_BOX_COUNT;
	for (const select of sandbox.controls) {
		select.value = select.children[0].value;
	}
	sandbox.sandbox.style = "";
	sandbox.prev = Sandbox.DEFUALT_BOX_COUNT;
	sandbox.rePopulate(Sandbox.DEFUALT_BOX_COUNT);
}

function itemClickk(e) {
	if (e.shiftKey) {
		let from, to = e.currentTarget.n;
		if (selectedItems.length > 0) {
			from = selectedItems.pop().n;
			clearSelectedItems();
			const inc = (from < to) ? 1 : -1;
			for (from; from !== to; from += inc) {
				items[from].classList.add("selected");
				selectedItems.push(items[from]);
			}
		}
	} else if (!e.ctrlKey) {
		clearSelectedItems();
	}
	// Deselection currently not working because I'm clearing selected items if Ctrl isn't being held
	if (e.currentTarget.classList.contains("selected")) {
		for (let i = 0; i < selectedItems.length; ++i) {
			if (selectedItems[i].n === e.currentTarget.n) {
				selectedItems.splice(i, 1);
				break;
			}
		}
	} else {
		e.currentTarget.classList.add("selected");
		selectedItems.push(e.currentTarget);
	}
}

function itemClick(e) {
	// if (e.shiftKey) {
	// 	if (Object.keys(sandbox.selectedItems).length > 0) {

	// 	}
	// } else
	if (e.ctrlKey) {
		if (e.currentTarget.classList.contains("selected")) {
			e.currentTarget.classList.remove("selected");
			delete sandbox.selectedItems[e.currentTarget.n];
		} else {
			e.currentTarget.classList.add("selected");
			sandbox.selectedItems[e.currentTarget.n] = e.currentTarget;
		}
	} else {
		sandbox.clearSelectedItems();
		e.currentTarget.classList.add("selected");
		sandbox.selectedItems[e.currentTarget.n] = e.currentTarget;
	}
}

//info ########################################### Event Listeners ###########################################

widthSelect.addEventListener("change", function() { sandbox.setItemsDimensions("width", this.value) })
heightSelect.addEventListener("change", function() { sandbox.setItemsDimensions("height", this.value) })

boxes.addEventListener("change", function() {
	if (this.value > 20 || this.value < 1 || isNaN(this.value)) {
		this.value = sandbox.prev;
	} else {
		if (this.value > sandbox.prev) {
			for (let i = sandbox.prev; i < this.value; ++i) {
				sandbox.addItem();
			}
		} else {
			for (let i = this.value; i < sandbox.prev; ++i) {
				sandbox.removeItem();
			}
		}
		sandbox.prev = this.value;
	}
})

for (const select of sandbox.controls) {
	select.addEventListener("change", e => {
		sandbox.setFlexProperty(e.currentTarget.name, e.currentTarget.value);
	});
}

document.querySelector("#reset").addEventListener("click", reset);

sandbox.addEventListener("click", e => {
	if (e.target.id === "sandbox") {
		sandbox.clearSelectedItems();
	}
});

window.addEventListener("keydown", e => {
	if ((e.key === "a" || e.key === "A") && e.ctrlKey) {
		e.preventDefault();
		console.log(e.key, e.ctrlKey);
	}
	// if (e.key === "L") {
	// 	// Debug action here
	// }
});

//info ########################################### Run on page load ##########################################
boxes.value = Sandbox.DEFUALT_BOX_COUNT;

for (const select of sandbox.controls) {
	if (select.value !== select.children[0].value) {
		sandbox.sandbox.style[select.name] = select.value;
	}
}
sandbox.rePopulate(sandbox.prev);