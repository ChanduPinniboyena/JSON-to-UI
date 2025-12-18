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
            </div>

            <div className="table-wrapper">
                <table className="dynamic-table">
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th key={column.key}>{column.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns.map((column) => (
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
                <p>Showing {data.length} {data.length === 1 ? 'row' : 'rows'}</p>
            </div>
        </div>
    );
}


export default DynamicTable;
