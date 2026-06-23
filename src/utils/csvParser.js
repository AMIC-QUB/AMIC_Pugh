import Papa from 'papaparse';

const MINIMUM_COLUMNS = 3;

export function parseCsv(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: 'greedy',
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error(results.errors[0].message));
          return;
        }

        resolve(results.data);
      },
      error: (error) => reject(error),
    });
  });
}

export function validateCsv(rows) {
  const errors = [];
  const warnings = [];
  const headers = rows[0] ? Object.keys(rows[0]) : [];

  if (rows.length === 0) {
    errors.push('The CSV contains no data rows.');
    return { errors, warnings, headers };
  }

  if (headers.length < MINIMUM_COLUMNS) {
    errors.push('The CSV needs a design name, image path, and at least one criterion.');
  }

  const criteria = headers.slice(2);
  if (criteria.some((criterion) => !criterion)) {
    errors.push('Each criterion column needs a header.');
  }

  const duplicateNames = new Set();
  const names = new Set();
  rows.forEach((row) => {
    const designName = row[headers[0]]?.trim();
    if (!designName) {
      errors.push('Every data row needs a design name in the first column.');
    } else if (names.has(designName)) {
      duplicateNames.add(designName);
    } else {
      names.add(designName);
    }
  });

  if (duplicateNames.size > 0) {
    warnings.push('Duplicate design names were found. Results are still calculated.');
  }

  criteria.forEach((criterion) => {
    const hasNumericValue = rows.some(
      (row) => row[criterion] !== '' && Number.isFinite(Number(row[criterion])),
    );
    if (!hasNumericValue) {
      warnings.push(`"${criterion}" has no numeric values and will score as zero.`);
    }
  });

  return { errors: [...new Set(errors)], warnings, headers };
}

export function createDesigns(rows) {
  const headers = Object.keys(rows[0] ?? {});
  const [designNameColumn, imagePathColumn, ...criteria] = headers;

  return {
    criteria,
    designs: rows.map((row, index) => ({
      id: `${index}-${row[designNameColumn]}`,
      name: row[designNameColumn]?.trim() || `Design ${index + 1}`,
      imagePath: row[imagePathColumn]?.trim() || '',
      values: Object.fromEntries(
        criteria.map((criterion) => [
          criterion,
          row[criterion] === '' || row[criterion] == null ? null : Number(row[criterion]),
        ]),
      ),
    })),
  };
}
