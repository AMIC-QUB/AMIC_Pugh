import { FiImage } from 'react-icons/fi';

export default function DesignCard({ design, criteria, imageUrl, onOpenImage }) {
  if (!design) {
    return <section className="panel design-card"><p className="empty-state">Select a design to inspect its scoring breakdown.</p></section>;
  }

  const enabledCriteria = criteria.filter((criterion) => design.scores[criterion] !== undefined);
  return (
    <section className="panel design-card" aria-labelledby="design-heading">
      <div className="design-summary">
        <div>
          <p className="eyebrow">Rank {design.rank}</p>
          <h2 id="design-heading">{design.name}</h2>
          <p className="score">{design.totalScore.toFixed(3)}</p>
        </div>
        {imageUrl ? <button className="image-button" type="button" onClick={() => onOpenImage(imageUrl, design.name)}><img alt={`${design.name} preview`} src={imageUrl} /></button> : <div className="image-placeholder"><FiImage size={34} /><span>No image supplied</span></div>}
      </div>
      <table className="breakdown-table"><thead><tr><th>Criterion</th><th>Value</th><th>Normalised score</th></tr></thead><tbody>{enabledCriteria.map((criterion) => <tr key={criterion}><th scope="row">{criterion}</th><td>{Number.isFinite(design.values[criterion]) ? design.values[criterion] : 'Missing'}</td><td>{design.scores[criterion].toFixed(2)}</td></tr>)}</tbody></table>
    </section>
  );
}
