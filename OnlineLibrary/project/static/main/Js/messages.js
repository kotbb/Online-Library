document.addEventListener('DOMContentLoaded', function() {
    const messages = document.querySelectorAll('.alert');
    
    messages.forEach(message => {
        setTimeout(() => {
            message.classList.add('fade-out');
            
            setTimeout(() => {
                message.remove();
            }, 500);
        }, 3000);
    });
}); 