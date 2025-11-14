const villeSelect = document.getElementById('ville');
const villeSelect2 = document.getElementById('ville2');
const appContainer = document.querySelector('.app-container');
const mainLayout = document.querySelector('.main-layout');
const aqiValue = document.getElementById('aqiValue');
const aqiStatus = document.getElementById('aqiStatus');
const aqiBar = document.getElementById('aqiBar');
const caspForm = document.getElementById('caspForm');

const WAQI_TOKEN = 'demo';

const cityNames = {
    'montreal': 'Montreal, Quebec',
    'quebec': 'Quebec, Quebec',
    'laval': 'Laval, Quebec',
    'gatineau': 'Gatineau, Quebec',
    'longueuil': 'Longueuil, Quebec',
    'sherbrooke': 'Sherbrooke, Quebec',
    'saguenay': 'Saguenay, Quebec',
    'levis': 'Levis, Quebec',
    'trois-rivieres': 'Trois-Rivieres, Quebec',
    'terrebonne': 'Terrebonne, Quebec',
    'saint-jean-sur-richelieu': 'Saint-Jean-sur-Richelieu, Quebec',
    'repentigny': 'Repentigny, Quebec',
    'brossard': 'Brossard, Quebec',
    'drummondville': 'Drummondville, Quebec',
    'saint-jerome': 'Saint-Jerome, Quebec',
    'granby': 'Granby, Quebec',
    'blainville': 'Blainville, Quebec',
    'saint-hyacinthe': 'Saint-Hyacinthe, Quebec',
    'shawinigan': 'Shawinigan, Quebec',
    'dollard-des-ormeaux': 'Dollard-Des-Ormeaux, Quebec',
    'pointe-claire': 'Pointe-Claire, Quebec',
    'victoriaville': 'Victoriaville, Quebec',
    'rimouski': 'Rimouski, Quebec',
    'saint-eustache': 'Saint-Eustache, Quebec',
    'sorel-tracy': 'Sorel-Tracy, Quebec',
    'mascouche': 'Mascouche, Quebec',
    'saint-georges': 'Saint-Georges, Quebec',
    'alma': 'Alma, Quebec',
    'mirabel': 'Mirabel, Quebec',
    'val-d-or': 'Val-d\'Or, Quebec',
    'rouyn-noranda': 'Rouyn-Noranda, Quebec',
    'thetford-mines': 'Thetford-Mines, Quebec',
    'sept-iles': 'Sept-Iles, Quebec',
    'saint-constant': 'Saint-Constant, Quebec',
    'joliette': 'Joliette, Quebec',
    'sainte-julie': 'Sainte-Julie, Quebec',
    'vaudreuil-dorion': 'Vaudreuil-Dorion, Quebec',
    'matane': 'Matane, Quebec',
    'varennes': 'Varennes, Quebec',
    'saint-bruno-de-montarville': 'Saint-Bruno-de-Montarville, Quebec'
};

const fallbackCASData = {
    'montreal': 3,
    'quebec': 2,
    'laval': 3,
    'gatineau': 2,
    'longueuil': 3,
    'sherbrooke': 2,
    'saguenay': 2,
    'levis': 2,
    'trois-rivieres': 2,
    'terrebonne': 3,
    'saint-jean-sur-richelieu': 2,
    'repentigny': 3,
    'brossard': 3,
    'drummondville': 2,
    'saint-jerome': 2,
    'granby': 2,
    'blainville': 3,
    'saint-hyacinthe': 2,
    'shawinigan': 2,
    'dollard-des-ormeaux': 3,
    'pointe-claire': 3,
    'victoriaville': 2,
    'rimouski': 2,
    'saint-eustache': 3,
    'sorel-tracy': 2,
    'mascouche': 3,
    'saint-georges': 2,
    'alma': 2,
    'mirabel': 2,
    'val-d-or': 2,
    'rouyn-noranda': 2,
    'thetford-mines': 2,
    'sept-iles': 1,
    'saint-constant': 3,
    'joliette': 2,
    'sainte-julie': 3,
    'vaudreuil-dorion': 3,
    'matane': 2,
    'varennes': 3,
    'saint-bruno-de-montarville': 3
};

function convertAQItoCAS(aqi) {
    if (aqi <= 50) return Math.max(1, Math.round(aqi / 50 * 3));
    if (aqi <= 100) return Math.round(3 + (aqi - 50) / 50 * 3);
    if (aqi <= 150) return Math.round(6 + (aqi - 100) / 50 * 2);
    if (aqi <= 200) return Math.min(9, Math.round(8 + (aqi - 150) / 50 * 1));
    return 10;
}

async function fetchRealAQI(city) {
    try {
        const cityName = cityNames[city];
        
        const response = await fetch(`https://api.waqi.info/feed/${encodeURIComponent(cityName)}/?token=${WAQI_TOKEN}`);
        
        if (!response.ok) {
            throw new Error('API request failed');
        }
        
        const data = await response.json();
        
        if (data.status === 'ok' && data.data && data.data.aqi) {
            const aqi = data.data.aqi;
            return convertAQItoCAS(aqi);
        } else {
            console.log(`No AQI data found for ${city}, using fallback`);
            return fallbackCASData[city] || 2;
        }
        
    } catch (error) {
        console.error('Error fetching AQI data:', error);
        return fallbackCASData[city] || 2;
    }
}

function getCASStatus(value) {
    if (value <= 3) return { status: 'Risque faible', color: '#7bc96f' };
    if (value <= 6) return { status: 'Risque modéré', color: '#f9d71c' };
    if (value <= 10) return { status: 'Risque élevé', color: '#f57c00' };
    return { status: 'Risque très élevé', color: '#e53935' };
}

async function updateCAS(city) {
    aqiValue.textContent = '...';
    aqiStatus.textContent = 'Chargement...';
    
    const cas = await fetchRealAQI(city);
    const statusInfo = getCASStatus(cas);
    
    aqiValue.textContent = cas;
    aqiStatus.textContent = statusInfo.status;
    aqiStatus.style.color = statusInfo.color;
    
    const heightPercent = Math.min((cas / 10) * 100, 100);
    aqiBar.style.height = heightPercent + '%';
    aqiBar.textContent = `CAS: ${cas}`;
    aqiBar.style.background = `linear-gradient(to top, ${statusInfo.color}, ${statusInfo.color}dd)`;
}

function switchToMainLayout(cityValue) {
    appContainer.classList.remove('centered');
    appContainer.classList.add('city-selected');
    mainLayout.classList.add('active');
    
    villeSelect2.value = cityValue;
    updateCAS(cityValue);
}

villeSelect.addEventListener('change', function(e) {
    if (this.value) {
        console.log('Ville sélectionnée:', this.value);
        switchToMainLayout(this.value);
    }
});

villeSelect2.addEventListener('change', function(e) {
    if (this.value) {
        console.log('Ville changée:', this.value);
        updateCAS(this.value);
        
        const caspBox = document.getElementById('caspBox');
        if (caspBox.style.display !== 'none') {
            recalculateCASP(this.value);
        }
    }
});

caspForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(caspForm);
    const ville = formData.get('ville');
    const age = parseInt(formData.get('age'));
    const activity = formData.get('activity');
    const respiratory = formData.get('respiratory') === 'yes';
    
    const CAS = await fetchRealAQI(ville);
    
    const intensite = 1;
    const poid_age = 0.6;
    const poid_ProbRespiratoire = 0.2;
    const poid_activite_physique = 0.9;
    
    const ageMinEnfant = 0;
    const ageMaxEnfant = 5;
    const ageMinSenior = 70;
    const ageMaxSenior = 100;
    const Age = ((age >= ageMinEnfant && age <= ageMaxEnfant) || (age >= ageMinSenior && age <= ageMaxSenior)) ? 1 : 0;
    
    const ProbRespiratoire = respiratory ? 1 : 0;
    
    let ActivitePhysique = 0;
    switch(activity) {
        case 'sedentaire': ActivitePhysique = 0; break;
        case 'leger': ActivitePhysique = 0.25; break;
        case 'modere': ActivitePhysique = 0.50; break;
        case 'actif': ActivitePhysique = 0.75; break;
        case 'tres-actif': ActivitePhysique = 1; break;
    }
    
    const CASP = parseFloat((CAS + intensite * (poid_age * Age + poid_ProbRespiratoire * ProbRespiratoire + poid_activite_physique * ActivitePhysique)).toFixed(2));
    
    updateCASPDisplay(CAS, CASP);
    
    console.log('Génération du CASP:', { CAS, CASP, age, Age, ProbRespiratoire, ActivitePhysique });
});

function updateCASPDisplay(cas, casp) {
    const casStatusInfo = getCASStatus(cas);
    const caspStatusInfo = getCASStatus(casp);
    
    aqiValue.textContent = cas;
    aqiStatus.textContent = casStatusInfo.status;
    aqiStatus.style.color = casStatusInfo.color;
    
    const casHeightPercent = Math.min((cas / 10) * 100, 100);
    aqiBar.style.height = casHeightPercent + '%';
    aqiBar.textContent = `CAS: ${cas}`;
    aqiBar.style.background = `linear-gradient(to top, ${casStatusInfo.color}, ${casStatusInfo.color}dd)`;
    
    const caspBox = document.getElementById('caspBox');
    const caspValue = document.getElementById('caspValue');
    const caspStatus = document.getElementById('caspStatus');
    const caspBar = document.getElementById('caspBar');
    
    caspBox.style.display = 'block';
    caspValue.textContent = casp;
    caspValue.style.color = caspStatusInfo.color;
    caspStatus.textContent = caspStatusInfo.status;
    caspStatus.style.color = caspStatusInfo.color;
    caspBar.style.display = 'flex';
    
    const caspHeightPercent = Math.min((casp / 10) * 100, 100);
    caspBar.style.height = caspHeightPercent + '%';
    caspBar.textContent = `CASP: ${casp}`;
    
    caspBar.style.background = `repeating-linear-gradient(
        45deg,
        ${caspStatusInfo.color},
        ${caspStatusInfo.color} 10px,
        ${caspStatusInfo.color}dd 10px,
        ${caspStatusInfo.color}dd 20px
    )`;
}

async function recalculateCASP(ville) {
    const age = parseInt(document.getElementById('age').value);
    const activity = document.getElementById('activity').value;
    const respiratory = document.getElementById('respiratory').checked;
    
    const CAS = await fetchRealAQI(ville);
    
    const intensite = 1;
    const poid_age = 0.6;
    const poid_ProbRespiratoire = 0.2;
    const poid_activite_physique = 0.9;
    
    const ageMinEnfant = 0;
    const ageMaxEnfant = 5;
    const ageMinSenior = 70;
    const ageMaxSenior = 100;
    const Age = ((age >= ageMinEnfant && age <= ageMaxEnfant) || (age >= ageMinSenior && age <= ageMaxSenior)) ? 1 : 0;
    
    const ProbRespiratoire = respiratory ? 1 : 0;
    
    let ActivitePhysique = 0;
    switch(activity) {
        case 'sedentaire': ActivitePhysique = 0; break;
        case 'leger': ActivitePhysique = 0.25; break;
        case 'modere': ActivitePhysique = 0.50; break;
        case 'actif': ActivitePhysique = 0.75; break;
        case 'tres-actif': ActivitePhysique = 1; break;
    }
    
    const CASP = parseFloat((CAS + intensite * (poid_age * Age + poid_ProbRespiratoire * ProbRespiratoire + poid_activite_physique * ActivitePhysique)).toFixed(2));
    
    updateCASPDisplay(CAS, CASP);
    
    console.log('CASP recalculé pour nouvelle ville:', { ville, CAS, CASP });
}
