import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
interface Action {
  name: string;
  label: string;
  variant?: string; // para cambiar el color del botón
}

interface GenericTableProps {
  data: Record<string, any>[];
  columns: string[];
  actions: Action[];
  onAction: (name: string, item: Record<string, any>) => void;
}

const GenericTable: React.FC<GenericTableProps> = ({ data, columns, actions, onAction }) => {
  return (
    <div className="table-responsive mt-3">
      <table className="table table-striped table-bordered align-middle text-center shadow-sm">
        <thead className="table-dark">
          <tr>
            {columns.map((col) => (
              <th key={col} scope="col">
                {col}
              </th>
            ))}
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index}>
                {columns.map((col) => (
                  <td key={col}>{item[col]}</td>
                ))}
                <td>
                  {actions.map((action) => (
                    <button
                      key={action.name}
                      className={`btn btn-sm me-2 btn-${action.variant || "primary"}`}
                      onClick={() => onAction(action.name, item)}
                    >
                      {action.label}
                    </button>
                  ))}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1} className="text-muted">
                No hay datos disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GenericTable;

