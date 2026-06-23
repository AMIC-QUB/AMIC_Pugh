import { FiDownload, FiFileText, FiFilter, FiHelpCircle, FiMoon, FiSun } from 'react-icons/fi';

function downloadFile(filename, content, type) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([content], { type }));
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

export default function ControlPanel({
  scoredDesigns,
  criteriaConfig,
  theme,
  onClearFilters,
  onToggleTheme,
  onShowHelp,
}) {
  function exportCsv() {
    const criteria = Object.keys(criteriaConfig).filter((criterion) => criteriaConfig[criterion].enabled);
    const headings = ['Rank', 'Design', 'Total Score', ...criteria.map((criterion) => `${criterion} Score`)];
    const lines = scoredDesigns.map((design) => [design.rank, design.name, design.totalScore, ...criteria.map((criterion) => design.scores[criterion] ?? '')].map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','));
    downloadFile('amic-pugh-results.csv', [headings.join(','), ...lines].join('\n'), 'text/csv;charset=utf-8');
  }

  function exportJson() {
    downloadFile('amic-pugh-results.json', JSON.stringify({ criteriaConfig, results: scoredDesigns }, null, 2), 'application/json');
  }

  return <nav className="control-panel" aria-label="Application controls"><button className="button secondary" type="button" onClick={onShowHelp}><FiHelpCircle />Help</button><button className="button secondary" type="button" onClick={onClearFilters}><FiFilter />Clear filters</button><button className="button secondary" type="button" disabled={scoredDesigns.length === 0} onClick={exportCsv}><FiDownload />Export CSV</button><button className="button secondary" type="button" disabled={scoredDesigns.length === 0} onClick={exportJson}><FiFileText />Export JSON</button><button className="button icon-button" type="button" aria-label="Toggle colour theme" onClick={onToggleTheme}>{theme === 'dark' ? <FiSun /> : <FiMoon />}</button></nav>;
}
