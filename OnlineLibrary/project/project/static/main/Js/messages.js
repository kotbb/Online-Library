document.addEventListener('DOMContentLoaded', function() {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(function(alert) {
        setTimeout(function() {
            alert.classList.add('hide');
        }, 2000);
        setTimeout(function() {
            alert.remove();
        }, 3000);
    });
});
