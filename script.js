document.addEventListener('DOMContentLoaded', function() {
    const serviceRows = document.querySelectorAll('.service-row');
    const selectedItemsContainer = document.getElementById('selected-items');
    const totalAmountDisplay = document.getElementById('total-amount');

    // function createSummaryText(selectedServices) {
    //     const servicesList = selectedServices.map(service => service.text).join('\n');
    //     return `Összesítés:\n${servicesList}\nVégösszeg: ${totalAmountDisplay.textContent}`;
    // }

    const serviceShortNames = {
        "Végtag sérülés ellátása": "VSE",
        "Gyógyszeres kezelés": "GYK",
        "Általános egészségügyi ellátás": "ÁEE",
        "Sebészeti ellátás": "SE",
        "Helyszíni ellátás": "HE",
        "Betegszállítás": "BSZ",
        "Elsőbbségi hívás": "EH",
        "Különleges mentés": "KM",
        "Szándékos FALS hívás": "SFH",
        "Egészségügyi alkalmassági vizsgálat (MEFE)": "MEFE"
    };

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
                const shortName = serviceShortNames[serviceName] || serviceName;
                selectedServices.push(`${shortName} (${quantity}x)`);
                row.classList.add('selected');
            } else {
                row.classList.remove('selected');
            }
        });

        // Update total amount
        totalAmountDisplay.textContent = `${total.toLocaleString()} $`;

        // Update selected services list
        selectedItemsContainer.innerHTML = selectedServices.length > 0 
            ? selectedServices.map(service => `<div>${service}</div>`).join('') + '<button id="copy-btn">Másolás</button>'
            : '<div>Nincs kiválasztott Diagnozis</div>';

            attachCopyEvent(selectedServices);
    }


    function attachCopyEvent(selectedServices) {
        setTimeout(() => {
            const copyBtn = document.getElementById('copy-btn');
            if (copyBtn) {
                copyBtn.addEventListener('click', () => {
                    const textToCopy = selectedServices.join(', ');
                    navigator.clipboard.writeText(textToCopy).then(() => {
                        alert('Diagnózisok kimásolva!');
                    }).catch(err => {
                        console.error('Másolási hiba:', err);
                    });
                });
            }
        }, 100);
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

        row.addEventListener('click', (event) => {
            if (event.button === 0) {
                quantityInput.value = Math.min(parseInt(quantityInput.value || 0) + 1, parseInt(quantityInput.max));
            }
            updateTotal();
        });

        row.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            quantityInput.value = Math.max(parseInt(quantityInput.value || 0) - 1, 0);
            updateTotal();
        });
    });

    // Initial calculation
    updateTotal();
});