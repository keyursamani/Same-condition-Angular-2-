
/* Selection of inbox elements
----------------------------------*/

var ibxList = document.querySelectorAll('.inbox-list li');
[].forEach.call(ibxList, function(el) {
	el.addEventListener('click', function(e) {
		clickInboxItem(el);
	});
});

function clickInboxItem(el) {
	[].forEach.call(ibxList, function(elm) {
		elm.classList.remove('active');
	});
	el.classList.add('active');
}
