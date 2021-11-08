class ThemeToggle extends HTMLElement {

	static template = (()=> {
		const t = document.createElement("template");
		t.innerHTML =
		`
		<style>
			#theme {
				--width: 20rem;
				--height: 2.5rem;
				--trans-time: 0.5s;

				width: var(--width);
				height: var(--height);
				border-radius: var(--height);

				background-color: #40444B;
				box-sizing: border-box;
				overflow: hidden;
				padding: 0 1px;
				position: relative;
				display: flex;
				justify-content: space-between;
				align-items: center;
			}

			svg {
				height: 90%;
				fill: black;
				z-index: 0;
				transition: fill var(--trans-time);
				cursor: pointer;
			}
			.bar {
				position: absolute;
				height: var(--height);
				background-color: #DCDCDC;
				width: calc(var(--height)/2);
				left: 0;
				transition: width var(--trans-time);
			}
			.circle {
				background-color: teal;
				height: var(--height);
				width: var(--height);
				border-radius: var(--height);
				position: absolute;
				right: calc(var(--width) - var(--height));
				transition: right var(--trans-time);
			}
			#dark { fill: white; }

			#theme.system .circle { right: calc(var(--width)/2 - var(--height)/2); }
			#theme.system .bar { width: calc(var(--width)/2); }

			// #theme.light { background-color: #c4c4c4; }
			#theme.light .circle { right: 0; }
			#theme.light .bar { width: calc(var(--width) - var(--height)/2); }

			#theme.light #light, #theme.system #system { fill: white; }
			#theme.light #dark, #theme.system #dark { fill: black; }
		</style>
		<div id="theme" part="theme" class="system">
			<div class="bar" part="bar"></div>
			<div class="circle" part="circle"></div>
			<svg id="dark" part="dark" class="theme-button" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 100 100"><path d="M46.971 13.285a37.53 37.53 0 0 0-9.793 2.148C17.721 22.515 7.69 44.028 14.771 63.484s28.595 29.488 48.051 22.407a37.53 37.53 0 0 0 8.882-4.65c-15.21-.889-29.17-10.618-34.712-25.845s-1.102-31.654 9.978-42.111z"/><path fill-rule="evenodd" d="M46.971 13.285c-11.08 10.458-15.52 26.884-9.978 42.111s19.503 24.956 34.712 25.845a37.53 37.53 0 0 1-8.882 4.65c-19.456 7.081-40.97-2.95-48.051-22.407s2.95-40.97 22.407-48.051a37.53 37.53 0 0 1 9.793-2.148z"/></svg>
			<svg id="system" part="system" class="theme-button" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 100 100"><path d="M48.126 25.744a25.02 25.02 0 0 0-6.529 1.432C28.626 31.897 21.939 46.239 26.66 59.21s19.063 19.659 32.034 14.938a25.02 25.02 0 0 0 5.922-3.1c-10.14-.593-19.447-7.079-23.142-17.23s-.734-21.102 6.652-28.074z"/><path fill-rule="evenodd" d="M48.126 25.744c-7.387 6.972-10.347 17.923-6.652 28.074s13.002 16.637 23.142 17.23a25.02 25.02 0 0 1-5.922 3.1C45.723 78.869 31.381 72.181 26.66 59.21s1.967-27.313 14.938-32.034a25.02 25.02 0 0 1 6.529-1.432z"/><path d="M51.214 5.392L50.146.662l-1.068 4.73a19.8 19.8 0 0 1-6.989 11.202 35.1 35.1 0 0 1 16.116 0 19.8 19.8 0 0 1-6.989-11.202zM68.53 20.874a35.18 35.18 0 0 1 11.403 11.403 19.8 19.8 0 0 1 2.978-12.871l2.589-4.1-4.1 2.589a19.8 19.8 0 0 1-12.871 2.978zm15.684 21.73a35.1 35.1 0 0 1 0 16.116c2.693-3.376 6.521-5.932 11.202-6.989l4.73-1.068-4.73-1.068c-4.681-1.057-8.509-3.614-11.202-6.989zm-4.28 26.443A35.18 35.18 0 0 1 68.53 80.45a19.8 19.8 0 0 1 12.871 2.978l4.1 2.589-2.589-4.1a19.8 19.8 0 0 1-2.978-12.871zM58.203 84.73a35.1 35.1 0 0 1-16.116 0c3.376 2.693 5.932 6.521 6.989 11.202l1.068 4.73 1.068-4.73c1.057-4.681 3.614-8.509 6.989-11.202zm-26.442-4.28a35.18 35.18 0 0 1-11.403-11.403 19.8 19.8 0 0 1-2.978 12.871l-2.589 4.1 4.1-2.589a19.8 19.8 0 0 1 12.871-2.978zM16.078 58.72a35.1 35.1 0 0 1 0-16.116 19.8 19.8 0 0 1-11.202 6.989l-4.73 1.068 4.73 1.068a19.8 19.8 0 0 1 11.202 6.989zm4.279-26.443c2.863-4.629 6.775-8.54 11.403-11.403a19.8 19.8 0 0 1-12.871-2.978l-4.1-2.589 2.589 4.1a19.8 19.8 0 0 1 2.978 12.871z"/></svg>
			<svg id="light" part="light" class="theme-button" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 100 100"><path d="M51.359 5.392L50.291.662l-1.068 4.73a19.8 19.8 0 0 1-6.989 11.202 35.1 35.1 0 0 1 16.116 0 19.8 19.8 0 0 1-6.989-11.202zm17.317 15.482a35.18 35.18 0 0 1 11.403 11.403 19.8 19.8 0 0 1 2.978-12.871l2.589-4.1-4.1 2.589a19.8 19.8 0 0 1-12.871 2.978zm15.683 21.73a35.1 35.1 0 0 1 0 16.116c2.693-3.376 6.521-5.932 11.202-6.989l4.73-1.068-4.73-1.068c-4.681-1.057-8.509-3.614-11.202-6.989zm-4.28 26.443A35.18 35.18 0 0 1 68.676 80.45a19.8 19.8 0 0 1 12.871 2.978l4.1 2.589-2.589-4.1a19.8 19.8 0 0 1-2.978-12.871zM58.349 84.73a35.1 35.1 0 0 1-16.116 0 19.8 19.8 0 0 1 6.989 11.202l1.068 4.73 1.068-4.73c1.057-4.681 3.614-8.509 6.989-11.202zm-26.443-4.28a35.18 35.18 0 0 1-11.403-11.403 19.8 19.8 0 0 1-2.978 12.871l-2.589 4.1 4.1-2.589a19.8 19.8 0 0 1 12.871-2.978zM16.223 58.72c-.61-2.587-.932-5.285-.932-8.058s.322-5.471.932-8.058c-2.693 3.376-6.521 5.932-11.202 6.989l-4.73 1.068 4.73 1.068c4.681 1.057 8.509 3.614 11.202 6.989zm4.28-26.443c2.863-4.629 6.775-8.54 11.403-11.403a19.8 19.8 0 0 1-12.87-2.978l-4.1-2.589 2.589 4.1a19.8 19.8 0 0 1 2.978 12.871zm54.788 18.385c0 13.807-11.193 25-25 25s-25-11.193-25-25 11.193-25 25-25 25 11.193 25 25z"/></svg>
		</div>`;
		return t;
	})();

	constructor() {
		super();
		this.attachShadow({mode: "open"});
	}

	connectedCallback() {
		this.shadowRoot.appendChild(ThemeToggle.template.content.cloneNode(true));

		const theme = localStorage.getItem("theme");
		if (theme) {
			document.documentElement.setAttribute("theme", theme);
			this.shadowRoot.querySelector("#theme").classList = theme;
		}

		for (const btn of this.shadowRoot.querySelectorAll(".theme-button")) {
			btn.addEventListener("click", function() {
				this.parentElement.classList = this.id;
				document.documentElement.setAttribute("theme", this.id);
				localStorage.setItem("theme", this.id);
			});
		}
	}
}

window.customElements.define("theme-toggle", ThemeToggle);