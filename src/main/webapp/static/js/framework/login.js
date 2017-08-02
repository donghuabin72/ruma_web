$('#imageCode').click(function() {
	refreshCheckCode();
});

function refreshCheckCode() {
	var append = '?clearCache=' + new Date().getTime() + 'a' + Math.random();
	$('#imageCode').attr('src', $('#imageCode').attr('src') + append);
}

var element = getById("login");
console.log(getValue(element, "class"));