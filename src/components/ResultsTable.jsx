import { useMemo, useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

function compareValues(first, second) {
  if (typeof first === 'number' && typeof second === 'number') {
    return first - second;
  }
  return String(first).localeCompare(String(second));
}

export default function ResultsTable({ designs, criteria, selectedDesign, onSelectDesign, totalCount }) {
  const [sort, setSort] = useState({ key: 'rank', direction: 'asc' });
  const enabledCriteria = criteria.filter((criterion) => designs[0]?.scores?.[criterion] !== undefined);
  const sortedDesigns = useMemo(() => [...designs].sort((first, second) => {
    const firstValue = sort.key === 'name' ? first.name : sort.key === 'totalScore'
      ? first.totalScore : sort.key === 'rank' ? first.rank : first.scores[sort.key];
    const secondValue = sort.key === 'name' ? second.name : sort.key === 'totalScore'
      ? second.totalScore : sort.key === 'rank' ? second.rank : second.scores[sort.key];
    const comparison = compareValues(firstValue, secondValue);
    return sort.direction === 'asc' ? comparison : -comparison;
  }), [designs, sort]);

  function setSortKey(key) {
    setSort((current) => ({ key, direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc' }));
  }

  function header(label, key) {
    const icon = sort.key === key ? (sort.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />) : null;
    return <button className="sort-button" type="button" onClick={() => setSortKey(key)}>{label}{icon}</button>;
  }

  return (
    <section className="panel results-panel" aria-labelledby="results-heading">
      <div className="panel-heading">
        <div>
          <h2 id="results-heading">Ranked designs</h2>
          <p className="muted">{designs.length} of {totalCount} designs pass the current filters.</p>
        </div>
      </div>
      {designs.length === 0 ? <p className="empty-state">No designs match the current filters.</p> : (
        <div className="results-table-wrap">
          <table className="results-table">
            <thead><tr><th>{header('Rank', 'rank')}</th><th>{header('Design', 'name')}</th><th>{header('Score', 'totalScore')}</th>{enabledCriteria.map((criterion) => <th key={criterion}>{header(criterion, criterion)}</th>)}</tr></thead>
            <tbody>{sortedDesigns.map((design) => (
              <tr className={selectedDesign?.id === design.id ? 'selected' : ''} key={design.id} onClick={() => onSelectDesign(design)}>
                <td>{design.rank}</td><th scope="row">{design.name}</th><td>{design.totalScore.toFixed(3)}</td>{enabledCriteria.map((criterion) => <td key={criterion}>{design.scores[criterion].toFixed(2)}</td>)}
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </section>
  );
}
