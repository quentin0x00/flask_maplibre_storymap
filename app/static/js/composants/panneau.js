import { setupScrollTrigger, setActiveEncart, setupNavigationButtons } from '../navigation.js';

export function createEncarts(data, map) {
    if (!data || data.length === 0) return;
    
    document.getElementById('encart').innerHTML = data.map((item, index) => `
        <section id="${item.id}" 
                class="${index === 0 ? 'active first-section' : ''}${index === data.length - 1 ? ' last-section' : ''}" data-border-color="${item.param.border_color}">
            <div class="encart-container">
                <div class="encart-content">
                    <div class="encart-id-circle" style="background-color:${item.param.border_color}">
                        ${index + 1}/${data.length}
                    </div>
                    <h3 class="encart-title" style="border-color:${item.param.border_color}">${item.encart.title}</h3>
                    ${item.encart.role ? `<div class="encart-champ" id="role"><b><p>${item.encart.role}</p></b></div>` : ''}
                    ${item.encart.date ? `<div class="encart-champ" id="date"><p>${item.encart.date}</p></div>` : ''}
                    ${item.encart.content ? `<div class="encart-champ"><p>${item.encart.content.replace(/;/g, '<br>')}</p></div>` : ''}
                    ${item.encart.skills?.length ? `
                        <div class="encart-champ">
                            <div class="skills">
                                ${item.encart.skills.map(skill => `<span class="skill">${skill.trim()}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>

            <div class="navigation-buttons">
                ${index !== 0 ? `<button class="prev-button" data-section-id="${item.id}">↑ Précédent</button>` : ''}
                ${index !== data.length - 1 ? `
                    <button class="next-button" data-section-id="${item.id}">
                        ${index === 0 ? "Parcourir l'historique ↓" : 'Suivant ↓'}
                    </button>
                ` : ''}
                ${index === data.length - 1 ? `<button class="first-section-button">Revenir au début ↑</button>` : ''}
            </div>
        </section>
    `).join('');

    setupNavigationButtons(map);
    setupScrollTrigger(data, map);
    setActiveEncart(data[0].id, map);


    // Ajuster la marge inférieure de la dernière section
    function adjustMargin() {
        const lastSection = document.querySelector('.last-section');
        const panneau = document.getElementById('panneau');
        
        if (lastSection && panneau) {
            const sectionHeight = lastSection.offsetHeight;
            const panneauHeight = panneau.offsetHeight;
            const marginBottom = panneauHeight - sectionHeight;
            lastSection.style.marginBottom = `${marginBottom}px`;
        }
    }
    adjustMargin(); 
    window.addEventListener('resize', adjustMargin);
}