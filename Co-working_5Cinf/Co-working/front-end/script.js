// script.js

// Funzione per mostrare notifiche o messaggi di successo/errore
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    document.body.appendChild(notification);

    // Rimuove automaticamente la notifica dopo 3 secondi
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Event listener per i pulsanti di prenotazione
document.addEventListener('DOMContentLoaded', () => {
    const bookingButtons = document.querySelectorAll('.btn-primary');

    bookingButtons.forEach(button => {
        button.addEventListener('click', event => {
            event.preventDefault();

            // Simula una prenotazione (in un'app reale, faresti una richiesta API)
            const spaceName = button.parentElement.querySelector('.card-title').textContent;

            // Simulazione di una richiesta asincrona
            fetch('/booking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: 'UtenteDemo', // Questo può essere dinamico, es. recuperato da sessione utente
                    space: spaceName,
                    date: new Date().toISOString().split('T')[0]
                })
            })
            .then(response => {
                if (response.ok) {
                    showNotification(`Prenotazione per "${spaceName}" completata con successo!`);
                } else {
                    throw new Error('Errore nella prenotazione');
                }
            })
            .catch(error => {
                console.error('Errore:', error);
                showNotification('Errore durante la prenotazione. Riprova.', 'danger');
            });
        });
    });
});
