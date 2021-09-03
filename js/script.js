const container = document.querySelector(".container");
const widthSelect = document.querySelector("select[name='width']");
const heightSelect = document.querySelector("select[name='height']");

/** The number of boxes there were prior to the latest change in the number of boxes */
let prev = 3;

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

//info ########################################### Event Listeners ###########################################

widthSelect.addEventListener("change", function() { setDimension("width", this.value) })
heightSelect.addEventListener("change", function() { setDimension("height", this.value) })

document.querySelector("input[name='boxes']").addEventListener("change", function() {
	if (this.value > 20 || this.value < 1 || isNaN(this.value))
		this.value = prev;
	else {
		populateContainer(this.value)
		prev = this.value;
	}
})

for (let select of document.querySelectorAll("select[for='container']")) {
	select.addEventListener("change", setFlexProperty);
}

//info ########################################### Run on page load ##########################################

populateContainer(prev);