import { FiHelpCircle } from 'react-icons/fi';
import { DIRECTIONS } from '../utils/constants';

function formatNumber(value) {
  return Number.isFinite(value) ? value.toLocaleString(undefined, { maximumFractionDigits: 3 }) : '—';
}

export default function CriteriaPanel({ criteria, criteriaConfig, stats, onUpdate, onSetAllEnabled }) {
  const allEnabled = criteria.length > 0 && criteria.every((criterion) => criteriaConfig[criterion]?.enabled);

  return (
    <section className="panel criteria-panel" aria-labelledby="criteria-heading">
      <div className="panel-heading">
        <div>
          <h2 id="criteria-heading">Criteria</h2>
          <p className="muted">Configure how each measure contributes to the ranking.</p>
        </div>
        <span className="tooltip" data-tooltip="Scores are normalised from 0 to 1. Weight controls the relative contribution of each enabled criterion.">
          <FiHelpCircle aria-label="Scoring help" />
        </span>
      </div>
      <div className="criteria-table-wrap">
        <table className="criteria-table">
          <thead>
            <tr>
              <th><input aria-label="Enable all criteria" type="checkbox" checked={allEnabled} onChange={(event) => onSetAllEnabled(event.target.checked)} /></th>
              <th>Criterion</th>
              <th>Data range</th>
              <th>Filter min</th>
              <th>Filter max</th>
              <th>Direction</th>
              <th>Weight</th>
            </tr>
          </thead>
          <tbody>
            {criteria.map((criterion) => {
              const config = criteriaConfig[criterion];
              const range = stats[criterion];
              return (
                <tr className={config?.enabled ? 'enabled' : ''} key={criterion}>
                  <td><input aria-label={`Enable ${criterion}`} type="checkbox" checked={config?.enabled ?? false} onChange={(event) => onUpdate(criterion, 'enabled', event.target.checked)} /></td>
                  <th scope="row">{criterion}</th>
                  <td>{formatNumber(range?.min)} – {formatNumber(range?.max)}</td>
                  <td><input aria-label={`${criterion} minimum filter`} type="number" value={config?.minFilter ?? ''} onChange={(event) => onUpdate(criterion, 'minFilter', event.target.value)} /></td>
                  <td><input aria-label={`${criterion} maximum filter`} type="number" value={config?.maxFilter ?? ''} onChange={(event) => onUpdate(criterion, 'maxFilter', event.target.value)} /></td>
                  <td>
                    <select aria-label={`${criterion} direction`} value={config?.direction ?? DIRECTIONS.HIGHER} onChange={(event) => onUpdate(criterion, 'direction', event.target.value)}>
                      <option value={DIRECTIONS.HIGHER}>Higher is better</option>
                      <option value={DIRECTIONS.LOWER}>Lower is better</option>
                    </select>
                  </td>
                  <td><input aria-label={`${criterion} weight`} min="0" step="0.1" type="number" value={config?.weight ?? 1} onChange={(event) => onUpdate(criterion, 'weight', event.target.value)} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
