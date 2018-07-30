$(document).ready(function(){
	$('.deleteUser').on('click', deleteUser);
});

function deleteUser(){
	var confirmation = confirm('User will be removed. Are you sure?');
	if (confirmation) {
		$.ajax({
			type: 'DELETE',
			url: '/users/delete/' + $(this).data('id')
		}).done(function(response){
		});
		window.location.replace('/')
	} else {
		return false;
	}
}