import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FiImage, FiInfo, FiX } from 'react-icons/fi';
import ControlPanel from './components/ControlPanel';
import CriteriaPanel from './components/CriteriaPanel';
import DesignCard from './components/DesignCard';
import FileUploader from './components/FileUploader';
import ImageGallery from './components/ImageGallery';
import ResultsTable from './components/ResultsTable';
import { APP_NAME, IMAGE_SIZE_LIMIT_BYTES } from './utils/constants';
import { useCriteria } from './hooks/useCriteria';
import { useFiltering } from './hooks/useFiltering';
import { useScoring } from './hooks/useScoring';

function imageFileName(path) {
  return path.split(/[\\/]/).pop();
}

export default function App() {
  const imageInputRef = useRef(null);
  const [designs, setDesigns] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [datasetName, setDatasetName] = useState('');
  const [selectedDesignId, setSelectedDesignId] = useState(null);
  const [images, setImages] = useState({});
  const [imageError, setImageError] = useState('');
  const [galleryImage, setGalleryImage] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('amic-pugh-theme') ?? 'light');
  const {
    clearFilters,
    criteriaConfig,
    resetCriteria,
    setAllEnabled,
    stats,
    updateCriterion,
  } = useCriteria(designs, criteria);
  const filteredDesigns = useFiltering(designs, criteriaConfig);
  const scoredDesigns = useScoring(filteredDesigns, criteriaConfig);
  const selectedDesign = scoredDesigns.find((design) => design.id === selectedDesignId) ?? scoredDesigns[0];

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('amic-pugh-theme', theme);
  }, [theme]);

  function handleDatasetLoaded(dataset) {
    setDesigns(dataset.designs);
    setCriteria(dataset.criteria);
    resetCriteria(dataset.criteria);
    setWarnings(dataset.warnings);
    setDatasetName(dataset.fileName);
    setImages({});
    setSelectedDesignId(dataset.designs[0]?.id ?? null);
  }

  const getImageUrl = useCallback((design) => {
    if (!design?.imagePath) {
      return null;
    }

    // Direct web URLs work without a companion upload; local paths need one.
    if (/^(https?:|data:image\/)/i.test(design.imagePath)) {
      return design.imagePath;
    }

    return images[imageFileName(design.imagePath)] ?? null;
  }, [images]);

  const selectedImageUrl = useMemo(() => getImageUrl(selectedDesign), [getImageUrl, selectedDesign]);

  function handleImageFiles(files) {
    const uploadedFiles = Array.from(files);
    const oversized = uploadedFiles.find((file) => file.size > IMAGE_SIZE_LIMIT_BYTES);
    if (oversized) {
      setImageError(`"${oversized.name}" exceeds the 5 MB image limit.`);
      return;
    }

    setImageError('');
    uploadedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setImages((current) => ({ ...current, [file.name]: reader.result }));
      reader.readAsDataURL(file);
    });
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div><p className="eyebrow">Design concept selection</p><h1>{APP_NAME}</h1></div>
        <ControlPanel scoredDesigns={scoredDesigns} criteriaConfig={criteriaConfig} theme={theme} onClearFilters={clearFilters} onToggleTheme={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')} onShowHelp={() => setShowHelp(true)} />
      </header>

      <FileUploader onDatasetLoaded={handleDatasetLoaded} />

      {warnings.map((warning) => <p className="alert warning" key={warning}><FiInfo aria-hidden="true" />{warning}</p>)}

      {designs.length > 0 && <>
        <section className="panel image-import-panel" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); handleImageFiles(event.dataTransfer.files); }}>
          <div><h2>Optional design images</h2><p className="muted">Upload image files named to match the CSV image-path filenames. Images remain in this browser.</p></div>
          <button className="button secondary" type="button" onClick={() => imageInputRef.current?.click()}><FiImage />Add images</button>
          <input className="visually-hidden" ref={imageInputRef} type="file" accept="image/png,image/jpeg,image/gif,image/bmp,image/webp" multiple onChange={(event) => handleImageFiles(event.target.files)} />
          {imageError && <p className="alert error" role="alert">{imageError}</p>}
        </section>
        <p className="dataset-label">Loaded: <strong>{datasetName}</strong></p>
        <div className="workspace-grid">
          <CriteriaPanel criteria={criteria} criteriaConfig={criteriaConfig} stats={stats} onUpdate={updateCriterion} onSetAllEnabled={setAllEnabled} />
          <div className="results-stack">
            <ResultsTable designs={scoredDesigns} criteria={criteria} selectedDesign={selectedDesign} onSelectDesign={(design) => setSelectedDesignId(design.id)} totalCount={designs.length} />
            <DesignCard design={selectedDesign} criteria={criteria} imageUrl={selectedImageUrl} onOpenImage={(url, name) => setGalleryImage({ url, name })} />
          </div>
        </div>
      </>}

      {showHelp && <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="help-heading" onMouseDown={() => setShowHelp(false)}><section className="help-modal" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" type="button" aria-label="Close help" onClick={() => setShowHelp(false)}><FiX /></button><h2 id="help-heading">Using AMIC Pugh Matrix</h2><ol><li>Upload a CSV with design name, image path, and numeric criteria columns.</li><li>Choose each criterion’s direction and relative weight. Disable criteria that should not affect the decision.</li><li>Use min/max filters to remove designs before scoring.</li><li>Select a ranked design to inspect its raw values and normalised scores.</li><li>Export CSV for reporting or JSON to preserve the result and configuration.</li></ol><p>For a lower-is-better measure such as mass or cost, select “Lower is better”.</p></section></div>}
      <ImageGallery image={galleryImage} onClose={() => setGalleryImage(null)} />
    </main>
  );
}
