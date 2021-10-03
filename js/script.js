const sandbox = document.querySelector(".sandbox");
const widthSelect = document.querySelector("select[name='width']");
const heightSelect = document.querySelector("select[name='height']");
const sandboxControls = document.querySelectorAll("select[for='sandbox']");
const boxes = document.querySelector("input[name='boxes']");

const defualtBoxCount = 3;

/** The number of boxes there were prior to the latest change in the number of boxes */
let prev = boxes.value;

//info ############################################## Functions ##############################################

/**
 * Set the given dimension of all the boxes in the sandbox to the given value
 * @param {String} dimension - Either "width" or "height"
 * @param {*} value - A number between 1 and 5 (inclusive) or the string "unset" or "random"
 */
 function setDimension(dimension, value) {
	for (let i of document.querySelectorAll(".item")) {
		switch (value) {
			case "unset":
				i.style[dimension] = value;
				break;
			case "random":
				i.style[dimension] = Math.ceil(Math.random()*5) * 5 + "vmax";
				break
			default:
				i.style[dimension] = value * 5 + "vmax";
		}
	}
}

/**
 * Fill the sandbox with num different colored boxes
 * @param {Number} num - The number of boxes to fill the sandbox with
 */
function populateSandbox(num) {
	let hue = 0;
	sandbox.innerHTML = "";
	for (let i = 0; i < num; ++i) {
		let item = document.createElement("div");
		item.classList.add("item");
		item.style["background-color"] = `hsl(${hue}, 100%, 50%)`;
		sandbox.appendChild(item);
		hue += 30;
	}
	setDimension("width", widthSelect.value);
	setDimension("height", heightSelect.value);
}

/**
 * Set the sandbox's given flex property to the value of the triggered input
 */
function setFlexProperty() {
	sandbox.style[this.name] = this.value;
}

/**
 * Reset all the inputs and the sandbox
 */
function reset() {
	widthSelect.value = widthSelect.children[0].value;
	heightSelect.value = heightSelect.children[0].value;
	prev = defualtBoxCount;
	boxes.value = defualtBoxCount;
	for (const select of sandboxControls) {
		select.value = select.children[0].value;
		sandbox.style = "";
	}
	populateSandbox(prev);
}

//info ########################################### Event Listeners ###########################################

widthSelect.addEventListener("change", function() { setDimension("width", this.value) })
heightSelect.addEventListener("change", function() { setDimension("height", this.value) })

boxes.addEventListener("change", function() {
	if (this.value > 20 || this.value < 1 || isNaN(this.value))
		this.value = prev;
	else {
		populateSandbox(this.value)
		prev = this.value;
	}
})

for (const select of sandboxControls) {
	select.addEventListener("change", setFlexProperty);
}

document.querySelector("#reset").addEventListener("click", reset);

//info ########################################### Run on page load ##########################################

for (const select of sandboxControls) {
	if (select.value !== select.children[0].value) {
		sandbox.style[select.name] = select.value;
	}
}
populateSandbox(prev);