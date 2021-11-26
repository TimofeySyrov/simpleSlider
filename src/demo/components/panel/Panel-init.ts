import Panel from './Panel';

const panelsDOMs = document.querySelectorAll('.js-panel');
panelsDOMs.forEach((panel) => new Panel(panel as HTMLElement));
