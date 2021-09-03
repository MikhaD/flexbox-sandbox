const container = document.querySelector(".container");
const widthSelect = document.querySelector("select[name='width']");
const heightSelect = document.querySelector("select[name='height']");
const containerControls = document.querySelectorAll("select[for='container']");
const boxes = document.querySelector("input[name='boxes']");

const defualtBoxCount = 3;

/** The number of boxes there were prior to the latest change in the number of boxes */
let prev = boxes.value;

//info ############################################## Functions ##############################################

/**
 * Set the given dimension of all the boxes in the container to the given value
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
 * Fill the container with num different colored boxes
 * @param {Number} num - The number of boxes to fill the container with
 */
function populateContainer(num) {
	let hue = 0;
	container.innerHTML = "";
	for (let i = 0; i < num; ++i) {
		let item = document.createElement("div");
		item.classList.add("item");
		item.style["background-color"] = `hsl(${hue}, 100%, 50%)`;
		container.appendChild(item);
		hue += 30;
	}
	setDimension("width", widthSelect.value);
	setDimension("height", heightSelect.value);
}

/**
 * Set the containers given flex property to the value of the triggered input
 */
function setFlexProperty() {
	container.style[this.name] = this.value;
}

/**
 * Reset all the inputs and the display container
 */
function reset() {
	widthSelect.value = widthSelect.children[0].value;
	heightSelect.value = heightSelect.children[0].value;
	prev = defualtBoxCount;
	boxes.value = defualtBoxCount;
	for (const select of containerControls) {
		select.value = select.children[0].value;
		container.style = "";
	}
	populateContainer(prev);
}

//info ########################################### Event Listeners ###########################################

widthSelect.addEventListener("change", function() { setDimension("width", this.value) })
heightSelect.addEventListener("change", function() { setDimension("height", this.value) })

boxes.addEventListener("change", function() {
	if (this.value > 20 || this.value < 1 || isNaN(this.value))
		this.value = prev;
	else {
		populateContainer(this.value)
		prev = this.value;
	}
})

for (const select of containerControls) {
	select.addEventListener("change", setFlexProperty);
}

document.querySelector("#reset").addEventListener("click", reset);

//info ########################################### Run on page load ##########################################

for (const select of containerControls) {
	if (select.value !== select.children[0].value) {
		container.style[select.name] = select.value;
	}
}
populateContainer(prev);