document.addEventListener('DOMContentLoaded', function() {
    const serviceRows = document.querySelectorAll('.service-row');
    const selectedItemsContainer = document.getElementById('selected-items');
    const totalAmountDisplay = document.getElementById('total-amount');

    
    // function createSummaryText(selectedServices) {
    //     const servicesList = selectedServices.map(service => service.text).join('\n');
    //     return `Összesítés:\n${servicesList}\nVégösszeg: ${totalAmountDisplay.textContent}`;
    // }

    function updateTotal() {
        let total = 0;
        const selectedServices = [];

        serviceRows.forEach(row => {
            const quantityInput = row.querySelector('.quantity-input');
            const quantity = parseInt(quantityInput.value) || 0;
            const price = parseInt(quantityInput.dataset.price);
            
            if (quantity > 0) {
                total += quantity * price;
                const serviceName = row.querySelector('.service-name').textContent;
                selectedServices.push(`${serviceName} (${quantity}x)`);
                row.classList.add('selected');
            } else {
                row.classList.remove('selected');
            }
        });

        // Update total amount
        totalAmountDisplay.textContent = `${total.toLocaleString()} $`;

        // Update selected services list
        selectedItemsContainer.innerHTML = selectedServices.length > 0 
            ? selectedServices.map(service => `<div>${service}</div>`).join('')
            : '<div>Nincs kiválasztott Diagnozis</div>';
    }

    // Add event listeners to all quantity inputs
    serviceRows.forEach(row => {
        const quantityInput = row.querySelector('.quantity-input');
        const addButton = row.querySelector('.add-btn');

        quantityInput.addEventListener('change', updateTotal);
        quantityInput.addEventListener('input', updateTotal);
        
        addButton.addEventListener('click', () => {
            quantityInput.value = parseInt(quantityInput.value || 0) + 1;
            updateTotal();
        });
    });

    // Initial calculation
    updateTotal();
});