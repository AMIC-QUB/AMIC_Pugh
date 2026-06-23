import { useRef, useState } from 'react';
import { FiFileText, FiUpload } from 'react-icons/fi';
import { createDesigns, parseCsv, validateCsv } from '../utils/csvParser';

export default function FileUploader({ onDatasetLoaded }) {
  const inputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function loadFile(file) {
    if (!file) {
      return;
    }

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please choose a CSV file.');
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      const rows = await parseCsv(file);
      const validation = validateCsv(rows);
      if (validation.errors.length > 0) {
        setError(validation.errors.join(' '));
        return;
      }

      onDatasetLoaded({ ...createDesigns(rows), warnings: validation.warnings, fileName: file.name });
    } catch (loadError) {
      setError(`Unable to read this CSV: ${loadError.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  function handleDrop(event) {
    event.preventDefault();
    loadFile(event.dataTransfer.files[0]);
  }

  return (
    <section className="panel uploader-panel" aria-labelledby="upload-heading">
      <div>
        <h2 id="upload-heading">Load a design matrix</h2>
        <p className="muted">CSV layout: design name, image path, then numeric criteria.</p>
      </div>
      <div
        className="drop-zone"
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
      >
        <FiFileText aria-hidden="true" size={30} />
        <p>Drop a CSV here or choose a file.</p>
        <button className="button primary" type="button" onClick={() => inputRef.current?.click()}>
          <FiUpload aria-hidden="true" />
          {isLoading ? 'Loading…' : 'Choose CSV'}
        </button>
        <input
          ref={inputRef}
          className="visually-hidden"
          type="file"
          accept=".csv,text/csv"
          onChange={(event) => loadFile(event.target.files[0])}
        />
      </div>
      {error && <p className="alert error" role="alert">{error}</p>}
    </section>
  );
}
