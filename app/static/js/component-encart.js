let currentActiveEncart = null;

export function createEncarts(encarts, map) {
    const encartContent = document.getElementById('encart-content');
    encartContent.innerHTML = encarts.map((encart, index) => `
        <section id="${encart.id}" class="${index === 0 ? 'active first-section' : ''} ${index === encarts.length - 1 ? 'last-section' : ''}" data-border-color="${encart.border_color}">
            <div class="encart-id-circle" style="background-color: ${encart.border_color};">
                ${index + 1}/${encarts.length}
            </div>   
            <h3 class="encart-title" style="border-left: 8px solid ${encart.border_color}; padding-left: 16px"> ${encart.title}</h3>
            ${encart.role ? `<div class="encart-champ" id="role"><b><p>${encart.role}</p></b></div>` : ''}
            ${encart.date ? `<div class="encart-champ" id="date"><p>${encart.date}</p></div>` : ''}
            ${encart.content ? `<div class="encart-champ"><p>${encart.content.replace(/;/g, '<br>')}</p></div>` : ''}
            ${encart.skills.length ? `
                <div class="encart-champ">
                    <div class="skills">
                        ${encart.skills.map(skill => `<span class="skill">${skill.trim()}</span>`).join('')}
                    </div>
                </div>` : ''}
        ${encart.link && encart.link_alias ? `
            <div class="encart-champ">
                <p><a href="${encart.link}" target="_blank">Visiter le site</a></p>
            </div>` : ''}
            <div class="navigation-buttons">
                ${index !== 0 ? `<button class="prev-button" data-section-id="${encart.id}">← Précédent</button>` : ''}
                ${index !== encarts.length - 1 ? `<button class="next-button" data-section-id="${encart.id}">Suivant →</button>` : ''}
                ${index === encarts.length - 1 ? `<button class="first-section-button">Revenir au début ↑</button>` : ''}
            </div>
        </section>
    `).join('');

    setupNavigationButtons(map);
    setupScrollListener(map);
}

function setupNavigationButtons(map) {
    document.querySelectorAll('.prev-button').forEach(button => {
        button.addEventListener('click', () => {
            const sectionId = button.getAttribute('data-section-id');
            scrollToPreviousSection(sectionId, map);
        });
    });

    document.querySelectorAll('.next-button').forEach(button => {
        button.addEventListener('click', () => {
            const sectionId = button.getAttribute('data-section-id');
            scrollToNextSection(sectionId, map);
        });
    });

    document.querySelector('.first-section-button')?.addEventListener('click', () => scrollToFirstSection(map));
}

function setupScrollListener(map) {
    let activeencartName = Object.keys(window.encarts)[0];
    setActiveencart(activeencartName, map);

    document.getElementById('panneau').onscroll = function () {
        if (window.isMarkerClick) return;

        const encartNames = Object.keys(window.encarts);
        for (const encartName of encartNames) {
            if (isElementOnScreen(encartName)) {
                setActiveencart(encartName, map);
                break;
            }
        }
    };
}

function isElementOnScreen(id) {
    const element = document.getElementById(id);
    if (!element) return false;
    const panneauDiv = document.getElementById('panneau');
    const panneauScrollTop = panneauDiv.scrollTop;
    const panneauHeight = panneauDiv.clientHeight;
    const threshold = panneauHeight * 0.2;
    const elementOffsetTop = element.offsetTop;
    const elementHeight = element.clientHeight;
    return elementOffsetTop - panneauScrollTop <= threshold &&
        elementOffsetTop + elementHeight - panneauScrollTop > threshold;
}

export function scrollToFirstSection(map) {
    const firstSection = document.querySelector('section:first-of-type');
    if (firstSection) {
        firstSection.scrollIntoView({ behavior: 'smooth' });
    }
}

export function scrollToPreviousSection(currentSectionId, map) {
    const currentSection = document.getElementById(currentSectionId);
    if (!currentSection) return;

    const prevSection = currentSection.previousElementSibling;
    if (prevSection && prevSection.tagName === 'SECTION') {
        prevSection.scrollIntoView({ behavior: 'smooth' });
    }
}

export function scrollToNextSection(currentSectionId, map) {
    const currentSection = document.getElementById(currentSectionId);
    if (!currentSection) return;

    const nextSection = currentSection.nextElementSibling;
    if (nextSection && nextSection.tagName === 'SECTION') {
        nextSection.scrollIntoView({ behavior: 'smooth' });
    }
}

export function setActiveencart(encartName, map) {
    if (currentActiveEncart === encartName) return;

    const activeencart = document.querySelector('.active');
    if (activeencart) {
        activeencart.classList.remove('active');
    }
    const newActiveencart = document.getElementById(encartName);
    if (newActiveencart) {
        newActiveencart.classList.add('active');
        currentActiveEncart = encartName;

        const encartData = window.encarts.find(encart => encart.id === encartName);
        if (encartData) {
            map.flyTo({
                center: [encartData.center[0], encartData.center[1]],
                zoom: encartData.zoom || 16,
                bearing: encartData.bearing || 0,
                pitch: encartData.pitch || 60, 
                speed: encartData.speed || 1.3
            });
        }
    }
}