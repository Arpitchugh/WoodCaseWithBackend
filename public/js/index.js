// var lg = document.querySelector('.lg');

// // length.addEventListener('', () => {
// //   length.style.width =
// // })
// lg.addEventListener('mouseover', () => {
//   var length = lg.getBoundingClientRect().width;
//   const hi = `width: ${length}`
//   console.log(length);

// })

const btn = document.querySelector('.btn-primary');

btn.onmousemove = function (e) {
	const x = e.pageX - btn.offsetLeft;
	const y = e.pageY - btn.offsetTop;

	btn.style.setProperty('--x', x + 'px');
	btn.style.setProperty('--y', y + 'px');
	// console.log(y);
};
