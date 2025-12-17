import React, { useMemo, useState } from 'react';

/**
 * DynamicTable Component
 * Automatically renders a table based on the JSON structure
 * If columns are removed from JSON, they won't appear in the table
 * Users can also toggle column visibility from the frontend
 */
function DynamicTable({ data, title, subtitle }) {
    // Extract column headers dynamically from the first data object
    const columns = useMemo(() => {
        if (!data || data.length === 0) return [];

        const firstItem = data[0];
        return Object.keys(firstItem).map(key => ({
            key: key,
            label: formatColumnLabel(key)
        }));
    }, [data]);

    // State for column visibility
    const [visibleColumns, setVisibleColumns] = useState(() =>
        columns.map(col => col.key)
    );

    // State for column selector panel visibility
    const [showColumnSelector, setShowColumnSelector] = useState(false);

    // Update visible columns when data changes
    useMemo(() => {
        const allColumnKeys = columns.map(col => col.key);
        setVisibleColumns(prev => {
            // Keep only columns that still exist in the new data
            const validColumns = prev.filter(key => allColumnKeys.includes(key));
            // Add any new columns
            const newColumns = allColumnKeys.filter(key => !validColumns.includes(key));
            return [...validColumns, ...newColumns];
        });
    }, [columns]);

    // Filter columns based on visibility
    const displayColumns = useMemo(() =>
        columns.filter(col => visibleColumns.includes(col.key)),
        [columns, visibleColumns]
    );

    // Toggle column visibility
    const toggleColumn = (columnKey) => {
        setVisibleColumns(prev =>
            prev.includes(columnKey)
                ? prev.filter(key => key !== columnKey)
                : [...prev, columnKey]
        );
    };

    // Show all columns
    const showAllColumns = () => {
        setVisibleColumns(columns.map(col => col.key));
    };

    // Hide all columns
    const hideAllColumns = () => {
        setVisibleColumns([]);
    };

    // Format column labels for display (convert camelCase to Title Case)
    function formatColumnLabel(key) {
        // Handle special cases
        if (key === 'id') return 'ID';
        if (key === 'ssn') return 'SSN';

        // Convert camelCase to Title Case
        return key
            .replace(/([A-Z])/g, ' $1') // Add space before capital letters
            .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
            .trim();
    }

    // Format cell value for display
    function formatCellValue(value, key) {
        if (value === null || value === undefined) return '-';

        // Mask SSN partially for security
        if (key === 'ssn') {
            return value;
        }

        return value;
    }

    if (!data || data.length === 0) {
        return <div className="no-data">No data available</div>;
    }

    return (
        <div className="table-container">
            <div className="table-header">
                <div>
                    <h2>{title}</h2>
                    {subtitle && <p className="table-subtitle">{subtitle}</p>}
                </div>
                <button
                    className="column-toggle-btn"
                    onClick={() => setShowColumnSelector(!showColumnSelector)}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 12h18M3 6h18M3 18h18" />
                    </svg>
                    Customize Columns
                </button>
            </div>

            {showColumnSelector && (
                <div className="column-selector">
                    <div className="column-selector-header">
                        <h3>🎛️ Column Visibility</h3>
                        <div className="column-selector-actions">
                            <button onClick={showAllColumns} className="action-btn">
                                Show All
                            </button>
                            <button onClick={hideAllColumns} className="action-btn">
                                Hide All
                            </button>
                        </div>
                    </div>
                    <div className="column-list">
                        {columns.map((column) => (
                            <label key={column.key} className="column-checkbox">
                                <input
                                    type="checkbox"
                                    checked={visibleColumns.includes(column.key)}
                                    onChange={() => toggleColumn(column.key)}
                                />
                                <span>{column.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {displayColumns.length === 0 ? (
                <div className="no-columns-message">
                    <p>⚠️ No columns selected. Please select at least one column to display.</p>
                    <button onClick={showAllColumns} className="retry-btn">
                        Show All Columns
                    </button>
                </div>
            ) : (
                <>
                    <div className="table-wrapper">
                        <table className="dynamic-table">
                            <thead>
                                <tr>
                                    {displayColumns.map((column) => (
                                        <th key={column.key}>{column.label}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {displayColumns.map((column) => (
                                            <td key={`${rowIndex}-${column.key}`}>
                                                {formatCellValue(row[column.key], column.key)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="table-footer">
                        <p>Showing {data.length} {data.length === 1 ? 'row' : 'rows'} • {displayColumns.length} of {columns.length} {columns.length === 1 ? 'column' : 'columns'} visible</p>
                    </div>
                </>
            )}
        </div>
    );
}

export default DynamicTable;
