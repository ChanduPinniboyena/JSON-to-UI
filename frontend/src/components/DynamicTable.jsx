import React, { useMemo, useState } from 'react';

/**
 * Renders a table dynamically based on the keys present in the data.
 * Purely presentation component - no column manipulation logic.
 */
function DynamicTable({ data, title, subtitle }) {
    // Generate headers from the first data item
    const columns = useMemo(() => {
        if (!data || data.length === 0) return [];

        return Object.keys(data[0]).map(key => ({
            key: key,
            label: formatColumnLabel(key)
        }));
    }, [data]);

    // Converts 'firstName' -> 'First Name'
    function formatColumnLabel(key) {
        if (key === 'id') return 'ID';
        if (key === 'ssn') return 'SSN';

        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    }

    function formatCellValue(value) {
        if (value === null || value === undefined) return '-';
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
