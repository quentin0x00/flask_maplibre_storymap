import { setupScrollTrigger, setActiveEncart, setupNavigationButtons } from '../navigation.js';

export function createEncarts(data, map) {
    if (!data || data.length === 0) return;
    
    const encartContent = document.getElementById('encart');
    encartContent.innerHTML = data.map((item, index) => createEncartHTML(item, index, data)).join('');

    setupNavigationButtons(map);
    setupScrollTrigger(data, map);
    setActiveEncart(data[0].id, map);
}

function createEncartHTML(item, index, data) {
    return `
        <section id="${item.id}" class="${getSectionClasses(index, data)}" data-border-color="${item.param.border_color}">
            <div class="encart-id-circle" style="background-color: ${item.param.border_color};">
                ${index + 1}/${data.length}
            </div>
            <h3 class="encart-title" style="border-color: ${item.param.border_color};">${item.encart.title}</h3>
            ${createRoleHTML(item.encart.role)}
            ${createDateHTML(item.encart.date)}
            ${createContentHTML(item.encart.content)}
            ${createSkillsHTML(item.encart.skills)}
            ${createLinkHTML(item.encart.link, item.encart.link_alias)}
            ${createNavigationButtons(item.id, index, data.length)}
        </section>
    `;
}

function getSectionClasses(index, data) {
    let classes = '';
    if (index === 0) classes += 'active first-section ';
    if (index === data.length - 1) classes += 'last-section';
    return classes.trim();
}

function createRoleHTML(role) {
    return role ? `<div class="encart-champ" id="role"><b><p>${role}</p></b></div>` : '';
}

function createDateHTML(date) {
    return date ? `<div class="encart-champ" id="date"><p>${date}</p></div>` : '';
}

function createContentHTML(content) {
    return content ? `<div class="encart-champ"><p>${content.replace(/;/g, '<br>')}</p></div>` : '';
}

function createSkillsHTML(skills) {
    if (!skills || skills.length === 0) return '';
    
    return `
        <div class="encart-champ">
            <div class="skills">
                ${skills.map(skill => `<span class="skill">${skill.trim()}</span>`).join('')}
            </div>
        </div>
    `;
}

function createLinkHTML(link, linkAlias) {
    return (link && linkAlias) ? `
        <div class="encart-champ">
            <p><a href="${link}" target="_blank">${linkAlias}</a></p>
        </div>
    ` : '';
}

function createNavigationButtons(id, index, total) {
    return `
        <div class="navigation-buttons">
            ${index !== 0 ? `<button class="prev-button" data-section-id="${id}">← Précédent</button>` : ''}
            ${index !== total - 1 ? `
                <button class="next-button" data-section-id="${id}">
                    ${index === 0 ? "Parcourir l'historique →" : 'Suivant →'}
                </button>
            ` : ''}
            ${index === total - 1 ? `<button class="first-section-button">Revenir au début ↑</button>` : ''}
        </div>
    `;
}
