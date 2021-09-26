const btn = document.querySelector('.btn-primary');

btn.onmousemove = function (e) {
	const x = e.pageX - btn.offsetLeft;
	const y = e.pageY - btn.offsetTop;

	btn.style.setProperty('--x', x + 'px');
	btn.style.setProperty('--y', y + 'px');
	// console.log(y);
};


const input = document.querySelector('#query');
const searchIcon = document.querySelector('.hideButton');

searchIcon.onmousemove = function () {
  console.log(input.classList);
  if (input.classList.display = 'none') {
    input.classList.toggle('.block')
  }

}