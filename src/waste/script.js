function showJourney(type) {
    const display = document.getElementById('journey-display');
    let journeyText = '';

    switch(type) {
        case 'food':
            journeyText = 'Food waste is composted into bio-fertilizer or used for biogas.';
            break;
        case 'recyclable':
            journeyText = 'Recyclables are sorted, cleaned, and converted into raw materials.';
            break;
        case 'hazardous':
            journeyText = 'Hazardous waste is treated safely to prevent environmental harm.';
            break;
        case 'residual':
            journeyText = 'Residual waste is incinerated or sent to landfills.';
            break;
        default:
            journeyText = 'Select a valid waste type.';
    }

    display.innerHTML = `<p>${journeyText}</p>`;
}